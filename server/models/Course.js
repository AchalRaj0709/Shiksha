import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Course description is required'],
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instructorName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Development', 'Business', 'Design', 'Marketing', 'IT & Software', 'Personal Development', 'Photography', 'Music', 'Health & Fitness', 'Teaching & Academics']
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
        default: 'All Levels'
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        default: function () {
            return this.price;
        }
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop'
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot be more than 5']
    },
    students: {
        type: Number,
        default: 0,
        min: [0, 'Students count cannot be negative']
    },
    duration: {
        type: String,
        default: '0 hours'
    },
    language: {
        type: String,
        default: 'English'
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    trending: {
        type: Boolean,
        default: false
    },
    curriculum: [{
        section: String,
        lectures: [{
            title: String,
            duration: String,
            preview: {
                type: Boolean,
                default: false
            }
        }]
    }],
    requirements: [String],
    whatYouWillLearn: [String],
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for search
courseSchema.index({ title: 'text', description: 'text', instructorName: 'text' });
courseSchema.index({ category: 1, rating: -1 });
courseSchema.index({ price: 1 });

// Calculate average rating
courseSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        return 0;
    }

    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
    return this.rating;
};

// Increment students count
courseSchema.methods.incrementStudents = function () {
    this.students += 1;
    return this.save();
};

const Course = mongoose.model('Course', courseSchema);

export default Course;
