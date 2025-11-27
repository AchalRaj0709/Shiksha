import mongoose from 'mongoose';

const learningProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    minutesLearned: {
        type: Number,
        default: 0,
        min: 0
    },
    coursesStudied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    lecturesCompleted: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
learningProgressSchema.index({ user: 1, date: -1 });
learningProgressSchema.index({ user: 1, createdAt: -1 });

// Ensure one document per user per day
learningProgressSchema.index({ user: 1, date: 1 }, { unique: true });

const LearningProgress = mongoose.model('LearningProgress', learningProgressSchema);

export default LearningProgress;
