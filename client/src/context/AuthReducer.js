const AuthReducer = (state,action) => {
    switch(action.type){
        
        case "AUTH_TOKEN_START":
        return{
            user: null,
            isFetching: true,
            error: false
        };
        case "AUTH_TOKEN_SUCCESS":
          return{
                user: action.payload,
                isFetching: false,
                error: false
            };
        case "AUTH_TOKEN_UPDATE_START":
                return {
                    user: null,
                    isFetching: true,
                    error: false
                };
        case "AUTH_TOKEN_UPDATE_SUCCESS":
            return{
                user: action.payload,
                isFetching: false,
                error: false
            };
        case "AUTH_TOKEN_UPDATE_FAILURE":
            return {
                user: null,
                isFetching: false,
                err: action.payload
            };
         case "AUTH_TOKEN_FAILURE":
         return {
             user: null,
             isFetching: false,
             error: action.payload
            };
        case "LOGIN_START":
            return{
                user: null,
                isFetching: true,
                error: false
            };
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isFetching: false,
                error: false
            };
        case "LOGIN_FAILURE":
            return {
                user: null,
                isFetching: false,
                error: action.payload
            };
         default:
          return state;
    }
};

export default AuthReducer;