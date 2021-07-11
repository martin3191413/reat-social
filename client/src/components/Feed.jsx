import {useState,useEffect} from 'react';
import {useContext} from 'react';
import {useParams} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import './feed.css';
import Share from './Share';
import Post from './Post';
import axios from 'axios';
const Feed = ({username, loggedUserProfile, share,socket}) => {

    const {user} = useContext(AuthContext);

    const params = useParams(); 
    const [posts,setPosts] = useState([]);

    useEffect(() => {

        const fetchUserProfileAndPosts = async() => {
            const userProfileData = await axios.get(`http://localhost:5000/api/users/user/${params.username}`);

            const res = username ? await axios.get(`http://localhost:5000/api/posts/${userProfileData.data[0]._id}/posts`) : await axios.get(`http://localhost:5000/api/posts/timeline/all/${user._id}`);

            res.data.sort((p1, p2) => {
               return new Date(p2.createdAt) - new Date(p1.createdAt);
            });
            setPosts(res.data);
        };

        fetchUserProfileAndPosts();
    }, [user._id, user.profilePicture,username, params.username]);

    const postsData = posts.map((p) => (
        <Post key={p._id}  post={p} socket={socket} />
    ));

    const noPosts = <span className="noposts">This user has no posts yet!</span>;

    return (
        <div className="feed">
            <div className="feedWrapper">
                {loggedUserProfile === true || share === true ? <Share /> : ''}
            </div>
            {posts.length === 0 ? noPosts : postsData}
        </div>
    );
}
;
export default Feed;
