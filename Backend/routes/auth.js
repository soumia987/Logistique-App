const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    name: { // Changed from 'user' to 'name' for consistency
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'], // Fixed typo: require -> required
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
            /^[\+]?[1-9][\d]{0,15}$/,
            'Please enter a valid phone number'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'], // Fixed typo: require -> required
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: {
            values: ['sender', 'driver', 'admin'],
            message: 'Role must be either sender, driver, or admin'
        },
        default: 'sender'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Add indexes for better performance
authSchema.index({ email: 1 });
authSchema.index({ phone: 1 });

// Add a method to transform the object when converting to JSON
authSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

// Add a virtual for full profile
authSchema.virtual('profile').get(function() {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
});

const User = mongoose.model('User', authSchema);
module.exports = User;