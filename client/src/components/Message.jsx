import React, { useEffect, useState } from 'react';
import { format } from "timeago.js";
import './message.css';
import {Link} from 'react-router-dom';
import axios from 'axios';

const Message = ({own, message, currentUser}) => {

    const [userData, setUserData] = useState([]);

    useEffect(() => {

        const fetchUserData = async() => {
            if (!own){
                const res = await axios.get(`http://localhost:5000/api/users/${message.creatorId}`);

                setUserData(res.data);
            }
            else{
                setUserData(currentUser);
            }
    
        };

        fetchUserData();
    }, [currentUser, message, own]);

    return (
        <div className={own ? 'message own' : 'message'}>
            <div className="messageWrapper">
                <div className="messageTop">
                    <Link to={`/profile/${userData.username}`}>
                    <img className="messageImg" src={userData.profilePicture? `http://localhost:5000/images/${userData.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profilePicConv" />
                    </Link>
                <span className={own ? 'messageBox own': 'messageBox'}>{message?.text}</span>
                </div>
                <div className={own ? 'messageBottom own': 'messageBottom'}>
                    <span>{format(message?.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;
