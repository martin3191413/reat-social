import React, { useRef } from 'react';
import {Link, useHistory} from 'react-router-dom';
import './register.css';
import axios from 'axios';

const RegisterPage = () => {

    const email = useRef();
    const username = useRef();
    const password = useRef();
    const repeatPassword = useRef();

    const history = useHistory();


    const submitHandler = async(e) => {
        e.preventDefault();

        const payload = {
            email: email.current.value,
            username: username.current.value,
            password: password.current.value,
            repeatPassword: repeatPassword.current.value
        };

        try{
         await axios.post(`http://localhost:5000/api/auth/register`, payload);

            history.push('/login');

        }
        catch(err){

        }

    };

    return (
        <div className="registerPage">
            <div className="registerPageWrapper">
                <div className="registerPageLeft">
                   <span className="logo">Facebook</span>
                    <span className="description">
                        Connect to your friends and the world 
                        <br></br>
                        around you on Facebook.
                    </span>
                </div>
                <div className="registerPageRight">
                    <div className="registerInputs">
                        <input type="text" ref={email} placeholder="Email" className="registerInput"/>
                        <input type="text" ref={username} placeholder="Username" className="registerInput"/>
                        <input type="password" ref={password} placeholder="Password" className="registerInput"/>
                        <input type="password" ref={repeatPassword} placeholder="Repeat Password" className="registerInput"/>
                        <button onClick={submitHandler} className="registerBtn">Create a new account</button>
                        <span className="forgotPassword">Forgot Password?</span>
                        <Link to="/login"><button className="logIn">Log In</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
