import {
    USER_REQUESTING_PROFILE,
    USER_REQUEST_PROFILE_FAILED,
    USER_RECEIVED_PROFILE,
    USER_IS_NOT_LOGGED_IN,
    USER_UPDATING_PROFILE,
    USER_UPDATED_PROFILE,
    USER_UPDATE_PROFILE_FAILED
} from '../constants/actionTypes';
const initialState = {
    isRequesting: false,
    isReceived: true,
    isReady: false,
    profile: null
};

export default function userReducer(state = initialState, action = null) {
    switch (action.type) {
        case USER_REQUESTING_PROFILE:
        case USER_UPDATING_PROFILE:
            return Object.assign(
                {},
                state,
                {
                    isRequesting: true,
                    isReceived: false,
                    isReady: false
                }
            );
        case USER_RECEIVED_PROFILE:
            return Object.assign(
                {},
                state,
                {
                    isRequesting: false,
                    isReceived: true,
                    isReady: true,
                    profile: action.json.profile
                }
            );
        case USER_REQUEST_PROFILE_FAILED:
        case USER_IS_NOT_LOGGED_IN:
            return Object.assign(
                {},
                initialState
            );
        case USER_UPDATED_PROFILE:
            return Object.assign(
                {},
                state,
                {
                    isRequesting: false,
                    isReceived: true,
                    isReady: true,
                    profile: action.json.profile
                }
            );
        case USER_UPDATE_PROFILE_FAILED:
            return Object.assign(
                {},
                state,
                {
                    isRequesting: false,
                    isReceived: true,
                    isReady: true
                }
            );
        default:
            return state;
    }
}
