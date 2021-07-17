import './messenger.css';
import Header from '../components/Header';
import Chat from '../components/Chat';
import Conversation from '../components/Conversation';
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {AuthContext} from '../context/AuthContext';
import OnlineFriends from '../components/OnlineFriends';

const MessengerPage = ({socket,onlineFriendsData,arrivalMessage}) => {

    const {user} = useContext(AuthContext);

    const [activeChat, setActiveChat] = useState(null);
    const [userChats, setUserChats] = useState([]);
    const [users, setUsers] = useState([]);
    const [display, setDisplay] = useState(false);
    const [search, setSearch] = useState('');
    const [results,setResults] = useState([]);
    const [activeElement, setActiveElement] = useState('');
    const [className,setClassName] = useState('');

    useEffect(() => {

        const getUserChats = async() => {

           const res = await axios.get(`http://localhost:5000/api/conversations/${user._id}`);

           setUserChats(res.data);
        };
        getUserChats();
    }, [user._id]);

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
                        secondMatches.push({username: 'No matches found!',image: false});
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
            setClassName('');
        }

    }, [search, users,user]);

    useEffect(() => {


        const newConversationHandler = async() => {
            const payload = {
                creatorId: user._id,
                receiverId: activeElement._id
            };

            const res = await axios.post(`http://localhost:5000/api/conversations/newConversation`, payload);
            setUserChats((prev) => [...prev, res.data]);
            setDisplay(false);
            setSearch('');
            setActiveChat(res.data);
    
        };

        if (activeElement){
            let isIncluded = false;
            userChats.map((chat) => {
                if (chat.members.includes(activeElement._id)){
                    setActiveChat(chat);
                    setDisplay(false);
                    setSearch('');
                    isIncluded = true;
                }
            });
            if (isIncluded === false){
                newConversationHandler();
                 setActiveElement('');
            }
        }

    }, [activeElement,user, userChats]);

    const inputOnChangeHandler = (e) => {
        setSearch(e.target.value);
        setDisplay(!display);
        setClassName('displaySearch');
    };

    return (
        <>
        <Header socket={socket} arrivalMessage={arrivalMessage} />
        <div className="messenger">
        <div className="conversations">
            <div className="converstationsWrapper">
            <div className={`searchWrapper ${className}`}>
            <input value={search} onChange={(e) => inputOnChangeHandler(e)} type="text" className="searchFriend" placeholder="Search for a friend..."/>
            <div className="searchResults" style={{display: display ? 'block': 'none'}}>
                {results.map((r) => (
                    <div className="searchResult" onClick={() => setActiveElement(r)}>
                    <img className="searchResultImg" style={{display: r.image === false ? 'none' : 'block'}} src={r.profilePicture ? `http://localhost:5000/images/${r.profilePicture}` : `http://localhost:5000/images/noProfilePic.png`} alt="profile img" />
                    <span className="searchResultSpan" style={{marginLeft: r.image === false ? '6px' : '0px'}}>{r.username}</span>
                </div>
                ))}
            </div>
            </div>
            {userChats.map(chat => (
                   <Conversation chat={chat} key={chat._id} currentUser={user} setActiveChat={setActiveChat} />
            ))}
            </div>
            </div>
            <div className={activeChat ? 'chat act' : 'chat'}>
                   <Chat activeChat={activeChat} currentUser={user} socket={socket} arrivalMessage={arrivalMessage}/>
            </div>
            <div className="onlineFriends">
                <OnlineFriends onlineFriendsData={onlineFriendsData} userChats={userChats} setActiveChat={setActiveChat} setUserChats={setUserChats}  currentUser={user} />
            </div>
        </div>
        </>
    );
};

export default MessengerPage;
