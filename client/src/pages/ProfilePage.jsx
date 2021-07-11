
import './profile.css';
import LeftMenu from '../components/LeftMenu';
import Header from '../components/Header';
import Feed from '../components/Feed';
import UserInfo from '../components/UserInfo';
import {useContext, useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { authTokenUpdating } from '../apiCalls';


const ProfilePage = ({socket,arrivalMessage}) => {

    const {user,dispatch} = useContext(AuthContext);
    let {username} = useParams();
    let history = useHistory();

    const [userData, setUserData] = useState([]);
    const [loggedUserProfile, setLoggedUserProfile] = useState(false);
    const [photo,setPhoto] = useState(null);

    useEffect(() => {
        user.username !== username ? setLoggedUserProfile(false) : setLoggedUserProfile(true);
        user.username !== username ? fetchUserData(username) : fetchUserData(user.username);
    }, [username, user.username]);

    const fetchUserData = async(username) => {

        const res = await axios.get(`http://localhost:5000/api/users/user/${username}`);

        setUserData(res.data[0]);
    };

    useEffect(() => {
        const photoHandler = async(e) => {


            if (photo){
                const data = new FormData();
                const fileName = Date.now() + photo.name;
                data.append("name", fileName);
                data.append("file", photo);
    
                const payload = {
                    profilePicture: fileName
                };

                try{
                    await axios.post('http://localhost:5000/api/upload', data );
    
                    await axios.put(`http://localhost:5000/api/users/update/${user._id}`, payload);

                    const token = localStorage.getItem('userSession');

                    authTokenUpdating(fileName,token,'privateWord',dispatch);

                    history.push(`/profile/${user.username}`);  
                }
                catch(err){
                    console.log(err);
                }
            }
        };

        photoHandler();
    }, [photo, user,dispatch,history]);


        return (
            <>
            <Header socket={socket} arrivalMessage={arrivalMessage} />
            <div className="profile">
                <div className="profileWrapper">
                    <LeftMenu />
                    <div className="profilePage">
                        <div className="coverImgWrapper">
                            <img src={userData.coverPicture ? `http://localhost:5000/images/${userData.coverPicture}` : `http://localhost:5000/images/noProfileCover.jpg`} className="coverImg" alt="cover"></img>
                        </div>
                        <div className="profileImgWrapper">
                            <div className="editProfilePic">
                            <label htmlFor="profileImage" className="profileImage"><EditIcon style={{display: loggedUserProfile ? 'block' : 'none'}} className="editIcon"/></label>
                             <input id="profileImage" type="file" accept=".png,.jpeg.,.jpg" onChange={(e) => setPhoto(e.target.files[0])} className="imageInput"></input>
                            </div>
                            <img src={userData.profilePicture ? `http://localhost:5000/images/${userData.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile" className="profileImg"></img>
                        </div>
                        <div className="userInformation">
                            <span className="username">{userData.username}</span>
                            <span className="profileDescription">Hi friends :)</span>
                        </div>
                        <div className="userInfo">
                            <Feed username={userData.username} socket={socket} loggedUserProfile={loggedUserProfile}/>
                            <UserInfo loggedUserProfile={loggedUserProfile} socket={socket}/>
                        </div>
                    </div>
                </div>
            </div>
            </>
        );
};

export default ProfilePage;
