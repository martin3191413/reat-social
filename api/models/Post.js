const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({ 
    userId:{
        type: String,
        required: true
    },
    description:{
        type: String,
        max: 500
    },
    img:{
        type: String,
        default: ""
    },
    likes:{
        type: Array,
        default: []
    },
    createdAt:{
        type: String
    },
    comments: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Post', postSchema);