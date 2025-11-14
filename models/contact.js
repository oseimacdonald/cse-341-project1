const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    favoriteColor: {
        type: String,
        required: [true, 'Favorite color is required'],
        trim: true,
        maxlength: [30, 'Favorite color cannot exceed 30 characters']
    },
    birthday: {
        type: Date,
        required: [true, 'Birthday is required'],
        validate: {
            validator: function(date) {
                return date <= new Date();
            },
            message: 'Birthday cannot be in the future'
        }
    }
}, {
    timestamps: true // This automatically adds createdAt and updatedAt
});

// Create index for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ lastName: 1, firstName: 1 });

module.exports = mongoose.model('Contact', contactSchema);