import {
    NOTIFICATION_INIT_FAILED,
    NOTIFICATION_INIT_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function notificationReducer(state = {}, action = null) {
    switch (action.type) {
        default:
            return Object.assign({}, state, action.data);
    }
}