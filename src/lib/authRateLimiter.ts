import {rateLimit} from "@tanstack/react-pacer";

export const authRateLimiter = rateLimit(
  (email: string) => {
    // Placeholder: your login logic here (or call it separately)
    console.log(`Login attempt for ${email}`)
    // Return true/false or throw on failure
  },
  {
    limit: 5,
    window: 15 * 60 * 1000, // 15 min
    windowType: 'fixed',
    onReject: (limiter) => {
      console.log(`Login rate limit exceeded. Try again in ${limiter.getMsUntilNextWindow()}ms`)
    }
  }
)

export const registerRateLimiter = rateLimit(
  (email: string) => {
    console.log(`Register attempt for ${email}`)
  },
  {
    limit: 3,
    window: 60 * 60 * 1000, // 1 hour
    windowType: 'fixed',
    onReject: (limiter) => {
      console.log(`Register rate limit exceeded. Try again in ${limiter.getMsUntilNextWindow()}ms`)
    }
  }
)