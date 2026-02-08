// src/hooks/useRateLimitState.ts
import { useState, useEffect } from 'react';
import { useRateLimitQuery } from '@/app/hooks/useRateLimiterQuery';

export const useRateLimitState = (email: string, type: 'login' | 'register') => {
  const { data: rateLimitData, isLoading } = useRateLimitQuery(email, type);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
  if (!rateLimitData?.blockedUntil) return;

  const blockedUntil = rateLimitData.blockedUntil; // Capture the value

  const interval = setInterval(() => {
    const remaining = Math.max(0, blockedUntil - Date.now()); // Use captured value
    setTimeRemaining(remaining);
    
    if (remaining === 0) {
      clearInterval(interval);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [rateLimitData?.blockedUntil]);

  return {
    isBlocked: rateLimitData?.isBlocked || false,
    remainingAttempts: rateLimitData?.remaining || 5,
    timeRemaining,
    isLoading,
    blockedUntil: rateLimitData?.blockedUntil,
  };
};