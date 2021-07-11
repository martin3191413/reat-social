import './leftMenu.css';

import {RssFeed} from '@material-ui/icons';
import ChatIcon from '@material-ui/icons/Chat';
import DuoIcon from '@material-ui/icons/Duo';
import GroupIcon from '@material-ui/icons/Group';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import HelpIcon from '@material-ui/icons/Help';
import WorkIcon from '@material-ui/icons/Work';
import EventIcon from '@material-ui/icons/Event';
import { AuthContext } from '../context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';


const LeftMenu = () => {

    const {user} = useContext(AuthContext);


    const [friendsData, setFriendsData] = useState([]);

    useEffect(() => {

        const fetchFriendsData = async() => {

            let friendsData = await Promise.all(user.followings.map(async (f) => {

                const res = await axios.get(`http://localhost:5000/api/users/${f}`);

                return res.data;
            }));

            setFriendsData(friendsData);
        };

        fetchFriendsData();
    }, [user.followings]);

    return (
        <div className="leftMenu">
            <div className="leftMenuWrapper">
                <ul className="leftMenuList">
                    <li className="leftMenuListItem">
                        <RssFeed className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Feed</span>
                    </li>
                    <li className="leftMenuListItem">
                        <ChatIcon  className="leftMenuListItemIcon"/>
                        <span className="leftMenuListItemText">Chats</span>
                    </li>
                    <li className="leftMenuListItem">
                        <DuoIcon className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Videos</span>
                    </li>
                    <li className="leftMenuListItem">
                        <GroupIcon className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Groups</span>
                    </li>
                    <li className="leftMenuListItem">
                        <BookmarkIcon className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Bookmarks</span>
                    </li>
                    <li className="leftMenuListItem">
                        <HelpIcon  className="leftMenuListItemIcon"/>
                        <span className="leftMenuListItemText">Questions</span>
                    </li>
                    <li className="leftMenuListItem">
                        <WorkIcon className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Jobs</span>
                    </li>
                    <li className="leftMenuListItem">
                        <EventIcon className="leftMenuListItemIcon" />
                        <span className="leftMenuListItemText">Events</span>
                    </li>
                </ul>
                <button className="leftMenuButton">Show More</button>
                <hr className="leftMenuHr"></hr>
                <ul className="leftMenuFriendList">
                    {friendsData.map(f => (
                        <Link to={`/profile/${f.username}`}>
                        <li className="leftMenuFriendListItem">
                    <img className="leftMenuFriendLIstItemPic" src={f.profilePicture ? `http://localhost:5000/images/${f.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="fr profile pic"></img>
                        <span className="leftMenuFriendListItemName">{f.username}</span>
                    </li>
                    </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LeftMenu;
