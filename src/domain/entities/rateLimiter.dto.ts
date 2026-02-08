export interface RateLimiterDTO {
  isBlocked: boolean;
  remaining: number;
  resetTime: number;
  blockedUntil: number | undefined;
}


export interface RateLimitState {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}