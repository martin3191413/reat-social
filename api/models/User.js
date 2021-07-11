const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 5,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 5
    },
    password: {
        type: String,
        required: true,
        min: 5
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
})

module.exports = mongoose.model("User", userSchema);