import axios from 'axios';
import jwt from 'jsonwebtoken';

export const loginCall = async (userCredentials, dispatch) => {

    dispatch({type: "LOGIN_START"});

    try{
        const res = await axios.post("http://localhost:5000/api/auth/login", userCredentials);
        dispatch({type: "LOGIN_SUCCESS", payload: res.data});
    }
    catch(err){
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
};

export const authTokenAuthorization = async (token, secret, dispatch) => {

    dispatch({type: "AUTH_TOKEN_START"});

    try{
        jwt.verify(token, secret, function(err,decoded){
            if (err){
                dispatch({type: "AUTH_TOKEN_FAILURE", payload: err});
            }
            else{
                dispatch({type: "AUTH_TOKEN_SUCCESS", payload: decoded.userToken});
            }
        });
    }
    catch(err){
        dispatch({type: "AUTH_TOKEN_FAILURE", payload: err});
    }
};

export const authTokenUpdating = async (newProfileImgName,token,secret,dispatch) => {

    dispatch({type: "AUTH_TOKEN_UPDATE_START"});

    try{
        jwt.verify(token,secret, function(err,decoded){

            if (err){
                dispatch({type: "AUTH_TOKEN_UPDATE_FAILURE", payload:err});
            }
            else{
                dispatch({type: "AUTH_TOKEN_UPDATE_SUCCESS", payload: {...decoded.userToken, profilePicture: newProfileImgName}});
            }
        });
    }
    catch(err){
        dispatch({type: "AUTH_TOKEN_UPDATE_FAILURE", payload: err});
    }
};

export const logout = (dispatch) => {

    dispatch({type: "LOGOUT"});
};