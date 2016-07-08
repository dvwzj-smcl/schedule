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

export default function userReducer(state = initialState.user, action = null) {
    switch (action.type) {
        case USER_UPDATE_TOKEN:
            if(action.access_token) {
                sessionStorage.setItem('access_token', action.access_token);
                return Object.assign({}, state, {access_token: action.access_token, error: null});
            }else{
                sessionStorage.removeItem('access_token');
                return {};
            }
        case USER_IS_NOT_AUTHENTICATED:
            return Object.assign({}, state, {error: action.error});
        case USER_SIGN_IN:
        case USER_SIGN_OUT:
            sessionStorage.removeItem('access_token');
            return {};
        case USER_REQUEST_SUCCESS:
        case USER_REQUEST_FAILED:
        case USER_IS_AUTHENTICATED:
        case USER_ACCESS_DENIED:
            return Object.assign({}, state);
        default:
            return state;
    }
}