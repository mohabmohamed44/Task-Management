import { RateLimiter } from "./rateLimiter";

export const authRateLimiter = new RateLimiter({
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 15 * 60 * 1000
});

export const registerRateLimiter = new RateLimiter({
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
});


