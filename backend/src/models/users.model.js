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
        }
    },
    { 
        timestamps: true 
    }
);
const User = mongoose.model('User', UserSchema);
module.exports = User;