import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('accessToken');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                    // Optionally verify token is still valid
                    const response = await authAPI.getMe();
                    setUser(response.data.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                } catch (error) {
                    console.error('Failed to load user:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const register = async (name, email, password) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authAPI.register({ name, email, password });
            const { user, accessToken, refreshToken } = response.data.data;

            // Save tokens and user
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setLoading(false);

            return { success: true, message: response.data.message };
        } catch (error) {
            setLoading(false);
            const message = error.response?.data?.message || 'Registration failed';
            setError(message);
            return { success: false, message };
        }
    };

    const login = async (email, password, twoFactorCode = null) => {
        try {
            setError(null);
            setLoading(true);

            const response = await authAPI.login({ email, password, twoFactorCode });

            // Check if 2FA is required
            if (response.data.requiresTwoFactor) {
                setLoading(false);
                return {
                    success: true,
                    requiresTwoFactor: true,
                    message: response.data.message
                };
            }

            const { user, accessToken, refreshToken } = response.data.data;

            // Save tokens and user
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setLoading(false);

            return { success: true, message: 'Login successful' };
        } catch (error) {
            setLoading(false);
            const message = error.response?.data?.message || 'Login failed';
            setError(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    const verifyEmail = async (token) => {
        try {
            const response = await authAPI.verifyEmail(token);
            // Update user state
            if (user) {
                const updatedUser = { ...user, isEmailVerified: true };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Email verification failed';
            return { success: false, message };
        }
    };

    const resendVerification = async () => {
        try {
            const response = await authAPI.resendVerification();
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to resend verification email';
            return { success: false, message };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await authAPI.forgotPassword(email);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to send reset email';
            return { success: false, message };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await authAPI.resetPassword(token, password);
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Password reset failed';
            return { success: false, message };
        }
    };

    const setup2FA = async () => {
        try {
            const response = await authAPI.setup2FA();
            return { success: true, data: response.data.data };
        } catch (error) {
            const message = error.response?.data?.message || '2FA setup failed';
            return { success: false, message };
        }
    };

    const verify2FA = async (code) => {
        try {
            const response = await authAPI.verify2FA(code);
            // Update user state
            if (user) {
                const updatedUser = { ...user, twoFactorEnabled: true };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || '2FA verification failed';
            return { success: false, message };
        }
    };

    const disable2FA = async (password) => {
        try {
            const response = await authAPI.disable2FA(password);
            // Update user state
            if (user) {
                const updatedUser = { ...user, twoFactorEnabled: false };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            return { success: true, message: response.data.message };
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to disable 2FA';
            return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        setup2FA,
        verify2FA,
        disable2FA,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
