import type { RateLimitConfig, RateLimitState } from "@/domain/entities/rateLimiter.dto";


export class RateLimiter {
  private attempts: Map<string, RateLimitState> = new Map();
  
  constructor(private config: RateLimitConfig) {}
  
  isBlocked(identifier: string): boolean {
    const state = this.attempts.get(identifier);
    if (!state) return false;
    
    if (state.blockedUntil && Date.now() < state.blockedUntil) {
      return true;
    }
    
    if (Date.now() > state.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }
    
    return false;
  }
  
  recordAttempt(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    blockedUntil?: number;
  } {
    if (this.isBlocked(identifier)) {
      const state = this.attempts.get(identifier)!;
      return {
        allowed: false,
        remaining: 0,
        resetTime: state.resetTime,
        blockedUntil: state.blockedUntil
      };
    }
    
    const now = Date.now();
    const existing = this.attempts.get(identifier);
    
    if (!existing || now > existing.resetTime) {
      const newState: RateLimitState = {
        count: 1,
        resetTime: now + this.config.windowMs
      };
      this.attempts.set(identifier, newState);
      
      return {
        allowed: true,
        remaining: this.config.maxAttempts - 1,
        resetTime: newState.resetTime
      };
    }
    
    const newCount = existing.count + 1;
    
    if (newCount >= this.config.maxAttempts) {
      const blockedState: RateLimitState = {
        count: newCount,
        resetTime: existing.resetTime,
        blockedUntil: now + this.config.blockDurationMs
      };
      this.attempts.set(identifier, blockedState);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
        blockedUntil: blockedState.blockedUntil
      };
    }
    
    existing.count = newCount;
    
    return {
      allowed: true,
      remaining: this.config.maxAttempts - newCount,
      resetTime: existing.resetTime
    };
  }
  
  clearAttempts(identifier: string): void {
    this.attempts.delete(identifier);
  }
}