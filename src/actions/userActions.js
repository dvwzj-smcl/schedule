import {
    USER_REQUESTING_PROFILE,
    USER_RECEIVED_PROFILE,
    USER_IS_NOT_LOGGED_IN,
    USER_UPDATING_PROFILE,
    USER_UPDATED_PROFILE,
    USER_UPDATE_PROFILE_FAILED
} from '../constants/actionTypes';

//import fetch from 'isomorphic-fetch';

function requesting() {
    return {type: USER_REQUESTING_PROFILE};
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
            .then(json=>dispatch(json.profile ? updated(json) : updateFail()), error=>dispatch(updateFail()));
    }
}
export function fetchProfile(force:boolean = false) {
    return (dispatch, getState) => {
        dispatch(requesting());
        return fetch('http://localhost/schedule/api/auth/user')
            .then(response=>response.json())
            .then(json=>dispatch(json.profile ? received(json) : emptyUser()), error=>dispatch(requestFail()));
    };
}
