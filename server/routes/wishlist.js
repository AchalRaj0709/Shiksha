import express from 'express';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user.wishlist
        });
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   POST /api/wishlist/:courseId
// @desc    Add course to wishlist
// @access  Private
router.post('/:courseId', protect, async (req, res) => {
    try {
        const { courseId } = req.params;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course not found'
            });
        }

        const user = await User.findById(req.user._id);

        // Check if already in wishlist
        if (user.wishlist.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Course already in wishlist'
            });
        }

        user.wishlist.push(courseId);
        await user.save();

        res.json({
            success: true,
            message: 'Course added to wishlist',
            data: user.wishlist
        });
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// @route   DELETE /api/wishlist/:courseId
// @desc    Remove course from wishlist
// @access  Private
router.delete('/:courseId', protect, async (req, res) => {
    try {
        const { courseId } = req.params;

        const user = await User.findById(req.user._id);

        // Check if in wishlist
        if (!user.wishlist.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Course not in wishlist'
            });
        }

        user.wishlist = user.wishlist.filter(id => id.toString() !== courseId);
        await user.save();

        res.json({
            success: true,
            message: 'Course removed from wishlist',
            data: user.wishlist
        });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

export default router;
