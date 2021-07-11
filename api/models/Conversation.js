const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({ 
    members: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);