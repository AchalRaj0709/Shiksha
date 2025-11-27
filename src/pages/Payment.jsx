import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { cart, clearCart, getCartTotal } = useCart();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Determine if this is a cart checkout
    const isCartCheckout = courseId === 'cart';
    const coursesToPurchase = isCartCheckout ? cart : (course ? [course] : []);
    const totalAmount = isCartCheckout ? getCartTotal() : (course?.price || 0);

    // Form state
    const [formData, setFormData] = useState({
        cardName: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    useEffect(() => {
        const fetchCourse = async () => {
            // Skip fetching if this is a cart checkout
            if (isCartCheckout) {
                setLoading(false);
                return;
            }

            try {
                const response = await courseAPI.getById(courseId);
                if (response.data.success) {
                    setCourse(response.data.data.course);
                }
            } catch (error) {
                console.error('Error fetching course:', error);
                alert('Failed to load course details');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchCourse();
        }
    }, [courseId, navigate, isCartCheckout]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);

        // Simulate payment processing delay
        setTimeout(async () => {
            try {
                if (isCartCheckout) {
                    // Enroll in all cart courses
                    const enrollmentPromises = cart.map(course => courseAPI.enroll(course._id));
                    await Promise.all(enrollmentPromises);

                    // Clear cart after successful enrollment
                    await clearCart();

                    // Redirect to My Learning page
                    navigate('/my-learning', {
                        state: { enrolled: true, message: `Payment successful! You are now enrolled in ${cart.length} courses.` }
                    });
                } else {
                    // Single course enrollment
                    const response = await courseAPI.enroll(courseId);
                    if (response.data.success) {
                        // Success! Redirect back to course page
                        navigate(`/course/${courseId}`, {
                            state: { enrolled: true, message: 'Payment successful! You are now enrolled.' }
                        });
                    }
                }
            } catch (error) {
                console.error('Enrollment error:', error);
                alert(error.response?.data?.message || 'Payment failed. Please try again.');
                setProcessing(false);
            }
        }, 2000);
    };

    if (loading) return <div className="loading-spinner">Loading payment details...</div>;
    if (!isCartCheckout && !course) return null;
    if (isCartCheckout && cart.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="payment-header">
                    <h1>Checkout</h1>
                    <p>Complete your purchase to start learning</p>
                </div>

                <div className="payment-content">
                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        {isCartCheckout ? (
                            <>
                                {cart.map((course) => (
                                    <div key={course._id} className="course-summary-card">
                                        <img src={course.image} alt={course.title} />
                                        <div className="course-summary-info">
                                            <h4>{course.title}</h4>
                                            <p className="instructor">By {course.instructorName}</p>
                                            <div className="price-row">
                                                <span className="current-price">₹{course.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="course-summary-card">
                                <img src={course.image} alt={course.title} />
                                <div className="course-summary-info">
                                    <h4>{course.title}</h4>
                                    <p className="instructor">By {course.instructorName}</p>
                                    <div className="price-row">
                                        <span className="current-price">₹{course.price}</span>
                                        {course.originalPrice && (
                                            <span className="original-price">₹{course.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="total-row">
                            <span>Total</span>
                            <span className="total-amount">₹{totalAmount}</span>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="payment-form-container">
                        <h3>Payment Details</h3>

                        <div className="payment-methods">
                            <button
                                className={`method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('card')}
                            >
                                💳 Credit/Debit Card
                            </button>
                            <button
                                className={`method-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                📱 UPI
                            </button>
                        </div>

                        {paymentMethod === 'card' ? (
                            <form onSubmit={handlePayment} className="card-form">
                                <div className="form-group">
                                    <label>Name on Card</label>
                                    <input
                                        type="text"
                                        name="cardName"
                                        placeholder="John Doe"
                                        value={formData.cardName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Card Number</label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        placeholder="0000 0000 0000 0000"
                                        maxLength="19"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            value={formData.expiry}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVC</label>
                                        <input
                                            type="text"
                                            name="cvc"
                                            placeholder="123"
                                            maxLength="3"
                                            value={formData.cvc}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="pay-btn" disabled={processing}>
                                    {processing ? 'Processing...' : `Pay ₹${totalAmount}`}
                                </button>
                            </form>
                        ) : (
                            <div className="upi-payment">
                                <p>Scan QR code to pay</p>
                                <div className="qr-placeholder">
                                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=shiksha@upi&pn=Shiksha&am=${totalAmount}`} alt="UPI QR" />
                                </div>
                                <button className="pay-btn" onClick={handlePayment} disabled={processing}>
                                    {processing ? 'Verifying...' : 'I have paid'}
                                </button>
                            </div>
                        )}

                        <div className="secure-badge">
                            🔒 100% Secure Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
