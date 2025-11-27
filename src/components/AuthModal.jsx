import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode); // 'login', 'signup', 'forgot', '2fa'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        twoFactorCode: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [requires2FA, setRequires2FA] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, login, forgotPassword } = useAuth();

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            if (mode === 'signup') {
                if (formData.password !== formData.confirmPassword) {
                    setMessage({ type: 'error', text: 'Passwords do not match' });
                    setIsLoading(false);
                    return;
                }

                const result = await register(formData.name, formData.email, formData.password);
                if (result.success) {
                    setMessage({ type: 'success', text: result.message });
                    setTimeout(() => {
                        onClose();
                    }, 2000);
                } else {
                    setMessage({ type: 'error', text: result.message });
                }
            } else if (mode === 'login' || mode === '2fa') {
                const result = await login(
                    formData.email,
                    formData.password,
                    mode === '2fa' ? formData.twoFactorCode : null
                );

                if (result.requiresTwoFactor) {
                    setRequires2FA(true);
                    setMode('2fa');
                    setMessage({ type: 'info', text: result.message });
                } else if (result.success) {
                    setMessage({ type: 'success', text: 'Login successful!' });
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                } else {
                    setMessage({ type: 'error', text: result.message });
                }
            } else if (mode === 'forgot') {
                const result = await forgotPassword(formData.email);
                setMessage({
                    type: result.success ? 'success' : 'error',
                    text: result.message
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setMessage({ type: '', text: '' });
        setFormData({
            name: '',
            email: formData.email, // Keep email when switching
            password: '',
            confirmPassword: '',
            twoFactorCode: ''
        });
        setRequires2FA(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    return (
        <div className="auth-modal-overlay" onClick={onClose}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="auth-modal-close" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <div className="auth-modal-header">
                    <h2>
                        {mode === 'login' && '👋 Welcome Back'}
                        {mode === 'signup' && '🚀 Create Account'}
                        {mode === 'forgot' && '🔒 Reset Password'}
                        {mode === '2fa' && '🔐 Two-Factor Authentication'}
                    </h2>
                    <p className="text-muted">
                        {mode === 'login' && 'Sign in to continue learning'}
                        {mode === 'signup' && 'Join thousands of learners worldwide'}
                        {mode === 'forgot' && 'Enter your email to receive reset instructions'}
                        {mode === '2fa' && 'Enter your 6-digit authentication code'}
                    </p>
                </div>

                {message.text && (
                    <div className={`auth-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {mode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                    )}

                    {mode !== '2fa' && (
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    )}

                    {(mode === 'login' || mode === 'signup') && (
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === 'signup' && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {mode === '2fa' && (
                        <div className="form-group">
                            <label htmlFor="twoFactorCode">Authentication Code</label>
                            <input
                                type="text"
                                id="twoFactorCode"
                                name="twoFactorCode"
                                value={formData.twoFactorCode}
                                onChange={handleChange}
                                placeholder="Enter 6-digit code"
                                required
                                maxLength={6}
                                pattern="[0-9]{6}"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary auth-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner">⏳ Processing...</span>
                        ) : (
                            <>
                                {mode === 'login' && 'Sign In'}
                                {mode === 'signup' && 'Create Account'}
                                {mode === 'forgot' && 'Send Reset Link'}
                                {mode === '2fa' && 'Verify Code'}
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-modal-footer">
                    {mode === 'login' && (
                        <>
                            <button
                                type="button"
                                className="auth-link-btn"
                                onClick={() => switchMode('forgot')}
                            >
                                Forgot password?
                            </button>
                            <p>
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    className="auth-link-btn primary"
                                    onClick={() => switchMode('signup')}
                                >
                                    Sign up
                                </button>
                            </p>
                        </>
                    )}

                    {mode === 'signup' && (
                        <p>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="auth-link-btn primary"
                                onClick={() => switchMode('login')}
                            >
                                Sign in
                            </button>
                        </p>
                    )}

                    {mode === 'forgot' && (
                        <p>
                            Remember your password?{' '}
                            <button
                                type="button"
                                className="auth-link-btn primary"
                                onClick={() => switchMode('login')}
                            >
                                Sign in
                            </button>
                        </p>
                    )}

                    {mode === '2fa' && (
                        <p>
                            <button
                                type="button"
                                className="auth-link-btn primary"
                                onClick={() => switchMode('login')}
                            >
                                Back to login
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthModal;
