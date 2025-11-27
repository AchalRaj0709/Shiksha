import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors and token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    const response = await axios.post(`${apiUrl}/auth/refresh-token`, {
                        refreshToken
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/profile', data),
    verifyEmail: (token) => api.post(`/auth/verify-email/${token}`),
    resendVerification: () => api.post('/auth/resend-verification'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
    setup2FA: () => api.post('/auth/2fa/setup'),
    verify2FA: (code) => api.post('/auth/2fa/verify', { code }),
    disable2FA: (password) => api.post('/auth/2fa/disable', { password })
};

// Course API calls
export const courseAPI = {
    getAll: (params) => api.get('/courses', { params }),
    getById: (id) => api.get(`/courses/${id}`),
    enroll: (id) => api.post(`/courses/${id}/enroll`),
    addReview: (id, data) => api.post(`/courses/${id}/review`, data),
    getMyEnrolled: () => api.get('/courses/my/enrolled')
};

// Progress API calls
export const progressAPI = {
    getStats: (period = 'weekly') => api.get(`/progress/stats?period=${period}`),
    logActivity: (data) => api.post('/progress/log', data),
    getStreak: () => api.get('/progress/streak'),
    getEnrolledCourses: () => api.get('/progress/enrolled-courses')
};

// Wishlist API calls
export const wishlistAPI = {
    getWishlist: () => api.get('/wishlist'),
    addToWishlist: (courseId) => api.post(`/wishlist/${courseId}`),
    removeFromWishlist: (courseId) => api.delete(`/wishlist/${courseId}`)
};

// Cart API calls
export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (courseId) => api.post('/cart/add', { courseId }),
    removeFromCart: (courseId) => api.delete(`/cart/remove/${courseId}`),
    clearCart: () => api.delete('/cart/clear')
};

export default api;
