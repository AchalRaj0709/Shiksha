import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    },
    role: {
        type: String,
        enum: ['user', 'instructor', 'admin'],
        default: 'user'
    },

    // Email Verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Two-Factor Authentication
    twoFactorSecret: String,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorBackupCodes: [String],

    // OAuth
    googleId: String,
    githubId: String,

    // Refresh Token
    refreshToken: String,

    // User Activity
    lastLogin: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,

    // User Preferences
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        courseUpdates: {
            type: Boolean,
            default: true
        }
    },

    // Wishlist
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],

    // Shopping Cart
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Check if account is locked
userSchema.methods.isLocked = function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Increment login attempts
userSchema.methods.incLoginAttempts = function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };
    const maxAttempts = 5;
    const lockTime = 2 * 60 * 60 * 1000; // 2 hours

    // Lock the account if we've reached max attempts
    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked()) {
        updates.$set = { lockUntil: Date.now() + lockTime };
    }

    return this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $set: { loginAttempts: 0 },
        $unset: { lockUntil: 1 }
    });
};

// Generate avatar URL based on email
userSchema.methods.generateAvatar = function () {
    const seed = this.email || this.name || 'default';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
};

// Update last login
userSchema.methods.updateLastLogin = function () {
    this.lastLogin = Date.now();
    return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
