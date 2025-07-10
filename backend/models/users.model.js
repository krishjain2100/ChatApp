const mongoose = require('mongoose');
const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 20
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        }
    },
    { 
        timestamps: true 
    }
);
const User = mongoose.model('User', UserSchema);
module.exports = User;