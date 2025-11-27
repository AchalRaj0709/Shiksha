import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes'
    },
    skipSuccessfulRequests: true, // Don't count successful requests
    standardHeaders: true,
    legacyHeaders: false,
});

// Email sending rate limiter
export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 emails per hour
    message: {
        success: false,
        message: 'Too many email requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
