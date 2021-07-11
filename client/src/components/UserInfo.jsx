import './userInfo.css';
import React, {useState, useContext, useEffect} from 'react';
import { Add, Remove } from '@material-ui/icons';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {useParams} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const UserInfo = ({loggedUserProfile,socket}) => {
    const {user} = useContext(AuthContext);

    const params = useParams();

    const [userProfileData, setUserProfileData] = useState([]);
    const [isFollowed, setIsFollowed] = useState(false);
    const [friends, setFriends] = useState([]);

    useEffect(() => {

        const fetchUserProfileData = async() => {
            const res = await axios.get(`http://localhost:5000/api/users/user/${params.username}`);

            setUserProfileData(res.data[0]);

            user.followings.indexOf(userProfileData._id) !== -1 ? setIsFollowed(true) : setIsFollowed(false);
        };

        const fetchUserFriends = async() => {
            const res = await axios.get(`http://localhost:5000/api/users/friends/${params.username}`);

            res.data.length > 6 ? res.data.length = 6 : res.data.length = res.data.length;

            setFriends(res.data);
        };

        fetchUserProfileData();
        fetchUserFriends();

    }, [user.followings, userProfileData._id, params.username]);

    const unfollowHandler = async(e) => {

       axios({
           method: 'POST',
           url: `http://localhost:5000/api/users/unfollow/${user._id}/${userProfileData._id}`,
       })
       .then(res => console.log(res));

       setIsFollowed(!isFollowed);
    };

    const followHandler = async(e) => {
        axios({
            method: 'POST',
            url: `http://localhost:5000/api/users/follow/${user._id}/${userProfileData._id}`,
        })
        .then(res => console.log(res));

        socket.emit('getFollowNotification', ({
            senderId: user._id,
            receiverId: userProfileData._id
        }));
 
        setIsFollowed(!isFollowed);
    };

    const friendsData = friends.map((f) => (
        <Link to={`/profile/${f.username}`}>
         <div className="rightbarFollowing">
        <img className="rightbarFollowingImg" alt="friend" src={f.profilePicture ? `http://localhost:5000/images/${f.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`}></img>
        <span className="rightbarFollowingName">{f.username}</span>
        </div>
        </Link>
    ));


    const noFriends = <span className="noFriendsHeader">This user doesn't follow anyone yet!</span>;



    return (
        <div className="userInfo">
            <div className="userInfoWrapper">
            {loggedUserProfile ? '' : isFollowed ? <button onClick={unfollowHandler} className="followBtn">Unfollow <Remove className="followIcon" /></button> : <button onClick={followHandler} className="followBtn">Follow <Add className="followIcon" /></button>}
            <h4 className="userHeader">User Information</h4>
            <h4 className="userInfoText">City: <span className="userInfoTextInfo"> Sofia</span></h4>
            <h4 className="userInfoText" >From: <span className="userInfoTextInfo"> Bulgaria</span></h4>
            <h4 className="userInfoText" >Relationship: <span className="userInfoTextInfo"> Single</span></h4>
            <h4 className="friendListHeader">Followings</h4>
            <div className="rightbarFollowings">
                {friends.length === 0 ? noFriends : friendsData}
            </div>
            </div>
        </div>
    );
};
export default UserInfo;
