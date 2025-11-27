import { useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import './WishlistButton.css';

function WishlistButton({ courseId }) {
    const { isAuthenticated } = useAuth();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(false);
    const isWishlisted = isInWishlist(courseId);

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert('Please sign in to add courses to your wishlist');
            return;
        }

        setIsLoading(true);

        try {
            if (isWishlisted) {
                await wishlistAPI.removeFromWishlist(courseId);
                removeFromWishlist(courseId);
            } else {
                await wishlistAPI.addToWishlist(courseId);
                addToWishlist(courseId);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert('Failed to update wishlist. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            className={`wishlist-button ${isWishlisted ? 'wishlisted' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleToggleWishlist}
            disabled={isLoading}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                className="heart-icon"
                viewBox="0 0 24 24"
                fill={isWishlisted ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
}

export default WishlistButton;
