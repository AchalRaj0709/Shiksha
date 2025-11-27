import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { courseAPI } from '../utils/api';
import logo from '../assets/shiksha_logo.png';
import './Navbar.css';

function Navbar({ onOpenAuth }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const searchRef = useRef(null);
    const profileRef = useRef(null);
    const categoriesRef = useRef(null);
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();

    // Fetch all courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await courseAPI.getAll();
                const courses = response.data.data?.courses || response.data.data || [];
                setAllCourses(courses);

                // Extract unique categories
                const uniqueCategories = [...new Set(courses.map(course => course.category))];
                setCategories(uniqueCategories.sort());
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    // Handle search input
    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const filtered = allCourses.filter(course =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(filtered);
            setShowSearchResults(true);
        } else {
            setSearchResults([]);
            setShowSearchResults(false);
        }
    }, [searchQuery, allCourses]);

    // Close search results, profile menu, and categories when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
                setShowCategoriesMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setShowSearchResults(false);
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleSearchResultClick = (courseId) => {
        setSearchQuery('');
        setShowSearchResults(false);
        window.location.href = `/course/${courseId}`;
    };

    const handleLogout = async () => {
        await logout();
        setShowProfileMenu(false);
    };

    const handleCategoryClick = (category) => {
        setShowCategoriesMenu(false);
        window.location.href = `/search?category=${encodeURIComponent(category)}`;
    };

    return (
        <nav className="navbar">
            <div className="navbar-container container">
                {/* Logo */}
                <div className="navbar-logo">
                    <a href="/">
                        <div className="logo-wrapper">
                            <img src={logo} alt="Shiksha" className="logo-image" />
                            <span className="logo-text">Shiksha</span>
                        </div>
                    </a>
                </div>

                {/* Categories Dropdown */}
                <div className="navbar-categories" ref={categoriesRef}>
                    <button
                        className="categories-btn"
                        onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                    >
                        <span>Categories</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>

                    {showCategoriesMenu && (
                        <div className="categories-dropdown">
                            <div className="categories-header">Explore Categories</div>
                            <div className="categories-list">
                                {categories.length > 0 ? (
                                    categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="category-item"
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            <span className="category-icon">📁</span>
                                            <span className="category-name">{category}</span>
                                            <span className="category-count">
                                                {allCourses.filter(c => c.category === category).length}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-categories">No categories available</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="navbar-search" ref={searchRef}>
                    <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search for courses..."
                        className="search-input"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchSubmit}
                        onFocus={() => searchQuery && setShowSearchResults(true)}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && (
                        <div className="search-results-dropdown">
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="search-results-header">
                                        Found {searchResults.length} course{searchResults.length !== 1 ? 's' : ''}
                                    </div>
                                    <div className="search-results-list">
                                        {searchResults.slice(0, 5).map(course => (
                                            <div
                                                key={course._id || course.id}
                                                className="search-result-item"
                                                onClick={() => handleSearchResultClick(course._id)}
                                            >
                                                <div className="search-result-image">
                                                    <img src={course.image} alt={course.title} />
                                                </div>
                                                <div className="search-result-info">
                                                    <h4>{course.title}</h4>
                                                    <p className="search-result-instructor">{course.instructorName}</p>
                                                    <div className="search-result-meta">
                                                        <span className="search-result-category">{course.category}</span>
                                                        <span className="search-result-price">₹{course.price?.toLocaleString() || '0'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {searchResults.length > 5 && (
                                        <div className="search-results-footer">
                                            +{searchResults.length - 5} more results
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="search-no-results">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    <p>No courses found for "{searchQuery}"</p>
                                    <span>Try searching with different keywords</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Side Icons */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            {/* Cart */}
                            <button
                                className="icon-btn"
                                title="Shopping Cart"
                                onClick={() => window.location.href = '/cart'}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 2L7 6M17 2l2 4M3 6h18M5 6l2 14h10l2-14M10 10v6M14 10v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>

                            {/* Profile */}
                            <div className="profile-container" ref={profileRef}>
                                <button
                                    className="profile-btn"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <img
                                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                        alt="Profile"
                                        className="profile-avatar"
                                    />
                                    {!user?.isEmailVerified && (
                                        <span className="verification-badge" title="Email not verified">!</span>
                                    )}
                                </button>

                                {/* Profile Dropdown */}
                                {showProfileMenu && (
                                    <div className="profile-dropdown slide-down">
                                        <div className="profile-header">
                                            <img
                                                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                                                alt="Profile"
                                                className="profile-avatar-large"
                                            />
                                            <div>
                                                <h4>{user?.name || 'User'}</h4>
                                                <p className="text-muted">{user?.email || ''}</p>
                                                {!user?.isEmailVerified && (
                                                    <span className="email-status unverified">Email not verified</span>
                                                )}
                                                {user?.twoFactorEnabled && (
                                                    <span className="email-status verified">🔐 2FA Enabled</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="profile-divider"></div>
                                        <ul className="profile-menu">
                                            <li>
                                                <a href="/my-learning">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M10 2L2 7l8 5 8-5-8-5zM2 12l8 5 8-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    My Learning
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/wishlist">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    My Wishlist
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/cart">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M7 2L5 6M15 2l2 4M1 6h18M3 6l2 12h10l2-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                    </svg>
                                                    My Cart
                                                </a>
                                            </li>

                                            <li>
                                                <a href="/account-settings">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                        <path d="M10 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                    Account Settings
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="profile-divider"></div>
                                        <button className="logout-btn" onClick={handleLogout}>
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M7 18H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-secondary" onClick={() => onOpenAuth('login')}>
                                Sign In
                            </button>
                            <button className="btn btn-primary" onClick={() => onOpenAuth('signup')}>
                                Sign Up
                            </button>
                        </>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="mobile-menu slide-down">
                    <div className="mobile-search">
                        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search for courses..."
                            className="search-input"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyDown={handleSearchSubmit}
                        />
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
