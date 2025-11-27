import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import './AccountSettings.css';

const AccountSettings = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await authAPI.updateProfile(formData);
            if (response.data.success) {
                setMessage({ type: 'success', text: response.data.message });
                // Update user in context
                setUser(response.data.data.user);

                // If email was changed, show additional message
                if (formData.email !== user.email) {
                    setMessage({
                        type: 'success',
                        text: 'Profile updated! Please check your new email to verify it.'
                    });
                }
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="account-settings-page">
                <div className="container">
                    <div className="settings-error">
                        <p>Please log in to access account settings.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="account-settings-page">
            <div className="container">
                <div className="settings-header">
                    <h1>Account Settings</h1>
                    <p>Manage your account information</p>
                </div>

                <div className="settings-content">
                    <div className="settings-card">
                        <h2>Profile Information</h2>

                        {message.text && (
                            <div className={`message message-${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="settings-form">
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                                {!user.isEmailVerified && (
                                    <span className="email-status-badge unverified">
                                        Email not verified
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>

                    <div className="settings-card">
                        <h2>Account Status</h2>
                        <div className="account-info">
                            <div className="info-item">
                                <span className="info-label">Email Verification:</span>
                                <span className={`info-value ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
                                    {user.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Two-Factor Auth:</span>
                                <span className={`info-value ${user.twoFactorEnabled ? 'enabled' : 'disabled'}`}>
                                    {user.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">Account Role:</span>
                                <span className="info-value">{user.role || 'Student'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
