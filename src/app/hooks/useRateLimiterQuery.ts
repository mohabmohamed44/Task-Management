// src/hooks/useRateLimitQuery.ts
import { useQuery } from "@tanstack/react-query";
import { authRateLimiter, registerRateLimiter } from "@/lib/authRateLimiter";
import type { RateLimiterDTO } from "@/domain/entities/rateLimiter.dto";

export const useRateLimitQuery = (
    email: string,
    type: "login" | "register",
) => {
    return useQuery<RateLimiterDTO>({
        queryKey: ["rate-limit", email, type],
        queryFn: () => {
            const limiter =
                type === "login" ? authRateLimiter : registerRateLimiter;
            const result = limiter.recordAttempt(email);
            return {
                isBlocked: !result.allowed,
                remaining: result.remaining,
                resetTime: result.resetTime,
                blockedUntil: result.blockedUntil,
            };
        },
        staleTime: 0, // Always consider data stale for real-time updates
        refetchOnWindowFocus: false,
    });
};
