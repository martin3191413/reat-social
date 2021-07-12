import './header.css';
import {Search, Person, Message} from '@material-ui/icons';
import NotificationsIcon from '@material-ui/icons/Notifications';
import {Link} from 'react-router-dom';
import {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import axios from 'axios';
import FeedbackIcon from '@material-ui/icons/Feedback';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import HelpIcon from '@material-ui/icons/Help';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import Switch from 'react-switch';
import { useHistory } from 'react-router';
import { authTokenAuthorization } from '../apiCalls';

export default function Header({socket,arrivalMessage}) {

    const {user,dispatch} = useContext(AuthContext);

    const history = useHistory();

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [display, setDisplay] = useState(false);
    const [results, setResults] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);
    const [displayNotifications, setDisplayNotifications] = useState(false);
    const [followNotificationsData, setFollowNotificationsData] = useState([]);
    const [displayFollowNotifications, setDisplayFollowNotifications] = useState(false);
    const [haveSeenNotifications, setHaveSeenNotifications] = useState(false);
    const [haveSeenFollowNotifications, setHaveSeenFollowNotifications] = useState(false);
    const [displayProfileMenu,setDisplayProfileMenu] = useState(false);

    useEffect(() => {

        const fetchAllUsers = async() => {
            const res = await axios.get(`http://localhost:5000/api/users/getAll`);

            setUsers(res.data);
        };
        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (search){
            const findUsers = () => {

                if (search.length === 1){
                    let matches = users.filter((u) => u.username[0] === search);

                    if (matches.length === 0){
                        matches.push({username: 'No matches found!'});
                        setResults(matches);
                        setDisplay(true);
                    }
                    else{
                        matches = matches.filter((u) => u.username !== user.username);
                        
                        setResults(matches);
                        setDisplay(true);
                    }
                }
                else{
                    let secondMatches = users.filter((u) => u.username.includes(search));

                    if (secondMatches.length === 0){
                        secondMatches.push({username: 'No matches found!'});
                        setResults(secondMatches);
                        setDisplay(true);
                    }
                    else{
                        secondMatches = secondMatches.filter((u) => u.username !== user.username);

                        setResults(secondMatches);
                        setDisplay(true);
                    }
                }
            };
    
            findUsers();
        }

        if (!search){
            setDisplay(false);
        }

    }, [search, users,user]);

    useEffect(()=> {

        socket?.on('sendNotification', (data) => {

           const fetchNotificationsData = async() => {

               const userData = await axios.get(`http://localhost:5000/api/users/${data.senderId}`);
               
               const postData = await axios.get(`http://localhost:5000/api/posts/${data.postId}`);

               setNotificationsData((prev) => [...prev, {...userData.data, ...postData.data}]);
               setHaveSeenNotifications(false);
           };

           fetchNotificationsData();
        });

    }, [socket,notificationsData]);

    useEffect(() => {

        socket?.on('sendFollowNotification', (data) => {

            const fetchFollowNotificationsData = async() => {

                const senderData = await axios.get(`http://localhost:5000/api/users/${data.senderId}`);
                
                setFollowNotificationsData((prev) => [...prev, {...senderData.data}]);
                setHaveSeenFollowNotifications(false);
            };
 
            fetchFollowNotificationsData();
        });

    }, [socket]);

    const displayNotificationsFunction = () => {

        if (notificationsData.length > 0){

            if (displayNotifications === false){
                setHaveSeenNotifications(true);

            }
             setDisplayNotifications(!displayNotifications);
        }
    };

    const displayFollowNotificationsFunction = () => {

        if (followNotificationsData.length > 0){

            if (displayFollowNotifications === false){
                setHaveSeenFollowNotifications(true);
            }
               
            setDisplayFollowNotifications(!displayFollowNotifications);
         
        }
    };

    const logoutHandler = () => {

        const token = localStorage.getItem('userSession');

        localStorage.removeItem('userSession');

        authTokenAuthorization(token, 'privateWord', dispatch);

        history.push('/login');
    };

    return (
        <div className="header">
            <Link to="/">
            
            <div className="siteLogo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" alt="logo" className="facebookLogo" />
            </div>
            </Link>
            <div className="searchBarWrapper">
            <div className="searchBar">
                <Search className="searchIcon"/>
                <input on value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in Facebook..." className="searchInput"></input>
            </div>
            <ul className="searchUl" style={{display: display ? 'block' : 'none'}}>
                {results.map((r) => (
                    <Link to={`/profile/${r.username}`}>
                    <li className="friendLi">{r.username}</li>
                    </Link>
                ))}
            </ul>
            </div>

            <div className="links">
                <Link to="/">
                <span className="link">Homepage</span>
                </Link>
                <Link to={`/profile/${user.username}`}>
                <span className="link">Timeline</span>
                </Link>
                
            </div>
            <div className="headerIcons">
                <div className="headerIcon">
                    <Person onClick={displayFollowNotificationsFunction} />
                    <span className="badge" style={{display: haveSeenFollowNotifications === false && followNotificationsData.length > 0 ? 'block' : 'none'}}>{followNotificationsData.length}</span>
                    <div className="followNotifications" style={{display: displayFollowNotifications ? 'block' : 'none'}}>
                    {followNotificationsData.map((n) => (
                            <div className="notification">
                        <img  src={n.profilePicture ? `http://localhost:5000/images/${n.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="personImg" />
                            <span>{n.username} has started following you.</span>
                        </div>
                        ))}
                    </div>
                </div>
                <Link to="/messenger">
                <div className="headerIcon">
                    <Message />
                    <span className="badge" style={{display: Object.keys(arrivalMessage).length > 0  && arrivalMessage.senderId !== user._id ? 'block' : 'none'}}>1</span>
                </div>
                </Link>
                <div className="headerIcon">
                    <NotificationsIcon onClick={displayNotificationsFunction} />
                    <span className="badge" style={{display: haveSeenNotifications === false && notificationsData.length > 0 ? 'block' : 'none'}}>{notificationsData.length}</span>
                    <div className="notifications" style={{display: displayNotifications ? 'block': 'none'}}>
                        {notificationsData.map((n) => (
                            <div className="notification">
                        <img  src={n.profilePicture ? `http://localhost:5000/images/${n.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="personImg" />
                            <span>{n.username} has liked your photo.</span>
                            <img src={`http://localhost:5000/images/${n.img}`} alt="" className="notificationImg" />
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="profileWrapper">
            <div className="profilePicture">
                <img className="img" onClick={() => setDisplayProfileMenu(!displayProfileMenu)}  src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile-pic"></img>
            </div>
            <div className="profileMenu" style={{display: displayProfileMenu ? 'block' : 'none'}}>
                <div className="profileMenuWrapper">
                <div className="profileMenuProfileLink">
                    <Link to={`/profile/${user.username}`}>
                    <img src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="profileImage" />
                    </Link>
                    <div className="profileMenuText">
                        <Link to={`/profile/${user.username}`}>
                        <span className="profileMenuName">{user.username}</span>
                        </Link>
                        <Link to={`/profile/${user.username}`}>
                        <span className="linkToProfile">See your profile</span>
                        </Link>
                    </div>
                    <Switch
                     //checked={this.state.checked}
                    // onChange={this.handleChange}
                     onColor="#86d3ff"
                     onHandleColor="#2693e6"
                     handleDiameter={30}
                     uncheckedIcon={false}
                     checkedIcon={false}
                     boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                     height={20}
                     width={48}
                     className="switchComponent"
                    />
                </div>
                <hr className="hrClass"></hr>
                <div className="feedBackWrapper">
               <FeedbackIcon className="feedBackIcon"/>
                    <div className="feedBackMenuText">
                        <span className="FeedBackSpan">Give us Feedback</span>
                        <span className="feedbackLink">Help us improve</span>
                    </div>
                </div>
                <hr className="hrClass"></hr>
                <div className="profileMenuSettings">
                    <div className="profileMenuSettingsItem">
                    <SettingsIcon className="settingsIcon"/>
                    <span className="profileMenuSettingsText">Settings and Privacy</span>
                     <ArrowForwardIosIcon className="arrowIcon" />
                    </div>
                    <div className="profileMenuSettingsItem">
                    <HelpIcon  className="settingsIcon"/>
                    <span className="profileMenuSettingsText">Help & Support</span>
                     <ArrowForwardIosIcon className="arrowIcon" />
                    </div>
                    <div className="profileMenuSettingsItem">
                    <Brightness3Icon  className="settingsIcon"/>
                    <span className="profileMenuSettingsText">Display & Accessibbility</span>
                     <ArrowForwardIosIcon className="arrowIcon" />
                    </div>
                    <div className="profileMenuSettingsItem">
                    <MeetingRoomIcon  className="settingsIcon"/>
                    <span className="profileMenuSettingsText">Logout</span>
                     <ArrowForwardIosIcon className="arrowIcon" />
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    );
};
