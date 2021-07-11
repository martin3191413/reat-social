const router = require('express').Router();
const Conversation = require('../models/Conversation');


//create new conversation
router.post('/newConversation', async(req,res) => {
    try{
        const newConversation = new Conversation({
            members: [req.body.creatorId, req.body.receiverId]
        });
    
        await newConversation.save();
    
        res.status(201).json(newConversation);
    }
    catch(err){
        res.status(500).json(err);
    }
})

// get conversation
router.get('/conversation/:conversationdId', async(req,res) => {
    try {

        const conversation = await Conversation.findById(req.params.conversationdId);

        res.status(200).json(conversation);
      }
       catch (err) {
        res.status(500).json(err);
      }
})


//get conversations by user
router.get('/:userId', async(req,res) => {
    try {
        const conversation = await Conversation.find({
          members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
      }
       catch (err) {
        res.status(500).json(err);
      }
})

module.exports = router;