
export const authTokenStart = () => ({
    type: "AUTH_TOKEN_START"
});

export const authTokenSuccess  = (user) => ({
    type: "AUTH_TOKEN_SUCCESS",
    payload: user
});

export const authTokenFailure  = (err) => ({
    type: "AUTH_TOKEN_FAILURE",
    payload: err
});

export const loginStart = () => ({
    type: "LOGIN_START",
});


export const loginSuccess = (user) => ({
    type: "LOGIN_SUCCESS",
    payload: user,
});


export const loginFailure = (err) => ({
    type: "LOGIN_FAILURE",
    payload: err
});

export const authTokenUpdateStart = () => ({
    type: "AUTH_TOKEN_UPDATE_START"
});

export const authTokenUpdateSuccess = (user) => ({
    type: "AUTH_TOKEN_UPDATE_SUCCESS"
});

export const authTokenUpdateFailure = (err) => ({
    type: "AUTH_TOKEN_UPDATE_FAILURE",
    payload: err
});

export const logout = () => ({
    type: "LOGOUT"
});