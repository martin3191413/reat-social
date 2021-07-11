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
    const [display, setDisplay] = useState([]);
    const [search, setSearch] = useState('');
    const [results,setResults] = useState([]);
    const [activeElement, setActiveElement] = useState('');

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

    useEffect(() => {


        const newConversationHandler = async() => {
            const payload = {
                creatorId: user._id,
                receiverId: activeElement._id
            };

            const res = await axios.post(`http://localhost:5000/api/conversations/newConversation`, payload);
            setUserChats([...userChats, res.data]);
            setDisplay(false);
            setSearch('');
            setActiveChat(res.data);
    
        };

        if (activeElement){
             newConversationHandler();
             setActiveElement('');
        }

    }, [activeElement,user, userChats]);


    return (
        <>
        <Header socket={socket} arrivalMessage={arrivalMessage} />
        <div className="messenger">
        <div className="conversations">
            <div className="converstationsWrapper">
            <div className="searchWrapper">
            <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="searchFriend" placeholder="Search for a friend..."/>
            <ul className="searchOptions" style={{display: display ? 'block' : 'none'}}>
                {results.map((r) => (
                    <li onClick={() => setActiveElement(r)} className="searchOption" key={r._id}>{r.username}</li>
                ))}
            </ul>
            </div>
            {userChats.map(chat => (
                   <Conversation chat={chat} key={chat._id} currentUser={user} setActiveChat={setActiveChat} />
            ))}
            </div>
            </div>
            <div className="chat">
                   <Chat activeChat={activeChat} currentUser={user} socket={socket} arrivalMessage={arrivalMessage}/>
            </div>
            <div className="onlineFriends">
                <OnlineFriends onlineFriendsData={onlineFriendsData} userChats={userChats} setUserChats={setUserChats}  currentUser={user} />
            </div>
        </div>
        </>
    );
};

export default MessengerPage;
