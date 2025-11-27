import { createContext, useContext, useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { isAuthenticated } = useAuth();
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlistIds(new Set());
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistAPI.getWishlist();
            const ids = new Set(response.data.data.map(course => course._id));
            setWishlistIds(ids);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWishlist = (courseId) => {
        setWishlistIds(prev => new Set([...prev, courseId]));
    };

    const removeFromWishlist = (courseId) => {
        setWishlistIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(courseId);
            return newSet;
        });
    };

    const isInWishlist = (courseId) => {
        return wishlistIds.has(courseId);
    };

    const value = {
        wishlistIds,
        loading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        refreshWishlist: fetchWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
}
