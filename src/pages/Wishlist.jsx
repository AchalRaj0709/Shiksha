import { useState, useEffect } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import CourseCard from '../components/CourseCard';
import './Wishlist.css';

function Wishlist() {
    const { isAuthenticated } = useAuth();
    const { wishlistIds } = useWishlist();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
            setLoading(false);
        }
    }, [isAuthenticated, wishlistIds]); // Re-fetch when wishlistIds changes

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistAPI.getWishlist();
            setWishlist(response.data.data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-auth-required">
                    <h2>🔒 Authentication Required</h2>
                    <p>Please sign in to view your wishlist.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="wishlist-container">
                <div className="wishlist-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="container wishlist-content">
                <div className="wishlist-header">
                    <h1>❤️ My Wishlist</h1>
                    <p>{wishlist.length} {wishlist.length === 1 ? 'course' : 'courses'} saved</p>
                </div>

                {wishlist.length > 0 ? (
                    <div className="wishlist-grid">
                        {wishlist.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="wishlist-empty">
                        <div className="empty-icon">💔</div>
                        <h3>Your Wishlist is Empty</h3>
                        <p>Start adding courses you love to your wishlist!</p>
                        <a href="/" className="btn btn-primary">Browse Courses</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;
