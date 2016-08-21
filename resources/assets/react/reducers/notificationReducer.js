import {
    NOTIFICATION_INIT_FAILED,
    NOTIFICATION_INIT_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function userReducer(state = initialState.notification, action = null) {
    switch (action.type) {
        case NOTIFICATION_INIT_FAILED:
            // todo : correct this
            return Object.assign({}, state, {error: action.error, init: false});
        case NOTIFICATION_INIT_SUCCESS:
            // console.log('* data', action);
            return Object.assign({}, state, {data: action.data, init: true});
        default:
            return state;
    }
}