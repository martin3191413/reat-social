import './header.css';
import {Search} from '@material-ui/icons';
import NotificationsNoneOutlinedIcon from '@material-ui/icons/NotificationsNoneOutlined';
import {Link,NavLink} from 'react-router-dom';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import HomeIcon from '@material-ui/icons/Home';
import MovieCreationOutlinedIcon from '@material-ui/icons/MovieCreationOutlined';
import AppsOutlinedIcon from '@material-ui/icons/AppsOutlined';
import DriveEtaOutlinedIcon from '@material-ui/icons/DriveEtaOutlined';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import GamesOutlinedIcon from '@material-ui/icons/GamesOutlined';
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
import { authTokenAuthorization } from '../apiCalls';

export default function Header({socket,arrivalMessage}) {

    const {user,dispatch} = useContext(AuthContext);

    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [display, setDisplay] = useState(false);
    const [results, setResults] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);
    const [displayNotifications, setDisplayNotifications] = useState(false);
    const [haveSeenNotifications, setHaveSeenNotifications] = useState(false);
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
                        matches.push({username: 'No matches found!', image: false});
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
                        secondMatches.push({username: 'No matches found!', image: false});
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
                
                setNotificationsData((prev) => [...prev, {...senderData.data}]);
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

    const logoutHandler = () => {

        const token = localStorage.getItem('userSession');

        localStorage.removeItem('userSession');

        authTokenAuthorization(token, 'privateWord', dispatch);

        window.location.reload();
    };

    const inputOnChangeHandler = (e) => {
        setSearch(e.target.value);
        setDisplay(!display);
    };

    return (
        <div className="header">
            <div className="headerLeft">
            <Link to="/">
            <div className="siteLogo">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/2048px-Facebook_f_logo_%282019%29.svg.png" alt="logo" className="facebookLogo" />
            </div>
            </Link>
            <div className={`searchBarWrapper ${display}`}>
            <div className='searchBar'>
                <Search className="searchIcon"/>
                <input on value={search} onChange={(e) => inputOnChangeHandler(e)} placeholder="Search in Facebook" className="searchInput"></input>
            </div>
            <div className="results" style={{display: display ? 'block': 'none'}}>
                {results.map((r) => (
                    <Link to={`/profile/${r.username}`}>
                    <div className="result">
                    <img className="resultImg" style={{display: r.image === false ? 'none' : 'block'}} src={r.profilePicture ? `http://localhost:5000/images/${r.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile img" />
                    <span className="resultSpan" style={{marginLeft: r.image === false ? '6px' : '0px'}}>{r.username}</span>
                </div>
                </Link>
                ))}
            </div>
            </div>
            </div>
            <div className={`headerMiddle ${display ? 'left' : ''}`}>
                <div className="headerIcons">
                    <NavLink exact to='/' activeClassName="activeHomeLink">
                    <div className="headerIcon">
                        {window.location.pathname === '/' ? <HomeIcon className="headerIconSvg blue"/> : <HomeOutlinedIcon className="headerIconSvg" />}
                    </div>
                    </NavLink>
                    <div className="headerIcon">
                        <MovieCreationOutlinedIcon className="headerIconSvg" />
                    </div>
                    <div className="headerIcon">
                        <DriveEtaOutlinedIcon className ="headerIconSvg" />
                    </div>
                    <div className="headerIcon">
                        <PeopleAltOutlinedIcon className ="headerIconSvg" />
                    </div>
                    <div className="headerIcon">
                        <GamesOutlinedIcon className ="headerIconSvg" />
                    </div>
                </div>
            </div>
            <div className="headerRight">
            <div className="profileWrapper">
            <div className="profilePicture">
                <Link to={`/profile/${user.username}`}>
                <img className="img"  src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile-pic"></img>
                </Link>
                <span className="profileMenuProfileText">{user.username}</span>
                <div className="profileLinks">
                    <div className="profileLinkWrapper">
                    <AppsOutlinedIcon className="profileLink" />
                    </div>
                    <div className="profileLinkWrapper">
                    <Link to={'/messenger'}>
                    <img src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2017/png/iconmonstr-facebook-messenger-1.png&r=0&g=0&b=0" alt="" className="messangerLink" />
                    </Link>
                    </div>
                    <div className="profileLinkWrapper">
                    <NotificationsNoneOutlinedIcon onClick={displayNotificationsFunction} className="profileLink" />
                    <span className="badge" style={{display: haveSeenNotifications === false && notificationsData.length > 0 ? 'block' : 'none'}}>{notificationsData.length}</span>
                    <div className="notifications" style={{display: displayNotifications ? 'block': 'none'}}>
                        <h5 className="notificationsHeader">All Notifications ({notificationsData.length})</h5>
                        <hr className="notificationsHr"></hr>
                        {notificationsData.map((n) => {
                            if (n.hasOwnProperty('comments')){

                               const postNotification = <div className="notification">
                                <img  src={n.profilePicture ? `http://localhost:5000/images/${n.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="personImg" />
                                <span>{n.username} has liked your photo.</span>
                                <img src={`http://localhost:5000/images/${n.img}`} alt="" className="notificationImg" />
                                </div>;

                                return postNotification;
                            }
                            else{
                                const followNotification = <div className="notification">
                                <img  src={n.profilePicture ? `http://localhost:5000/images/${n.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="personImg" />
                                    <span>{n.username} has started following you.</span>
                                 </div>;

                                 return followNotification;
                            }
                        })}
                    </div>
                    </div>
                    <div className="profileLinkWrapper">
                    <KeyboardArrowDownIcon onClick={() => setDisplayProfileMenu(!displayProfileMenu)} className="profileLink" />
                    </div>
            </div>
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
                    <div className="profileMenuSettingsItem" onClick={logoutHandler}>
                    <MeetingRoomIcon  className="settingsIcon"/>
                    <span className="profileMenuSettingsText">Logout</span>
                     <ArrowForwardIosIcon className="arrowIcon" />
                    </div>
                </div>
                </div>
            </div>
            </div>
            </div>
        </div>
    );
};
