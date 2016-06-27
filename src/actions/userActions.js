import {
    USER_REQUESTING_PROFILE,
    USER_REQUEST_PROFILE_FAILED,
    USER_RECEIVED_PROFILE,
    USER_LOG_IN,
    USER_LOG_OUT,
    USER_IS_LOGGED_IN,
    USER_IS_LOGGED_OUT,
    USER_IS_NOT_LOGGED_IN,
    USER_UPDATING_PROFILE,
    USER_UPDATED_PROFILE,
    USER_UPDATE_PROFILE_FAILED
} from '../constants/actionTypes';

//import fetch from 'isomorphic-fetch';

function requesting() {
    return {type: USER_REQUESTING_PROFILE};
}
function requestFail(){
    return {type: USER_REQUEST_PROFILE_FAILED};
}
function received(json) {
    return {type: USER_RECEIVED_PROFILE, json};
}
function emptyUser() {
    return {type: USER_IS_NOT_LOGGED_IN};
}
function updating() {
    return {type: USER_UPDATING_PROFILE};
}
function updated(json) {
    return {type: USER_UPDATED_PROFILE, json};
}
function loggingIn() {
    return {type: USER_LOG_IN};
}
function loggingOut() {
    return {type: USER_LOG_OUT};
}
function loggedIn(json) {
    return {type: USER_IS_LOGGED_IN, json};
}
function loggedOut() {
    return {type: USER_IS_LOGGED_OUT};
}
function updateFail(){
    return {type: USER_UPDATE_PROFILE_FAILED};
}

export function updateProfile(profile) {
    return (dispatch, getState)=>{
        profile = Object.assign({}, getState().user.profile, profile);
        dispatch(updating());
        return fetch(
            `http://localhost/schedule/api/user/${profile.id}`,
            {
                method: 'put',
                body: JSON.stringify(profile)
            })
            .then(response=>response.json())
            .then(json=>dispatch(json.result ? updated(json) : updateFail()), ()=>dispatch(requestFail()));
    };
}
export function fetchProfile() {
    return (dispatch) => {
        dispatch(requesting());
        return fetch('http://localhost/schedule/api/auth')
            .then(response=>response.json())
            .then(json=>dispatch(json.result ? received(json) : emptyUser()), ()=>dispatch(requestFail()));
    };
}
export function login(profile) {
    return (dispatch)=>{
        dispatch(loggingIn());
        return fetch(
            'http://localhost/schedule/api/auth',
            {
                method: 'post',
                body: JSON.stringify(profile)
            })
            .then(response=>response.json())
            .then(json=>dispatch(json.result ? loggedIn(json) : emptyUser()), ()=>dispatch(requestFail()));
    };
}

export function logout() {
    return (dispatch)=>{
        dispatch(loggingOut());
        return fetch(
            'http://localhost/schedule/api/auth',
            {
                method: 'put'
            })
            .then(response=>response.json())
            .then(()=>dispatch(loggedOut()), ()=>dispatch(requestFail()));
    };
}