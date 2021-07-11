import './conversation.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Conversation = ({chat, currentUser, setActiveChat}) => {

    const [user,setUser] = useState(null);

    useEffect(() => {
        const friendId = chat.members.find(uid => uid !== currentUser._id);

        const fetchFriendInfo = async() => {

            const res = await axios.get(`http://localhost:5000/api/users/${friendId}`);

            setUser(res.data);
        };

        if (friendId){
            fetchFriendInfo();
        }
    }, [chat.members,currentUser._id]);

    const onClickHandler = async() => {

        const res = await axios.get(`http://localhost:5000/api/conversations/conversation/${chat._id}`);
       setActiveChat(res.data);
    };

    return (
          <div className="conversation" onClick={onClickHandler}>
              <img className="conversationImg" src={user?.profilePicture ? `http://localhost:5000/images/${user.profilePicture}`: `http://localhost:5000/images/noProfilePic.png`} alt=""/>
              <span className="conversationName">{user?.username}</span>
        </div>

    );
};

export default Conversation;
