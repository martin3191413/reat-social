const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

//create post
router.post('/create', async(req,res) => {

    try{

        const postCreatedDate = new Date();

        const post = new Post({...req.body, createdAt:postCreatedDate});

        await post.save();

        res.status(201).json('Post created!');
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//update post
router.put('/update/:id', async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);

        if (!post){
            res.status(404).json('Post not found!');
        }
    
        if (post.userId !== req.body.userId){
            res.status(403).json('You can only update your own posts!');
        }
        else{
            const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set:req.body});
    
            res.status(200).json(updatedPost);
        }
    
    }
    catch(err){
        res.status(500).json(err);
    }

})

//delete post
router.delete('/delete/:id',async(req,res) => {

    try{

        const post = await Post.findById(req.params.id);

         await Post.findByIdAndDelete(req.params.id);

        res.status(200).json('Post deleted!');
    }
    catch(err){
        res.status(500).json(err);
    }
})

//like a post
router.put('/like/:id/:userId',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);

     await post.updateOne({$push: {likes: req.params.userId}})

      res.status(200).json('Post liked!');
    }
    catch(err){
        res.status(500).json(err);
    }
})

//unlike a post
router.put('/unlike/:id/:userId',async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);

        await post.updateOne({$pull: {likes: req.params.userId}});

        res.status(200).json('Post disliked!');
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get a post
router.get('/:id', async(req,res) => {
    
    try{
        const post = await Post.findById(req.params.id);

        if (!post){
            res.status(404).json('Post not found');
        }
        else{
            res.status(200).json(post);
        }
    }
    catch(err){
        res.status(500).json(err);
    }
})

//timeline posts
router.get('/timeline/all/:userId',async(req,res) => {
    try{
        const user = await User.findOne({_id: req.params.userId});
        const userPosts = await Post.find({userId: user._id});

        if (user.followings){

            const friendsPosts = await Promise.all(
                user.followings.map(friendId => {
                    return Post.find({userId: friendId})
                })
            );
    
            res.status(200).json(userPosts.concat(...friendsPosts));
        }
        else{
            res.status(200).json(userPosts);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

//user posts
router.get('/:userId/posts', async(req,res) => {

    try{
        const user = await User.findById(req.params.userId);

        const userPosts = await Post.find({userId: user._id});

        res.status(200).json(userPosts);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//post comment
router.post('/comment/:userPostingCommentId/:postId', async(req,res) => {
    try{
        const postingUser = await User.findById(req.params.userPostingCommentId);
        const post = await Post.findById(req.params.postId);

        const comment = {...req.body, userPostedComment: postingUser};

        await post.updateOne({$push: {comments: comment}});

        res.status(200).json('Comment created successfully!');
    }
    catch(err){
        res.status(500).json(err);
    }
})

//get comments on post
router.get('/post/comments/:postId', async(req,res) => {
    
    try{
        const post = await Post.findById(req.params.postId);

        res.status(200).json(post.comments);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;