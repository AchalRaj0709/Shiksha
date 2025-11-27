import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all courses with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category, level, search, sort, featured, trending, limit = 20, page = 1 } = req.query;

        // Build query
        const query = { isPublished: true };

        if (category) query.category = category;
        if (level) query.level = level;
        if (featured === 'true') query.featured = true;
        if (trending === 'true') query.trending = true;
        if (search) {
            query.$text = { $search: search };
        }

        // Build sort
        let sortOption = {};
        if (sort === 'price-low') sortOption = { price: 1 };
        else if (sort === 'price-high') sortOption = { price: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };
        else if (sort === 'popular') sortOption = { students: -1 };
        else sortOption = { createdAt: -1 };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const courses = await Course.find(query)
            .sort(sortOption)
            .limit(parseInt(limit))
            .skip(skip)
            .select('-reviews -curriculum');

        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            data: {
                courses,
                pagination: {
                    total,
                    page: parseInt(page),
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        });
    }
});

// @route   GET /api/courses/my/enrolled
// @desc    Get user's enrolled courses
// @access  Private
router.get('/my/enrolled', protect, async (req, res) => {
    try {
        const courses = await Course.find({
            enrolledStudents: req.user._id
        }).select('-reviews -curriculum');

        res.json({
            success: true,
            data: { courses }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching enrolled courses',
            error: error.message
        });
    }
});

// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'name avatar')
            .populate('reviews.user', 'name avatar');

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        res.json({
            success: true,
            data: { course }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching course',
            error: error.message
        });
    }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll in a course
// @access  Private
router.post('/:id/enroll', protect, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if already enrolled
        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'You are already enrolled in this course'
            });
        }

        // Add user to enrolled students
        course.enrolledStudents.push(req.user._id);
        await course.incrementStudents();

        res.json({
            success: true,
            message: 'Successfully enrolled in course',
            data: { course }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error enrolling in course',
            error: error.message
        });
    }
});

// @route   POST /api/courses/:id/review
// @desc    Add a review to a course
// @access  Private
router.post('/:id/review', protect, async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }

        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        // Check if user is enrolled
        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled to review this course'
            });
        }

        // Check if user already reviewed
        const existingReview = course.reviews.find(
            review => review.user.toString() === req.user._id.toString()
        );

        if (existingReview) {
            // Update existing review
            existingReview.rating = rating;
            existingReview.comment = comment;
        } else {
            // Add new review
            course.reviews.push({
                user: req.user._id,
                rating,
                comment
            });
        }

        // Recalculate average rating
        course.calculateAverageRating();
        await course.save();

        res.json({
            success: true,
            message: 'Review added successfully',
            data: { course }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding review',
            error: error.message
        });
    }
});

export default router;
