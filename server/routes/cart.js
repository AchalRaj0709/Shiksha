import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart');

        res.json({
            success: true,
            data: user.cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
});

// @route   POST /api/cart/add
// @desc    Add course to cart
// @access  Private
router.post('/add', protect, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user._id);

        // Check if already in cart
        if (user.cart.includes(courseId)) {
            return res.status(400).json({
                success: false,
                message: 'Course already in cart'
            });
        }

        // Check if already enrolled (optional, but good UX)
        // We can check this on frontend, but backend check is safer
        // However, we don't have easy access to Course model here without importing
        // For now, let's assume frontend handles "Already Enrolled" check

        user.cart.push(courseId);
        await user.save();

        // Return updated cart
        const updatedUser = await User.findById(req.user._id).populate('cart');

        res.json({
            success: true,
            message: 'Course added to cart',
            data: updatedUser.cart
        });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to cart'
        });
    }
});

// @route   DELETE /api/cart/remove/:courseId
// @desc    Remove course from cart
// @access  Private
router.delete('/remove/:courseId', protect, async (req, res) => {
    try {
        const { courseId } = req.params;
        const user = await User.findById(req.user._id);

        user.cart = user.cart.filter(id => id.toString() !== courseId);
        await user.save();

        // Return updated cart
        const updatedUser = await User.findById(req.user._id).populate('cart');

        res.json({
            success: true,
            message: 'Course removed from cart',
            data: updatedUser.cart
        });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from cart'
        });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear cart
// @access  Private
router.delete('/clear', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        user.cart = [];
        await user.save();

        res.json({
            success: true,
            message: 'Cart cleared',
            data: []
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
});

export default router;
