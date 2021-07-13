import './chat.css';
import Message from './Message';
import axios from 'axios';
import {useEffect, useState, useRef} from 'react';
import CallIcon from '@material-ui/icons/Call';
import VideocamIcon from '@material-ui/icons/Videocam';
import InfoIcon from '@material-ui/icons/Info';

const Chat = ({activeChat, currentUser, socket,arrivalMessage}) => {

    const [chat, setChat] = useState(activeChat);
    const [chatMessages, setChatMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [otherUserData, setOtherUserData] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {

        const fetchOtherUserData = async() => {

            let otherUserId = chat?.members.find((id) => id !== currentUser._id);

          const res =  await axios.get(`http://localhost:5000/api/users/${otherUserId}`);

          setOtherUserData(res.data);

        };

        fetchOtherUserData();

    }, [activeChat,currentUser._id,chat?.members]);
    
    useEffect(() => {
        arrivalMessage && activeChat?.members?.includes(arrivalMessage.senderId) &&
        setChatMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, activeChat]);

    useEffect(() => {
    
        const fetchChatData = async() => {
            const res = await axios.get(`http://localhost:5000/api/conversations/conversation/${activeChat?._id}`);

            setChat(res.data);
        };

        const fetchChatMessages = async() => {
            const res = await axios.get(`http://localhost:5000/api/messages/${activeChat?._id}`);

            setChatMessages(res.data);
        };

        if (activeChat){
            fetchChatData();
            fetchChatMessages();
        }
    },[activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: 'smooth'});
    },[chatMessages]);

    const onClickHandler = async(e) => {
        e.preventDefault();

        const payload = {
            text: messageInput,
            creatorId: currentUser._id,
            conversationId: chat._id
        };

        const receiverId = chat.members.find(id => id !== currentUser._id);

        socket.emit('sendMessage', ({
            senderId: currentUser._id,
            receiverId,
            text: messageInput
        }));

       axios({
           method: 'POST',
           url: 'http://localhost:5000/api/messages/newMessage',
           data: payload
       })
       .then((res) => {
        setChatMessages([...chatMessages, res.data]);
        setMessageInput('');
       });
    };

    if (activeChat){
        return (
            <div className="chatBoxWrapper">
            <div className="chatBoxChatInfo">
                <div className="chatBoxChatInfoLeft">
                <img src={otherUserData.profilePicture ? `http://localhost:5000/images/${otherUserData.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} className="chatBoxUserImg" alt="" />
                <span className="chatBoxUserUsername">{otherUserData.username}</span>
                </div>
                <div className="chatBoxChatInfoRight">
                    <CallIcon className="chatBoxIcon" />
                    <VideocamIcon className="chatBoxIcon"  />
                    <InfoIcon className="chatBoxIcon" />
                </div>
            </div>
            <div className="chatMessages">
            <div className="chatBoxTop">
                {chatMessages.map((m) => (
                    <div ref={scrollRef}>
                        <Message key={m._id} message={m} own={m.creatorId === currentUser._id} currentUser={currentUser}/>
                    </div>
                ))}
            </div>
            </div>
            <div className="chatBoxBottom">
            <textarea onChange={(e) => setMessageInput(e.target.value)} placeholder="write something..." className="textArea"></textarea>
            <button className={!messageInput ? 'sendBtn none' : 'sendBtn active'} onClick={onClickHandler}>Send</button>
        </div>
        </div>
        );
    }
    else{
        return (
            <div className="noActiveChatTextWrapper">
                <span className="noActiveChatText">Please Select Chat to begin Chatting &#129322;</span>
            </div>
        );
    }
}
;
export default Chat;
