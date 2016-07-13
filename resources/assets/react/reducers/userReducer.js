import {
    USER_IS_NOT_AUTHENTICATED,
    USER_IS_AUTHENTICATED,
    USER_ACCESS_DENIED,
    USER_SIGN_IN,
    USER_SIGN_OUT,
    USER_UPDATE_USER,
    USER_REQUEST_FAILED,
    USER_REQUEST_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function userReducer(state = initialState.user, action = null) {
    switch (action.type) {
        case USER_UPDATE_USER:
            if(action.user) {
                const {access_token, isAdmin, isDoctor, isOrganizer, isSale} = action.user;
                sessionStorage.setItem('access_token', access_token);
                sessionStorage.setItem('isAdmin', isAdmin);
                sessionStorage.setItem('isDoctor', JSON.stringify(isDoctor));
                sessionStorage.setItem('isOrganizer', JSON.stringify(isOrganizer));
                sessionStorage.setItem('isSale', JSON.stringify(isSale));
                return Object.assign({}, state, {access_token, isAdmin, isDoctor, isOrganizer, isSale, error: null});
            }else{
                sessionStorage.removeItem('access_token');
                sessionStorage.removeItem('isAdmin');
                sessionStorage.removeItem('isDoctor');
                sessionStorage.removeItem('isOrganizer');
                sessionStorage.removeItem('isSale');
                return {};
            }
        case USER_IS_NOT_AUTHENTICATED:
            return Object.assign({}, state, {error: action.error});
        case USER_SIGN_IN:
        case USER_SIGN_OUT:
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('isDoctor');
            sessionStorage.removeItem('isOrganizer');
            sessionStorage.removeItem('isSale');
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