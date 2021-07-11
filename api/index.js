const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const conversationsRoute = require('./routes/conversations');
const messagesRoute = require('./routes/messages');
const app = express();
const PORT = 5000;

mongoose.connect('mongodb://localhost/facebookApp', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true});

app.use('/images', express.static(path.join(__dirname, "/public/images")));

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postsRoute);
app.use('/api/conversations', conversationsRoute);
app.use('/api/messages', messagesRoute);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
const upload = multer({storage: storage});

app.post('/api/upload', upload.single("file"), (req,res) => {

    try {
        return res.status(200).json("File uploded successfully");
      } catch (error) {
        console.error(error);
      }
});


app.get('/', (req,res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Backend is running on port ${PORT}...`);
})