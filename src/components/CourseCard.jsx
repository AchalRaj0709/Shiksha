import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';
import './CourseCard.css';

function CourseCard({ course }) {
    return (
        <Link to={`/course/${course._id || course.id}`} className="course-card-link">
            <div className="course-card">
                {/* Course Image */}
                <div className="course-image-container">
                    <img
                        src={course.image}
                        alt={course.title}
                        className="course-image"
                    />
                    {course.bestseller && (
                        <span className="badge badge-warning bestseller-badge">Bestseller</span>
                    )}
                    <div className="wishlist-button-container">
                        <WishlistButton courseId={course._id || course.id} />
                    </div>
                </div>

                {/* Course Info */}
                <div className="course-info">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor text-muted">{course.instructorName || course.instructor}</p>

                    {/* Rating */}
                    <div className="course-rating">
                        <span className="rating-value">{course.rating}</span>
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill={i < Math.floor(course.rating) ? 'currentColor' : 'none'}
                                    className="star"
                                >
                                    <path
                                        d="M8 1l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5l2-5z"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </svg>
                            ))}
                        </div>
                        <span className="rating-count text-muted">({course.students.toLocaleString()})</span>
                    </div>

                    {/* Price */}
                    <div className="course-price-container">
                        <span className="course-price">₹{course.price}</span>
                        {course.originalPrice && (
                            <>
                                <span className="course-original-price">₹{course.originalPrice}</span>
                                <span className="badge badge-success discount-badge">
                                    {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CourseCard;
