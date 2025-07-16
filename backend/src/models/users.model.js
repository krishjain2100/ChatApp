const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true // coverts email to lowercase before saving
        },
        password: {
            type: String,
            required: true
        },
        lastSeen: {
            type: Date,
            default: () => new Date('2025-07-13T00:00:00.000Z')
        }
    },
    { 
        timestamps: true 
    }
);
const User = mongoose.model('User', UserSchema);
module.exports = User;