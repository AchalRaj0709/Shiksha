import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Generate JWT Access Token
export const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Generate JWT Refresh Token
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
};

// Verify JWT Token
export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Generate random token for email verification/password reset
export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Hash token for storage
export const hashToken = (token) => {
    return crypto.createHash('sha256').update(token).digest('hex');
};

// Generate 2FA backup codes
export const generateBackupCodes = (count = 10) => {
    const codes = [];
    for (let i = 0; i < count; i++) {
        const code = crypto.randomBytes(4).toString('hex').toUpperCase();
        codes.push(code);
    }
    return codes;
};
