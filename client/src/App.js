import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import React, {useContext, useEffect,useState} from 'react';
import {AuthContext} from './context/AuthContext';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import MessengerPage from './pages/MessengerPage';
import {authTokenAuthorization} from './apiCalls';
import {io} from 'socket.io-client';

import './index.css';

function App() {


  const {user, dispatch} = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [onlineFriendsData, setOnlineFriendsData] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState({});

  useEffect(() => {
    setSocket(io('ws://localhost:8900'));
}, []);


useEffect(() => {
  if (user){
    socket?.emit('addUser', user._id);
    socket?.on('getUsers', (data) => {
        setOnlineFriendsData(data);
    });
  }
}, [socket,user]);

useEffect(() => {
  const token = localStorage.getItem('userSession');

  authTokenAuthorization(token, 'privateWord', dispatch);
}, [dispatch]);

useEffect(() => {
  socket?.on('getMessage', data => {
      setArrivalMessage({
          senderId: data.senderId,
          text: data.text
      });
  });
},[socket]);


  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          { user? <HomePage currentUser={user} socket={socket}  onlineFriendsData={onlineFriendsData} arrivalMessage={arrivalMessage}/> : <Redirect to="/login"/>}
        </Route>
        <Route path="/profile/:username">
          {user ? <ProfilePage socket={socket} arrivalMessage={arrivalMessage} /> : <Redirect to ="/login" />}
        </Route>
        <Route path="/login">
         {!user ? <LoginPage/> :<Redirect to="/"/>}
        </Route>
        <Route path="/register">
        {!user ? <RegisterPage/> :<Redirect to="/"/>}
        </Route>
        <Route path="/messenger">
          {user ? <MessengerPage socket={socket} onlineFriendsData={onlineFriendsData} arrivalMessage={arrivalMessage} /> : <Redirect to="/login"/>}
        </Route>
      </Switch>
    </Router>
    
  );
}

export default App;
