import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { user, openAuthModal } = useAuth();
    const { cart, removeFromCart, getCartTotal, cartCount } = useCart();

    const handleRemove = async (courseId) => {
        const result = await removeFromCart(courseId);
        if (!result.success) {
            alert('Failed to remove item from cart');
        }
    };

    const handleCheckoutAll = () => {
        if (!user) {
            openAuthModal();
            return;
        }
        // Navigate to payment with all cart items
        navigate('/payment/cart');
    };

    const handleCheckoutSingle = (courseId) => {
        if (!user) {
            openAuthModal();
            return;
        }
        // Navigate to payment for single course
        navigate(`/payment/${courseId}`);
    };

    if (!user) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <h2>Please log in to view your cart</h2>
                        <button className="btn btn-primary" onClick={openAuthModal}>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Explore our courses and add some to your cart!</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Browse Courses
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="cart-title">Shopping Cart</h1>
                <p className="cart-subtitle">{cartCount} {cartCount === 1 ? 'course' : 'courses'} in cart</p>

                <div className="cart-content">
                    <div className="cart-items">
                        {cart.map((course) => (
                            <div key={course._id} className="cart-item">
                                <img src={course.image} alt={course.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3 className="cart-item-title">{course.title}</h3>
                                    <p className="cart-item-instructor">By {course.instructorName}</p>
                                    <div className="cart-item-meta">
                                        <span className="cart-item-rating">⭐ {course.rating}</span>
                                        <span className="cart-item-level">{course.level}</span>
                                        <span className="cart-item-duration">{course.duration}</span>
                                    </div>
                                </div>
                                <div className="cart-item-actions">
                                    <div className="cart-item-price">₹{course.price}</div>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleCheckoutSingle(course._id)}
                                    >
                                        Pay Now
                                    </button>
                                    <button
                                        className="btn-remove"
                                        onClick={() => handleRemove(course._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal ({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>
                            <span>₹{getCartTotal()}</span>
                        </div>
                        <div className="summary-row total-row">
                            <span>Total</span>
                            <span className="total-amount">₹{getCartTotal()}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-checkout"
                            onClick={handleCheckoutAll}
                        >
                            Checkout All
                        </button>
                        <p className="money-back-guarantee">30-Day Money-Back Guarantee</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
