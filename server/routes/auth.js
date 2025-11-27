import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { authLimiter, emailLimiter } from '../middleware/rateLimiter.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
    generateRandomToken,
    hashToken,
    generateBackupCodes
} from '../utils/jwt.js';
import {
    sendVerificationEmail,
    sendPasswordResetEmail,
    send2FASetupEmail
} from '../utils/email.js';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

const router = express.Router();

// Validation middleware
const validateRegistration = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, validateRegistration, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        user = await User.create({
            name,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
        });

        // Generate email verification token
        const verificationToken = generateRandomToken();
        const hashedToken = hashToken(verificationToken);

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Send verification email
        try {
            await sendVerificationEmail(user.email, user.name, verificationToken);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { email, password, twoFactorCode } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is locked
        if (user.isLocked()) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to too many failed login attempts. Please try again later.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            await user.incLoginAttempts();
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if 2FA is enabled
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: true,
                    requiresTwoFactor: true,
                    message: 'Please provide your 2FA code'
                });
            }

            // Verify 2FA code
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorCode,
                window: 2
            });

            // Check backup codes if TOTP fails
            let usedBackupCode = false;
            if (!verified && user.twoFactorBackupCodes && user.twoFactorBackupCodes.length > 0) {
                const backupIndex = user.twoFactorBackupCodes.indexOf(twoFactorCode);
                if (backupIndex !== -1) {
                    user.twoFactorBackupCodes.splice(backupIndex, 1);
                    usedBackupCode = true;
                    await user.save();
                }
            }

            if (!verified && !usedBackupCode) {
                await user.incLoginAttempts();
                return res.status(401).json({
                    success: false,
                    message: 'Invalid 2FA code'
                });
            }
        }

        // Reset login attempts on successful login
        await user.resetLoginAttempts();
        await user.updateLastLogin();

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    twoFactorEnabled: user.twoFactorEnabled
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find user
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id);

        res.json({
            success: true,
            data: {
                accessToken
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired refresh token',
            error: error.message
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { name, email } = req.body;
        const user = req.user;

        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email is already in use'
                });
            }

            // If email is changed, mark as unverified and send verification email
            user.email = email;
            user.isEmailVerified = false;

            const verificationToken = generateRandomToken();
            const hashedToken = hashToken(verificationToken);
            user.emailVerificationToken = hashedToken;
            user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;

            try {
                await sendVerificationEmail(email, name || user.name, verificationToken);
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
            }
        }

        if (name) {
            user.name = name;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    twoFactorEnabled: user.twoFactorEnabled
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, async (req, res) => {
    try {
        // Clear refresh token
        req.user.refreshToken = undefined;
        await req.user.save();

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during logout',
            error: error.message
        });
    }
});

// @route   POST /api/auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.post('/verify-email/:token', async (req, res) => {
    try {
        const hashedToken = hashToken(req.params.token);

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during email verification',
            error: error.message
        });
    }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Private
router.post('/resend-verification', protect, emailLimiter, async (req, res) => {
    try {
        if (req.user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        const verificationToken = generateRandomToken();
        const hashedToken = hashToken(verificationToken);

        req.user.emailVerificationToken = hashedToken;
        req.user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
        await req.user.save();

        await sendVerificationEmail(req.user.email, req.user.name, verificationToken);

        res.json({
            success: true,
            message: 'Verification email sent'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to send verification email',
            error: error.message
        });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', emailLimiter, [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Don't reveal if user exists
            return res.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent'
            });
        }

        const resetToken = generateRandomToken();
        const hashedToken = hashToken(resetToken);

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(user.email, user.name, resetToken);

        res.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request',
            error: error.message
        });
    }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const hashedToken = hashToken(req.params.token);

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.refreshToken = undefined; // Invalidate all sessions
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successful. Please login with your new password.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
});

// @route   POST /api/auth/2fa/setup
// @desc    Setup 2FA
// @access  Private
router.post('/2fa/setup', protect, async (req, res) => {
    try {
        if (req.user.twoFactorEnabled) {
            return res.status(400).json({
                success: false,
                message: '2FA is already enabled'
            });
        }

        // Generate secret
        const secret = speakeasy.generateSecret({
            name: `Shiksha (${req.user.email})`,
            issuer: 'Shiksha'
        });

        // Generate QR code
        const qrCode = await QRCode.toDataURL(secret.otpauth_url);

        // Generate backup codes
        const backupCodes = generateBackupCodes();

        // Save secret (but don't enable yet)
        req.user.twoFactorSecret = secret.base32;
        req.user.twoFactorBackupCodes = backupCodes;
        await req.user.save();

        res.json({
            success: true,
            message: '2FA setup initiated. Please scan the QR code and verify with a code.',
            data: {
                secret: secret.base32,
                qrCode,
                backupCodes
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to setup 2FA',
            error: error.message
        });
    }
});

// @route   POST /api/auth/2fa/verify
// @desc    Verify and enable 2FA
// @access  Private
router.post('/2fa/verify', protect, [
    body('code').notEmpty().withMessage('2FA code is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        if (!req.user.twoFactorSecret) {
            return res.status(400).json({
                success: false,
                message: 'Please setup 2FA first'
            });
        }

        const verified = speakeasy.totp.verify({
            secret: req.user.twoFactorSecret,
            encoding: 'base32',
            token: req.body.code,
            window: 2
        });

        if (!verified) {
            return res.status(400).json({
                success: false,
                message: 'Invalid 2FA code'
            });
        }

        req.user.twoFactorEnabled = true;
        await req.user.save();

        // Send confirmation email
        try {
            await send2FASetupEmail(req.user.email, req.user.name, req.user.twoFactorBackupCodes);
        } catch (emailError) {
            console.error('Failed to send 2FA email:', emailError);
        }

        res.json({
            success: true,
            message: '2FA enabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to verify 2FA',
            error: error.message
        });
    }
});

// @route   POST /api/auth/2fa/disable
// @desc    Disable 2FA
// @access  Private
router.post('/2fa/disable', protect, [
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(req.body.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }

        user.twoFactorEnabled = false;
        user.twoFactorSecret = undefined;
        user.twoFactorBackupCodes = undefined;
        await user.save();

        res.json({
            success: true,
            message: '2FA disabled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to disable 2FA',
            error: error.message
        });
    }
});

export default router;
