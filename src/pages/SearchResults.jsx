import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CourseGrid from '../components/CourseGrid';
import { courseAPI } from '../utils/api';
import './SearchResults.css';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const category = searchParams.get('category');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query && !category) {
                setCourses([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch all courses and filter client-side if needed, or pass params if backend supports it
                // Assuming backend supports simple filtering or we filter here
                const response = await courseAPI.getAll();
                if (response.data.success) {
                    let filteredCourses = response.data.data.courses || response.data.data || [];

                    if (query) {
                        const lowerQuery = query.toLowerCase();
                        filteredCourses = filteredCourses.filter(course =>
                            course.title.toLowerCase().includes(lowerQuery) ||
                            course.description.toLowerCase().includes(lowerQuery) ||
                            course.category.toLowerCase().includes(lowerQuery) ||
                            course.instructorName.toLowerCase().includes(lowerQuery)
                        );
                    }

                    if (category) {
                        filteredCourses = filteredCourses.filter(course =>
                            course.category === category
                        );
                    }

                    setCourses(filteredCourses);
                }
            } catch (err) {
                console.error('Error searching courses:', err);
                setError('Failed to load results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query, category]);

    if (loading) return (
        <div className="search-loading-container">
            <div className="loading-spinner"></div>
            <p>{category ? `Loading ${category} courses...` : `Searching for "${query}"...`}</p>
        </div>
    );

    if (error) return <div className="error-message">{error}</div>;

    const title = category ? `${category} Courses` : 'Search Results';
    const subtitle = category
        ? `Browse our collection of ${category} courses`
        : `Showing results for "${query}"`;

    return (
        <div className="search-results-page">
            <div className="search-header">
                <div className="container">
                    <h1>{title}</h1>
                    <p className="search-query-text">
                        {category ? (
                            <span>{subtitle}</span>
                        ) : (
                            <>Showing results for <span className="highlight">"{query}"</span></>
                        )}
                    </p>
                </div>
            </div>

            {courses.length > 0 ? (
                <CourseGrid courses={courses} />
            ) : (
                <div className="container">
                    <div className="no-results">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2>No courses found</h2>
                        <p>We couldn't find any courses matching {category ? `category "${category}"` : `"${query}"`}</p>
                        <div className="search-suggestions">
                            <p>Suggestions:</p>
                            <ul>
                                <li>Check for spelling errors</li>
                                <li>Try using different keywords</li>
                                <li>Try more general search terms</li>
                            </ul>
                        </div>
                        <a href="/" className="btn btn-primary">Browse All Courses</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
