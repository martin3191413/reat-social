import React, {useState,useEffect} from 'react';
import './rightMenu.css';
import axios from 'axios';
import {Link} from 'react-router-dom';

const RightMenu = ({onlineFriendsData, currentUser}) => {
   
    const [friends, setFriends] = useState([]);

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

    const noOnlineFriends = <span className="noFriendsOnlineSpan">No friends currently online &#128533;</span>;

    const friendsData = friends?.map(f => (
        <Link to={`/profile/${f.username}`}>
     <li className="rightbarFriend">
      <div className="rightbarProfileImageContainer">
         <img className="rightbarProfileImage" src={f.profilePicture ? `http://localhost:5000/images/${f.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profilePic"></img>
             <span className="rightbarOnline"></span>
             </div>
            <span className="rightbarUsername">{f.username}</span>
        </li>
        </Link>
    ));

        return (
            <div className="rightMenu">
            <div className="rightMenuWrapper">
                <div className="birthdayWrapper">
                    <img className="giftImg" src="/gift.png" alt="gift"></img>
                   <span className="birthdayText"><b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.</span>
                </div>
                <img className="rightBarAd" src="/ad.png" alt="ad"></img>
                <div className="rightBarMenuFriends">
                    <h4 className="headerFriends">Online Friends</h4>
                    <ul className="rightbarFriendList">
                        {friends.length === 0 ? noOnlineFriends : friendsData}
                    </ul>
                </div>
            </div>
        </div>
        );
};

export default RightMenu;
