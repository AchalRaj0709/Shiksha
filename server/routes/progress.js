import express from 'express';
import LearningProgress from '../models/LearningProgress.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/progress/stats
// @desc    Get learning progress statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const { period = 'weekly' } = req.query;
        const userId = req.user._id;

        // Calculate date range based on period
        const now = new Date();
        let startDate;

        switch (period) {
            case 'daily':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7); // Last 7 days
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30); // Last 30 days
                break;
            case 'monthly':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 6); // Last 6 months
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 30);
        }

        // Get progress data
        const progressData = await LearningProgress.find({
            user: userId,
            date: { $gte: startDate }
        }).sort({ date: 1 }).populate('coursesStudied', 'title');

        // Calculate totals
        const totalMinutes = progressData.reduce((sum, day) => sum + day.minutesLearned, 0);
        const totalLectures = progressData.reduce((sum, day) => sum + day.lecturesCompleted, 0);

        // Get unique courses
        const uniqueCourses = new Set();
        progressData.forEach(day => {
            day.coursesStudied.forEach(course => uniqueCourses.add(course._id.toString()));
        });

        // Calculate streak
        let currentStreak = 0;
        const sortedDates = progressData.map(p => new Date(p.date)).sort((a, b) => b - a);

        for (let i = 0; i < sortedDates.length; i++) {
            const daysDiff = Math.floor((now - sortedDates[i]) / (1000 * 60 * 60 * 24));
            if (daysDiff === i) {
                currentStreak++;
            } else {
                break;
            }
        }

        res.json({
            success: true,
            data: {
                totalMinutes,
                totalHours: Math.floor(totalMinutes / 60),
                totalLectures,
                coursesCount: uniqueCourses.size,
                currentStreak,
                chartData: progressData.map(p => ({
                    date: p.date,
                    minutes: p.minutesLearned,
                    lectures: p.lecturesCompleted
                }))
            }
        });
    } catch (error) {
        console.error('Error fetching progress stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching progress statistics'
        });
    }
});

// @route   POST /api/progress/log
// @desc    Log learning activity
// @access  Private
router.post('/log', protect, async (req, res) => {
    try {
        const { minutesLearned, courseId, lecturesCompleted = 0 } = req.body;
        const userId = req.user._id;

        // Get today's date (start of day)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find or create today's progress
        let progress = await LearningProgress.findOne({
            user: userId,
            date: today
        });

        if (progress) {
            // Update existing progress
            progress.minutesLearned += minutesLearned || 0;
            progress.lecturesCompleted += lecturesCompleted;

            if (courseId && !progress.coursesStudied.includes(courseId)) {
                progress.coursesStudied.push(courseId);
            }
        } else {
            // Create new progress entry
            progress = new LearningProgress({
                user: userId,
                date: today,
                minutesLearned: minutesLearned || 0,
                coursesStudied: courseId ? [courseId] : [],
                lecturesCompleted
            });
        }

        await progress.save();

        res.json({
            success: true,
            message: 'Progress logged successfully',
            data: progress
        });
    } catch (error) {
        console.error('Error logging progress:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging progress'
        });
    }
});

// @route   GET /api/progress/streak
// @desc    Get current learning streak
// @access  Private
router.get('/streak', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();

        // Get all progress sorted by date descending
        const progressData = await LearningProgress.find({
            user: userId
        }).sort({ date: -1 });

        let currentStreak = 0;
        const dates = progressData.map(p => new Date(p.date));

        for (let i = 0; i < dates.length; i++) {
            const daysDiff = Math.floor((now - dates[i]) / (1000 * 60 * 60 * 24));
            if (daysDiff === i) {
                currentStreak++;
            } else {
                break;
            }
        }

        res.json({
            success: true,
            data: { currentStreak }
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching streak'
        });
    }
});



// @route   GET /api/progress/enrolled-courses
// @desc    Get progress for enrolled courses
// @access  Private
router.get('/enrolled-courses', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch courses where user is enrolled
        const enrolledCourses = await Course.find({
            enrolledStudents: userId
        }).select('title curriculum instructor instructorName image level rating');

        // Fetch progress for these courses
        const progressData = await LearningProgress.find({
            user: userId,
            coursesStudied: { $in: enrolledCourses.map(c => c._id) }
        });

        // Map courses with progress
        const coursesWithProgress = enrolledCourses.map(course => {
            const courseProgress = progressData.find(p =>
                p.coursesStudied.some(id => id.toString() === course._id.toString())
            );

            // Calculate total lectures
            const totalLectures = course.curriculum?.reduce((sum, section) =>
                sum + (section.lectures?.length || 0), 0) || 0;

            // Calculate completed lectures (this logic might need refinement based on how progress is tracked)
            // For now, we'll use the total lectures completed from progress, but ideally we should track per-course completion
            // Since LearningProgress is daily, we need to aggregate or have a separate Enrollment model.
            // But for now, let's just return the course info and 0 progress if not found.

            // Actually, LearningProgress tracks daily progress. We need a way to know total progress per course.
            // The current LearningProgress model isn't great for total course progress.
            // However, we can just return the course details for now as requested.

            return {
                id: course._id,
                title: course.title,
                image: course.image,
                instructorName: course.instructorName,
                totalLectures,
                completedLectures: 0, // Placeholder until we have better progress tracking
                progress: 0 // Placeholder
            };
        });

        res.json({
            success: true,
            data: coursesWithProgress
        });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching enrolled courses'
        });
    }
});

export default router;
