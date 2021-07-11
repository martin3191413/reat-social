const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/register', (req,res) => {
    res.send('Register Page!');
})

router.get('/login', (req,res) => {
    res.send('Login Page!');
})

router.post('/register', async(req,res) => {


    if (req.body.password !== req.body.repeatPassword){
        res.status(500).json('Error');
    }

   try{
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.password, salt);

       const newUser = new User({
           username: req.body.username,
           email: req.body.email,
           password: hash
       });

       await newUser.save();

       res.status(201).json(newUser);
   }
   catch(err){
       console.log(err);
       res.status(500).json(err);
   }
})

router.post('/login', async(req,res) => {

    try{
        const user = await User.findOne({email: req.body.email});

        if (!user){
            res.status(404).json('Wrong username or password!');
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid){
            res.status(403).json('Wrong username or password!');
        }
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;