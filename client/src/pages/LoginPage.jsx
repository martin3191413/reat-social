import React, {useRef, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext.js';
import {Link} from 'react-router-dom';
import {loginCall} from '../apiCalls';
import {CircularProgress} from '@material-ui/core';
import jwt from 'jsonwebtoken';
import './login.css';
import axios from 'axios';

const LoginPage = () => {

    const history = useHistory();

    const {isFetching,dispatch} = useContext(AuthContext);

    const email = useRef();
    const password = useRef();

    const onSubmitHandler = (e) => {
        e.preventDefault();

        loginCall({email: email.current.value, password: password.current.value}, dispatch);

        history.push("/");

        getUserAndSignJwtToken(email.current.value);
    };

    const getUserAndSignJwtToken = async(userEmail) => {

        const res = await axios.get(`http://localhost:5000/api/users/email/${userEmail}`);

        const token = jwt.sign({userToken: res.data[0]}, 'privateWord');
        localStorage.setItem('userSession', token);
    };


    return (
        <div className="loginPage">
        <div className="loginPageWrapper">
            <div className="loginPageLeft">
               <span className="logo">Facebook</span>
                <span className="description">
                    Connect to your friends and the world 
                    <br></br>
                    around you on Facebook.
                </span>
            </div>
            <div className="loginPageRight">
                <form className="loginInputs">
                    <input type="email" required="true" placeholder="Email" ref={email} className="registerInput"/>
                    <input type="password" required="true" placeholder="Password" ref={password} className="registerInput"/>
                    <button className="logIn" onClick={onSubmitHandler}>{isFetching ? <CircularProgress color="white" size="24px" /> : "Log in"}</button>
                    <span className="forgotPassword">Forgot Password?</span>
                    <Link to="/register"><button className="registerBtn">{isFetching ? <CircularProgress color="white" size="20px"/> : "Create an account"}</button></Link>
                </form>
            </div>
        </div>
    </div>
    );
};

export default LoginPage;