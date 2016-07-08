import {
    USER_IS_AUTHENTICATED,
    USER_IS_NOT_AUTHENTICATED,
    USER_SIGN_IN,
    USER_SIGN_OUT,
    USER_UPDATE_TOKEN,
    USER_REQUEST_SUCCESS,
    USER_REQUEST_FAILED
} from '../constants/actionTypes';

import api from '../api';

function userIsAuthenticated(){
    return {type: USER_IS_AUTHENTICATED};
}
function userIsNotAuthenticated(){
    return {type: USER_IS_NOT_AUTHENTICATED};
}
function userSignIn(){
    return {type: USER_SIGN_IN};
}
function userSignOut(){
    return {type: USER_SIGN_OUT};
}
function userUpdateToken(access_token){
    return {type: USER_UPDATE_TOKEN, access_token};
}
function userRequestSuccess(){
    return {type: USER_REQUEST_SUCCESS};
}
function userRequestFailed(){
    return {type: USER_REQUEST_FAILED};
}

export function isAuthenticated(){
    return (dispatch, getState)=>{
        dispatch(getState().user.access_token ?  userIsAuthenticated() : userIsNotAuthenticated());
        return !!getState().user.access_token;
    };
}
export function login(username, password){
    return (dispatch, getState)=>{
        if(getState().user.access_token){
            return Promise.resolve(dispatch(userIsAuthenticated()));
        }
        dispatch(userSignIn());
        return fetch(
                api.baseUrl('/auth'),
                {
                    method: 'post',
                    body: api.payload({
                        username,
                        password
                    })
                }
            ).then(response=>response.json()).then(json=>{
            dispatch(userRequestSuccess());
            let access_token = json.data.token;
            // let access_token = json.access_token; // Phai's

            return dispatch(access_token ? userUpdateToken(access_token) : userIsNotAuthenticated());
        }, ()=>dispatch(userRequestFailed()));
    };
}
export function logout(){
    return (dispatch, getState)=>{
        if(!getState().user.access_token){
            return Promise.resolve(dispatch(userIsNotAuthenticated()));
        }
        dispatch(userSignOut());
        return Promise.resolve(dispatch(userUpdateToken(null)));
    };
}