import axios from 'axios';
import React, { useContext, useEffect,useState } from 'react';
import './onlineFriends.css';
import {AuthContext} from '../context/AuthContext';

const OnlineFriends = ({onlineFriendsData, currentUser,userChats,setUserChats}) => {

    const {user} = useContext(AuthContext);

    const [friends, setFriends] = useState([]);
    const [activeElement, setActiveElement] = useState('');

    useEffect(() => {
        
        const fetchFriendsData = async() => {

            let friends = await Promise.all(onlineFriendsData.map(async (f) => {

                const res = await axios.get(`http://localhost:5000/api/users/${f.userId}`);

                return res.data;
            }));

            friends = friends.filter(f => f._id !== currentUser._id);
            setFriends(friends);
        };
        fetchFriendsData();
    }, [onlineFriendsData,currentUser]);

    useEffect(() => {

        const newConversationHandler = async() => {

            const payload = {
                creatorId: user._id,
                receiverId: activeElement._id
            };

            const res = await axios.post(`http://localhost:5000/api/conversations/newConversation`, payload);
            setUserChats([...userChats, res.data]);
        };

        if (activeElement){
            newConversationHandler();
            setActiveElement('');
        }

    }, [activeElement,user, userChats, setUserChats]);


    const noOnlineFriends = <span className="noOnline">No friends currently online &#128533;</span>;

    const onlineFriends = friends.map((f) => (
              <li onClick={() => setActiveElement(f)} className="friend">
                  <div className="friendImageWrapper">
                  <img src={f.profilePicture ? `http://localhost:5000/images/${f.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`}  alt="profile img" className="friendImg"/>
                  <span className="activeDot"></span>
                  </div>
             <span className="friendNameSpan">{f.username}</span>
             </li>
    ));

    return (
        <ul className="onlineFriendList">
            <span className="onlineFriendsHeader">Online Friends</span>
            {friends.length === 0 ? noOnlineFriends : onlineFriends}
             </ul>
    );
};

export default OnlineFriends;
