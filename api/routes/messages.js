const router = require('express').Router();
const Message = require('../models/Message');

router.post('/newMessage', async(req,res) => {
    try{
        const newMessage = new Message({
            text: req.body.text,
            creatorId: req.body.creatorId,
            conversationId: req.body.conversationId,
            createdAt: new Date()
        });
    
        await newMessage.save();

        res.status(201).json(newMessage);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.get('/:conversationId', async(req,res) => {

    try{
        const allMessagesInChat = await Message.find({conversationId: req.params.conversationId});

        res.status(200).json(allMessagesInChat);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;