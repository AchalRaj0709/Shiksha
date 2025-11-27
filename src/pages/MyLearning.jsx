import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { progressAPI, courseAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './MyLearning.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function MyLearning() {
    const { user, isAuthenticated } = useAuth();
    const [period, setPeriod] = useState('weekly');
    const [stats, setStats] = useState(null);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchInitialData();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchStats();
        }
    }, [period, isAuthenticated]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [statsRes, coursesRes] = await Promise.all([
                progressAPI.getStats(period),
                progressAPI.getEnrolledCourses()
            ]);

            setStats(statsRes.data.data);
            setEnrolledCourses(coursesRes.data.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Don't set global loading here to avoid full page refresh
            const statsRes = await progressAPI.getStats(period);
            setStats(statsRes.data.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="my-learning-container">
                <div className="my-learning-auth-required">
                    <h2>🔒 Authentication Required</h2>
                    <p>Please sign in to view your learning progress.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="my-learning-container">
                <div className="my-learning-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your learning data...</p>
                </div>
            </div>
        );
    }

    // Prepare chart data
    const chartData = stats?.chartData || [];
    const labels = chartData.map(d => {
        const date = new Date(d.date);
        return period === 'monthly'
            ? date.toLocaleDateString('en-US', { month: 'short' })
            : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const timeChartData = {
        labels,
        datasets: [
            {
                label: 'Minutes Learned',
                data: chartData.map(d => d.minutes),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }
        ]
    };

    const lecturesChartData = {
        labels,
        datasets: [
            {
                label: 'Lectures Completed',
                data: chartData.map(d => d.lectures),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <div className="my-learning-container">
            <div className="container my-learning-content">
                {/* Header */}
                <div className="my-learning-header">
                    <div>
                        <h1>📚 My Learning</h1>
                        <p>Welcome back, {user?.name}! Track your progress and continue learning.</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="learning-stats">
                    <div className="stat-card">
                        <div className="stat-icon">⏱️</div>
                        <div className="stat-content">
                            <h3>{stats?.totalHours || 0}h {(stats?.totalMinutes || 0) % 60}m</h3>
                            <p>Total Time</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📚</div>
                        <div className="stat-content">
                            <h3>{stats?.coursesCount || 0}</h3>
                            <p>Courses Studied</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <h3>{stats?.currentStreak || 0}</h3>
                            <p>Day Streak</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{stats?.totalLectures || 0}</h3>
                            <p>Lectures Done</p>
                        </div>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="period-selector">
                    <button
                        className={`period-btn ${period === 'daily' ? 'active' : ''}`}
                        onClick={() => setPeriod('daily')}
                    >
                        Daily (7 days)
                    </button>
                    <button
                        className={`period-btn ${period === 'weekly' ? 'active' : ''}`}
                        onClick={() => setPeriod('weekly')}
                    >
                        Weekly (30 days)
                    </button>
                    <button
                        className={`period-btn ${period === 'monthly' ? 'active' : ''}`}
                        onClick={() => setPeriod('monthly')}
                    >
                        Monthly (6 months)
                    </button>
                </div>

                {/* Charts */}
                <div className="learning-charts">
                    <div className="chart-card">
                        <h3>📈 Learning Time Trend</h3>
                        <div className="chart-container">
                            <Line data={timeChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="chart-card">
                        <h3>📊 Lectures Completed</h3>
                        <div className="chart-container">
                            <Bar data={lecturesChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                {/* Enrolled Courses Progress */}
                {enrolledCourses.length > 0 && (
                    <div className="courses-progress">
                        <h3>📚 Your Courses Progress</h3>
                        <div className="courses-grid">
                            {enrolledCourses.map(course => (
                                <div key={course.id} className="course-progress-card">
                                    <h4>{course.title}</h4>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                    <div className="progress-info">
                                        <span>{course.completedLectures} / {course.totalLectures} lectures</span>
                                        <span className="progress-percentage">{course.progress}%</span>
                                    </div>
                                    <a href={`/course/${course.id}`} className="btn btn-secondary btn-sm">
                                        Continue Learning
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {chartData.length === 0 && (
                    <div className="my-learning-empty">
                        <div className="empty-icon">📖</div>
                        <h3>Start Your Learning Journey!</h3>
                        <p>Enroll in courses to see your progress here.</p>
                        <a href="/" className="btn btn-primary">Browse Courses</a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyLearning;
