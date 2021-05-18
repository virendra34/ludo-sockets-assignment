const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required!',
    },
    email: {
        type: String,
        required: 'Email is required!',
    },
    password: {
        type: String,
        required: 'Password is required!',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        required: false,
    }
});
module.exports = User = mongoose.model('user',UserSchema);