import React, { useState, useEffect } from 'react';
import CourseGrid from '../components/CourseGrid';
import { courseAPI } from '../utils/api';
import './Home.css';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [trendingCourses, setTrendingCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = ['All', 'Development', 'Business', 'Design', 'Marketing', 'IT & Software', 'Personal Development', 'Photography', 'Music'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch all courses
                const allResponse = await courseAPI.getAll();
                if (allResponse.data.success) {
                    const courses = allResponse.data.data.courses;
                    setAllCourses(courses);
                    setFilteredCourses(courses);
                }

                // Fetch featured courses
                const featuredResponse = await courseAPI.getAll({ featured: true, limit: 8 });
                if (featuredResponse.data.success) {
                    setFeaturedCourses(featuredResponse.data.data.courses);
                }

                // Fetch trending courses
                const trendingResponse = await courseAPI.getAll({ trending: true, limit: 8 });
                if (trendingResponse.data.success) {
                    setTrendingCourses(trendingResponse.data.data.courses);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Early returns must come after all hooks
    if (loading) return <div className="loading-spinner">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    const handleSearch = () => {
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredCourses(allCourses);
        } else {
            const filtered = allCourses.filter(course => course.category === category);
            setFilteredCourses(filtered);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Learn Without Limits
                        </h1>
                        <p className="hero-subtitle">
                            Start, switch, or advance your career with thousands of courses,
                            Professional Certificates, and degrees from world-class universities and companies.
                        </p>
                        <div className="hero-search">
                            <svg className="search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                className="hero-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button className="btn btn-primary" onClick={handleSearch}>Search</button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <h3>10,000+</h3>
                                <p>Courses</p>
                            </div>
                            <div className="stat">
                                <h3>500K+</h3>
                                <p>Students</p>
                            </div>
                            <div className="stat">
                                <h3>1,000+</h3>
                                <p>Instructors</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Category Filter */}
            <section className="category-filter-section">
                <div className="container">
                    <div className="category-filter-scroll">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filtered Courses by Category */}
            {selectedCategory !== 'All' && filteredCourses.length > 0 && (
                <CourseGrid title={`${selectedCategory} Courses`} courses={filteredCourses} />
            )}

            {selectedCategory !== 'All' && filteredCourses.length === 0 && (
                <div className="container">
                    <div className="no-courses-message">
                        <p>No courses found in {selectedCategory} category.</p>
                    </div>
                </div>
            )}

            {/* All Courses - Show when "All" is selected */}
            {selectedCategory === 'All' && allCourses.length > 0 && (
                <CourseGrid title="All Courses" courses={allCourses} />
            )}
        </>
    );
};

export default Home;
