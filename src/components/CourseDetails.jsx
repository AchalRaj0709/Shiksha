import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { courseAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './CourseDetails.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, openAuthModal } = useAuth();
    const [course, setCourse] = useState(null);
    const [relatedCourses, setRelatedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolling, setEnrolling] = useState(false);
    const { addToCart, isInCart } = useCart();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await courseAPI.getById(id);
                if (response.data.success) {
                    const courseData = response.data.data.course;
                    setCourse(courseData);

                    // Fetch related courses from the same category
                    const relatedResponse = await courseAPI.getAll({ category: courseData.category, limit: 4 });
                    if (relatedResponse.data.success) {
                        // Filter out the current course from related courses
                        const related = relatedResponse.data.data.courses.filter(c => c._id !== id);
                        setRelatedCourses(related.slice(0, 4));
                    }
                }
            } catch (err) {
                setError('Failed to load course details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    // Check for success message from payment page
    useEffect(() => {
        if (location.state?.message) {
            alert(location.state.message);
            // Clear state to prevent showing message again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleEnroll = async () => {
        if (!user) {
            openAuthModal();
            return;
        }

        // Check if already enrolled
        const isAlreadyEnrolled = course.enrolledStudents?.some(studentId =>
            (studentId.toString() === user.id?.toString()) ||
            (studentId.toString() === user._id?.toString())
        );

        if (isAlreadyEnrolled) {
            document.getElementById('course-content')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Redirect to payment page
        navigate(`/payment/${id}`);
    };

    const handleAddToCart = async () => {
        if (!user) {
            openAuthModal();
            return;
        }

        const result = await addToCart(id);
        if (result.success) {
            alert('Course added to cart!');
        } else {
            alert(result.message || 'Failed to add to cart');
        }
    };

    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!course) return <div className="error-message">Course not found</div>;

    const isEnrolled = user && course.enrolledStudents?.some(studentId =>
        (studentId.toString() === user.id?.toString()) ||
        (studentId.toString() === user._id?.toString())
    );

    return (
        <div className="course-details-page">
            {/* Header Section */}
            <div className="course-header">
                <div className="container">
                    <div className="course-header-content">
                        <div className="course-info">
                            <div className="course-meta">
                                <span className="course-category">{course.category}</span>
                                <span>•</span>
                                <span>{course.level}</span>
                                <span>•</span>
                                <span>Last updated {new Date(course.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <h1 className="course-title">{course.title}</h1>
                            <p className="course-subtitle">{course.description}</p>

                            <div className="course-stats">
                                <div className="stat-item">
                                    <span className="rating-stars">⭐</span>
                                    <strong>{course.rating}</strong>
                                    <span>({course.reviews?.length || 0} {course.reviews?.length === 1 ? 'review' : 'reviews'})</span>
                                </div>
                                <div className="stat-item">
                                    <span>👥</span>
                                    <strong>{course.students.toLocaleString()}</strong>
                                    <span>students</span>
                                </div>
                                <div className="stat-item">
                                    <span>🌐</span>
                                    <span>{course.language}</span>
                                </div>
                            </div>

                            <div className="instructor-info">
                                <img
                                    src={course.instructor?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=instructor'}
                                    alt={course.instructorName}
                                    className="instructor-avatar"
                                />
                                <div className="instructor-details">
                                    <h4>Created by {course.instructorName}</h4>
                                    <p>Instructor</p>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Card (Desktop) */}
                        <div className="course-sidebar">
                            <div className="course-card-large">
                                <img src={course.image} alt={course.title} className="course-preview-image" />
                                <div className="course-card-content">
                                    <div className="price-container">
                                        <span className="current-price">₹{course.price}</span>
                                        {course.originalPrice && (
                                            <>
                                                <span className="original-price">₹{course.originalPrice}</span>
                                                <span className="discount-badge">
                                                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <button
                                        className={`btn btn-primary enroll-btn ${isEnrolled ? 'start-learning-btn' : ''}`}
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                    >
                                        {enrolling ? 'Enrolling...' : isEnrolled ? 'Start Learning' : 'Enroll Now'}
                                    </button>

                                    {!isEnrolled && (
                                        <button
                                            className="btn btn-secondary add-to-cart-btn"
                                            onClick={handleAddToCart}
                                            disabled={isInCart(id)}
                                        >
                                            {isInCart(id) ? (
                                                <>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    In Cart
                                                </>
                                            ) : (
                                                <>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
                                                        <path d="M9 2L7 6M17 2l2 4M3 6h18M5 6l2 14h10l2-14M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    Add to Cart
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <p className="guarantee-text">30-Day Money-Back Guarantee</p>

                                    <ul className="course-features">
                                        <li>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                            {course.duration} on-demand video
                                        </li>
                                        <li>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                                <polyline points="10 9 9 9 8 9"></polyline>
                                            </svg>
                                            Full lifetime access
                                        </li>
                                        <li>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                                                <line x1="12" y1="18" x2="12.01" y2="18"></line>
                                            </svg>
                                            Access on mobile and TV
                                        </li>
                                        <li>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                            Certificate of completion
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* Main Content */}
            < div className="container course-main-content" >
                <div className="content-section">
                    <h2 className="section-title">What you'll learn</h2>
                    <div className="learning-grid">
                        {course.whatYouWillLearn?.map((item, index) => (
                            <div key={index} className="learning-item">
                                <svg className="check-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="content-section" id="course-content">
                    <h2 className="section-title">Course Content</h2>
                    <div className="curriculum-list">
                        {/* Mock curriculum data since we didn't seed it fully */}
                        <div className="curriculum-item">
                            <div className="curriculum-header">
                                <span>Introduction</span>
                                <span>3 lectures • 15min</span>
                            </div>
                            <div className="curriculum-lectures">
                                <div className="lecture-item">
                                    <div className="lecture-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                        </svg>
                                        Welcome to the course
                                    </div>
                                    <span>05:00</span>
                                </div>
                                <div className="lecture-item">
                                    <div className="lecture-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                        </svg>
                                        Course Overview
                                    </div>
                                    <span>04:30</span>
                                </div>
                                <div className="lecture-item">
                                    <div className="lecture-title">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                        </svg>
                                        Resources Setup
                                    </div>
                                    <span>05:30</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="content-section">
                    <h2 className="section-title">Requirements</h2>
                    <ul className="course-features">
                        {course.requirements?.map((req, index) => (
                            <li key={index}>• {req}</li>
                        ))}
                    </ul>
                </div>

                {/* Related Courses Section */}
                {relatedCourses.length > 0 && (
                    <div className="content-section related-courses-section">
                        <h2 className="section-title">Related Courses</h2>
                        <div className="related-courses-grid">
                            {relatedCourses.map((relatedCourse) => (
                                <div
                                    key={relatedCourse._id}
                                    className="related-course-card"
                                    onClick={() => navigate(`/course/${relatedCourse._id}`)}
                                >
                                    <img src={relatedCourse.image} alt={relatedCourse.title} className="related-course-image" />
                                    <div className="related-course-info">
                                        <h4>{relatedCourse.title}</h4>
                                        <p className="related-course-instructor">{relatedCourse.instructorName}</p>
                                        <div className="related-course-meta">
                                            <span className="related-course-rating">⭐ {relatedCourse.rating}</span>
                                            <span className="related-course-price">₹{relatedCourse.price}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default CourseDetails;
