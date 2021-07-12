import './leftMenu.css';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { AuthContext } from '../context/AuthContext';
import { useContext} from 'react';
import {Link} from 'react-router-dom';

const LeftMenu = () => {

    const {user} = useContext(AuthContext);

    return (
        <div className="leftMenu">
            <div className="leftMenuWrapper">
                <ul className="leftMenuList">
                    <Link to={`/profile/${user.username}`}>
                   <li className="leftMenuListItem">
                        <img src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="" className="leftMenuListItemProfileImg" />
                        <span className="leftMenuListItemText">{user.username}</span>
                    </li>
                    </Link>
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
                <h5 className="shortcutsHeader">Your Shortcuts</h5>
                <ul className="leftMenuGroupsList">
                    <li className="leftMenuGroupListItem">
                        <img src="https://play-lh.googleusercontent.com/8Vw-7MAm558750a4M55fiOlUf7lP2cYnFuqSWynrygIiyEEiQQDa_xxHKYOX83L0UD2T" alt="" className="leftMenuGroupListItemImg" />
                        <span className="leftMenuGroupListItemText">Reddit</span>
                    </li>
                    <li className="leftMenuGroupListItem">
                        <img src="https://content.presspage.com/uploads/2658/c800_logo-stackoverflow-square.jpg?98978" alt="" className="leftMenuGroupListItemImg" />
                        <span className="leftMenuGroupListItemText">StackOverflow</span>
                    </li>
                    <li className="leftMenuGroupListItem">
                        <img src="data:image/png;base64,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" alt="" className="leftMenuGroupListItemImg" />
                        <span className="leftMenuGroupListItemText">Programming Bulgaria</span>
                    </li>
                    <li className="leftMenuGroupListItem">
                    <KeyboardArrowDownIcon className="keyboardIcon" />
                    <span className="leftMenuListItemText">See More</span>
                    </li>
                </ul>
               <div className="facebookRights">
                   <span className="facebookRightsSpan">
                   Privacy · Terms · Advertising · Select ads · Cookies · More · Facebook © 2021
                   </span>
               </div>
            </div>
        </div>
    );
};

export default LeftMenu;
