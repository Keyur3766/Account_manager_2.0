const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: false,
    },
    Email: {
        type: String,
        required: true,
        lowercase: true
    },
    Address: {
        type: String,
        required: true,
    },
    City: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    passWord: {
        type: String,
        required: true,
    },
    token: {
        type: String
    }
});
const User = mongoose.model('User', userSchema);
    
module.exports = User;