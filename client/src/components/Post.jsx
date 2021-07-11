import './post.css';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { format } from 'timeago.js';
import {useState,useEffect, useContext} from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import {Link} from 'react-router-dom';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import RedoIcon from '@material-ui/icons/Redo';

const Post = ({post,socket}) => {

    const {user} = useContext(AuthContext);

    const [postCreator,setPostCreator] = useState('');
    const [likes, setLikes] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
    const [comments, setComments]  = useState([]);
    const [commentsLength, setCommentsLength] = useState(post.comments.length);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        const fetchUser = async() => {

            const res = await axios.get(`http://localhost:5000/api/users/${post.userId}`);

            setPostCreator(res.data);
        };

        fetchUser();

        const fetchPostData = async() => {

            const res = await axios.get(`http://localhost:5000/api/posts/post/comments/${post._id}`);

            setComments(res.data);
        };
        fetchPostData();
    }, [comments,post, user._id, likes,isLiked]);


    const likeHandler = async() => {

         isLiked ? await axios.put(`http://localhost:5000/api/posts/unlike/${post._id}/${user._id}`) : await axios.put(`http://localhost:5000/api/posts/like/${post._id}/${user._id}`);
         if (!isLiked && postCreator._id !== user._id){
             socket.emit('getNotification', ({
                 senderId: user._id,
                 postId: post._id,
                 receiverId: postCreator._id
             }));
         }
         isLiked ? setLikes(likes - 1) : setLikes(likes + 1);
         setIsLiked(!isLiked);
    };

    const submitCommentHandler = async(e) => {
        e.preventDefault();

        const payload = {
            comment: commentText,
            commentCreator: user._id
        };

        axios({
            method: 'POST',
            url: `http://localhost:5000/api/posts/comment/${user._id}/${post._id}`,
            data: payload
        })
        .then((res) => {
            setCommentText('');
            setCommentsLength(commentsLength + 1);
        });
    };

    const deleteHandler = async(e) => {

        await axios.delete(`http://localhost:5000/api/posts/delete/${post._id}`);
    };

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${postCreator.username}`}>
                        <img src={postCreator.profilePicture ? `http://localhost:5000/images/${postCreator.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile pic" className="profilePic"></img>
                        </Link>
                        <Link to={`/profile/${postCreator.username}`}>
                        <span className="profileName">{postCreator.username}</span>
                        </Link>
                        <span className="postAdded">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVertIcon className='optionsIcon' onClick={() => setDisplay(!display)}/>
                        <div className="optionsDiv" style={{display: display ? 'block': 'none'}}>
                            <span onClick={deleteHandler} className="option">Delete Post</span>
                        </div>
                    </div>
                </div>
                <div className="postCenter">
                    <div className="postDescription">
                        {post.description}
                    </div>
                    <div className="imageWrapper">
                        <img src={`http://localhost:5000/images/${post.img}`} className="postPic" alt="pic"></img>
                    </div>
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                    <img className="postReact like" src="/like.png" alt="likeBtn"></img>
                     <img className="postReact love" src="/heart.png" alt="heartBtn"></img>
                     <span className="reactions">{likes} {likes === 1 ? 'person' : 'people'} liked it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="comments" onClick={() => setShowComments(!showComments)}>{commentsLength} comments</span>
                    </div>
                </div>
                <hr className="reactsHr"></hr>
                <div className="postReactions">
                        <div className="postReaction" onClick={likeHandler}>
                        <ThumbUpIcon className="shareReactionIcon" style={{color: isLiked ? '#4267B2' : 'rgb(214, 214, 214)' }} />
                            <span className="shareReactionText" >Like</span>
                        </div>
                        <div className="postReaction"onClick={() => setShowComments(true)} >
                        <ChatBubbleIcon className="shareReactionIcon"/>
                            <span className="shareReactionText">Comment</span>
                        </div>
                        <div className="postReaction">
                            <RedoIcon className="shareReactionIcon"/>
                            <span className="shareReactionText">Share</span>
                        </div>
                    </div>
                <div className="commentSection" style={{display: showComments === true ? 'block' : 'none'}}>
                <form className="comment" onSubmit={submitCommentHandler}>
                            <Link to={`/profile/${user.username}`}>
                            <img src={user.profilePicture ? `http://localhost:5000/images/${user.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="pic" className="profilePicComment"></img>
                            </Link>
                            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write a comment..." className="commentInput"/>
                        </form>
                    {comments.map(comment =>(
                        <div className="commentMade">
                            <img src={comment.userPostedComment.profilePicture ? `http://localhost:5000/images/${comment.userPostedComment.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="pic" className="profilePicComment"></img>
                                 <div className="commentDiv">
                                 <span className="commentUsername">{comment.userPostedComment.username}</span>
                                 <span className="commentSpan">{comment.comment}</span>
                             </div>
                        </div>
                    ))}
                    </div>
            </div>
        </div>
    );
};

export default Post
;