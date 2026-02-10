import { authRateLimiter, registerRateLimiter } from '@/lib/authRateLimiter'
import { useRateLimiter } from '@tanstack/react-pacer'
import { useEffect, useState, useMemo } from 'react'

export const useRateLimitState = (type: 'login' | 'register') => {
  const limiter = type === 'login' ? authRateLimiter : registerRateLimiter;
  const limit = type === 'login' ? 5 : 3;
  const windowMs = type === 'login' ? 15 * 60 * 1000 : 60 * 60 * 1000;

  const rateLimiter = useRateLimiter(
    limiter,
    { limit, window: windowMs, windowType: 'fixed' },
    (state) => ({ isExceeded: state.isExceeded })
  );

  const { isExceeded } = rateLimiter.state;
  const [timeRemaining, setTimeRemaining] = useState(0);

  // 1. CALCULATE remaining ms (pure - based only on dependencies)
  const msUntilNextWindow = useMemo(() => {
    const msUntilNext = rateLimiter.getMsUntilNextWindow();
    if (!isExceeded || msUntilNext <= 0) return 0;
    return msUntilNext;
  }, [isExceeded, rateLimiter]);

  // 2. MANAGE blockedUntil state with useEffect (avoid synchronous setState)
  const [blockedUntil, setBlockedUntil] = useState<Date | undefined>();

  useEffect(() => {
    if (!isExceeded || msUntilNextWindow === 0) {
      setTimeout(() => {
        setBlockedUntil(undefined);
        setTimeRemaining(0);
      }, 0);
      return;
    }

    // Use setTimeout to avoid synchronous setState calls
    const now = Date.now();
    const newBlockedUntil = new Date(now + msUntilNextWindow);
    
    setTimeout(() => {
      setBlockedUntil(newBlockedUntil);
      setTimeRemaining(msUntilNextWindow);
    }, 0);

    // Countdown interval
    const interval = setInterval(() => {
      const currentNow = Date.now();
      const remaining = newBlockedUntil.getTime() - currentNow;
      
      if (remaining <= 0) {
        setTimeRemaining(0);
        clearInterval(interval);
      } else {
        setTimeRemaining(remaining);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isExceeded, msUntilNextWindow]);

  return {
    isBlocked: isExceeded,
    remainingAttempts: rateLimiter.getRemainingInWindow(),
    timeRemaining,
    isLoading: false,
    blockedUntil,
  };
};