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
function userIsNotAuthenticated(error){
    return {type: USER_IS_NOT_AUTHENTICATED, error};
}
function userSignIn(){
    return {type: USER_SIGN_IN};
}
function userSignOut(){
    return {type: USER_SIGN_OUT};
}
function userUpdateToken(user){
    return {type: USER_UPDATE_TOKEN, user};
}
function userRequestSuccess(){
    return {type: USER_REQUEST_SUCCESS};
}
function userRequestFailed(){
    return {type: USER_REQUEST_FAILED};
}

export function getError(){
    return (dispatch, getState)=>{
        return getState().user.error;
    };
}

export function isAuthenticated(){
    return (dispatch, getState)=>{
        console.log('getState().user.access_token', getState());
        //dispatch(getState().user.access_token ?  userIsAuthenticated() : userIsNotAuthenticated(null));
        return !!getState().user.access_token && !getState().user.authenticating;
    };
}

export function login(username, password){
    return (dispatch, getState)=>{
        if(getState().user.access_token){
            return Promise.resolve(dispatch(userIsAuthenticated()));
        }
        dispatch(userSignIn());
        // dispatch(ajaxCallBegin());
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
            // dispatch(ajaxCallEnd());
            if(json.status == "error") {
                return(dispatch(userRequestFailed()));
            }
            // let access_token = json.data.token;
            json.data.login = {username, password};
            return dispatch(json.data ? userUpdateToken(json.data) : userIsNotAuthenticated(json));
        }, ()=> {
            // dispatch(ajaxCallEnd());
            dispatch(userRequestFailed())
        });
    };
}
export function logout(){
    return (dispatch, getState)=>{
        if(!getState().user.access_token){
            return Promise.resolve(dispatch(userIsNotAuthenticated(null)));
        }
        dispatch(userSignOut());
        return Promise.resolve(dispatch(userUpdateToken(null)));
    };
}