const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({ 
    text:{
        type: String
    },
    conversationId:{
        type: String
    },
    creatorId:{
        type: String
    },
    createdAt: {
        type: String
    }

})

module.exports = mongoose.model('Message', messageSchema);