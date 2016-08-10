import {
    USER_IS_NOT_AUTHENTICATED,
    USER_IS_AUTHENTICATED,
    USER_ACCESS_DENIED,
    USER_SIGN_IN,
    USER_SIGN_OUT,
    USER_UPDATE_TOKEN,
    USER_REQUEST_FAILED,
    USER_REQUEST_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function scheduleReducer(state = initialState.user, action = null) {
    switch (action.type) {
        case USER_UPDATE_TOKEN:
            // console.log('USER_UPDATE_TOKEN', action);
            if(action.user) {
                const {token, user:{...rest}, login:{username,password}} = action.user;
                // console.log('token', permissions);
                // sessionStorage.setItem('access_token', token); // todo : if set, auto login won't work

                // for auto login
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('password', password);

                // todo : add user information here
                return Object.assign({}, state, {error: null, access_token: token, ...rest, authenticating: false});
            }else{
                sessionStorage.removeItem('access_token');
                return {};
            }
            
            // todo : remove this
        // case USER_UPDATE_TOKEN:
        //     console.log('action', action);
        //     if(action.user) {
        //         const {access_token, isAdmin, isDoctor, isOrganizer, isSale} = action.user;
        //         sessionStorage.setItem('access_token', access_token);
        //         sessionStorage.setItem('isAdmin', isAdmin);
        //         sessionStorage.setItem('isDoctor', JSON.stringify(isDoctor));
        //         sessionStorage.setItem('isOrganizer', JSON.stringify(isOrganizer));
        //         sessionStorage.setItem('isSale', JSON.stringify(isSale));
        //         return Object.assign({}, state, {access_token, isAdmin, isDoctor, isOrganizer, isSale, error: null});
        //     }else{
        //         sessionStorage.removeItem('access_token');
        //         sessionStorage.removeItem('isAdmin');
        //         sessionStorage.removeItem('isDoctor');
        //         sessionStorage.removeItem('isOrganizer');
        //         sessionStorage.removeItem('isSale');
        //         return {};
        //     }
        case USER_IS_NOT_AUTHENTICATED:
            return Object.assign({}, state, {error: action.error});
        case USER_REQUEST_FAILED:
            return Object.assign({}, state, {error: 'Error!! Username or Password Incorrect. \nPlease try again.'});
        case USER_SIGN_IN:
        case USER_SIGN_OUT:
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('password');
            // sessionStorage.removeItem('access_token');
            return {};
        case USER_REQUEST_SUCCESS:
        case USER_IS_AUTHENTICATED:
        case USER_ACCESS_DENIED:
            return Object.assign({}, state);
        default:
            return state;
    }
}