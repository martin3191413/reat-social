const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//get all users

router.get('/getAll', async(req,res) => {

    try{

        const users = await User.find();

        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//update user
router.put('/update/:id', async(req,res) => {

    try{
        console.log(req);
      const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body});

      res.status(200).json(user);
    }
    catch(err){
      res.status(500).json(err);
    }
})

//delete user
router.delete('/delete/:id', async(req,res) => {

    try{
        if (req.params.id !== req.body.userId){
            res.status(403).json('You are not allowed to do this action!');
        }

       await User.findByIdAndDelete(req.params.id);

       res.status(200).json('User deleted!');
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get user
router.get('/:id',async(req,res) => {

    try{
        const user = await User.findById(req.params.id);

        if (!user){
            res.status(404).json('User not found!');
        }

        res.status(200).json(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/user/:username', async(req,res) => {
    try{

        const user = await User.find({username: req.params.username});

        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
})

router.get('/email/:email', async(req,res) => {
    try{

        const user = await User.find({email: req.params.email});

        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//follow user
router.post('/follow/:currentUserId/:userToBeFollowedId', async(req,res) => {
    try{
        if (req.params.currentUserId === req.params.userToFollowId){
            res.status(403).json('You cant follow yourself!');
        }
    
        const currentUser = await User.findById(req.params.currentUserId);
        const userToBeFollowed = await User.findOne({_id: req.params.userToBeFollowedId});


        if (!userToBeFollowed.followers.includes(currentUser._id)){

            await userToBeFollowed.updateOne({ $push: { followers: req.params.currentUserId } });
            await currentUser.updateOne({ $push: { followings: req.params.userToBeFollowedId } });

            res.status(200).json('Person followed successfully!');
        }
        else{
            res.status(403).json('You already follow this person!');
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})

//unfollow user
router.post('/unfollow/:loggedUserId/:userToUnfollowId', async(req,res) => {
    try{
        if (req.params.loggedUserId === req.params.userToUnfollowId){
            res.status(403).json('You cant unfollow yourself!');
        }
    
        const currentUser = await User.findById(req.params.loggedUserId);
        const userToUnfollow = await User.findById(req.params.userToUnfollowId);

        if (userToUnfollow.followers.includes(currentUser._id)){

            await userToUnfollow.updateOne({ $pull: { followers: req.params.loggedUserId } });
           await currentUser.updateOne({ $pull: { followings: req.params.userToUnfollowId } });

            res.status(200).json('Person unfollowed successfully!');
        }
        else{
            res.status(403).json('You have already unfollowed this person!');
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//get user friends
router.get('/friends/:username', async(req,res) => {

    try{
        const user = await User.findOne({username: req.params.username});

        const friendListData = await Promise.all(
            user.followings.map(friendId => {
                return User.findOne({_id: friendId})
            })
        );
      res.status(200).json(friendListData);


    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
    
})


module.exports = router;