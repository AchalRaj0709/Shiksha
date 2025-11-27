import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch cart when user logs in
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.getCart();
            if (response.data.success) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (courseId) => {
        try {
            const response = await cartAPI.addToCart(courseId);
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add to cart'
            };
        }
    };

    const removeFromCart = async (courseId) => {
        try {
            const response = await cartAPI.removeFromCart(courseId);
            if (response.data.success) {
                setCart(response.data.data);
                return { success: true };
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { success: false };
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartAPI.clearCart();
            if (response.data.success) {
                setCart([]);
                return { success: true };
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            return { success: false };
        }
    };

    const isInCart = (courseId) => {
        return cart.some(course => course._id === courseId);
    };

    const getCartTotal = () => {
        return cart.reduce((total, course) => total + course.price, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        getCartTotal,
        cartCount: cart.length,
        refreshCart: fetchCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
