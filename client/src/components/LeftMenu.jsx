import './leftMenu.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
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
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yR/r/tInzwsw2pVX.png" alt="" className="leftMenuListItemIconImg" />
                        <span className="leftMenuListItemText">COVID-19: Information Center</span>
                    </li>
                    <li className="leftMenuListItem">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/ys/r/9BDqQflVfXI.png" alt="" className="leftMenuListItemIconImg" />
                        <span className="leftMenuListItemText">Marketplace</span>
                    </li>
                    <li className="leftMenuListItem">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/mk4dH3FK0jT.png" alt="" className="leftMenuListItemIconImg" />
                        <span className="leftMenuListItemText">Groups</span>
                    </li>
                    <li className="leftMenuListItem">
                      <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yx/r/-XF4FQcre_i.png" className="leftMenuListItemIconImg" alt="" />
                        <span className="leftMenuListItemText">Friends</span>
                    </li>
                    <li className="leftMenuListItem">
                        <img src="https://static.xx.fbcdn.net/rsrc.php/v3/yG/r/A1HlI2LVo58.png" alt="" className="leftMenuListItemIconImg" />
                        <span className="leftMenuListItemText">Watch</span>
                    </li>
                    <li className="leftMenuListItem">
                        <KeyboardArrowDownIcon className="keyboardIcon" />
                    <span className="leftMenuListItemText">See More</span>
                    </li>
                </ul>
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
