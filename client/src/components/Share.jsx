import './share.css';
import PhotoIcon from '@material-ui/icons/Photo';
import DuoIcon from '@material-ui/icons/Duo';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';
import {useRef, useState} from 'react';
import axios from 'axios';
import {Cancel} from '@material-ui/icons/index';
import {Link} from 'react-router-dom';

const Share = () => {

    const {user} = useContext(AuthContext);

    const desc = useRef();
    const [file,setFile] = useState(null);

    const submitHandler = async(e) => {
        e.preventDefault();

        const newPost = {
            userId: user._id,
            description: desc.current.value 
        };
        if (file){
            const data = new FormData();
            const fileName = Date.now() + file.name;
            data.append("name", fileName);
            data.append("file", file);
            newPost.img = fileName;

            try{
                await axios.post('http://localhost:5000/api/upload', data );
            }
            catch(err){
                console.log(err);
            }
        }
        try{
            await axios.post('http://localhost:5000/api/posts/create', newPost);
        
            window.location.reload();
        }
        catch(err){
            console.log(err);
        }
    };

    return (
        <form className="share">
           <div className="shareWrapper">
               <div className="shareTop">
                   <Link to={`/profile/${user.username}`}>
                   <img className="profilePicImg" src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile pic"></img>
                   </Link>
                   <input className="shareInput" ref={desc} placeholder={`What's on your mind, ${user.username}?`}></input>
               </div>
               <hr className="shareHr" />
               {file && (
                   <div className="shareImgContainer">
                       <img src={URL.createObjectURL(file)} alt="post pic" className="shareImg"/>
                       <Cancel className="cancelBtn" onClick={() => setFile(null)}/>
                   </div>
               )
               }
               <div className="shareBottom">
               <div className="shareOption">
                   <DuoIcon className=" svg livechatsvg"/>
                   <span className="optiontext">Live Chat</span>
                </div>
                <div className="shareOption">
                   <PhotoIcon className="svg photosvg"/>
                   <label htmlFor="image" className="optiontext">Photo/Video</label>
                   <input id="image" type="file" accept=".png,.jpeg.,.jpg" onChange={(e) => setFile(e.target.files[0])} className="imageInput"></input>
                </div>
                <div className="shareOption">
                   <EmojiEmotionsIcon className=" svg emojisvg"/>
                   <span className="optiontext">Feelings</span>
                </div>
                <button className="shareBtn" onClick={(e) => submitHandler(e)}>Share</button>
               </div>
           </div>
        </form>
    );
};

export default Share;
