  
const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let users = [];

  let notifications = [];

  let followNotifications = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };

  const addFollowNotification = (senderId,receiverId,socketId) => {

    let notification = followNotifications.find((n) => n.senderId === senderId);

    if (notification){

      if ( notification.socketId === socketId && notification.receiverId === receiverId){
        return;
      }
     
    }
    else{
      followNotifications.push({senderId,receiverId,socketId})
    }
  };
  

  const addNotification = (senderId,socketId,postId,receiverId) => {

    let notification = notifications.find((n) => n.senderId === senderId);

    if (notification){

      if ( notification.postId === postId && notification.receiverId === receiverId){
        return;
      }
     
    }
    else{
      notifications.push({senderId,socketId,postId,receiverId})
    }
  };
  
  io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      console.log(users);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    });

    //send and get notification
    socket.on("getNotification", ({senderId,postId,receiverId}) => {
      addNotification(senderId, socket.id, postId,receiverId);
      console.log(notifications);
      const receiverUser = getUser(receiverId);
      io.to(receiverUser.socketId).emit("sendNotification", {
       senderId,
       postId
     })
    })

    //send and get follow notification
    socket.on('getFollowNotification', ({senderId,receiverId}) => {
      addFollowNotification(senderId,receiverId,socket.id);
      console.log(followNotifications);
      const receiverUser = getUser(receiverId);

      io.to(receiverUser.socketId).emit('sendFollowNotification', {
        senderId,
        receiverId
      })
    })
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });