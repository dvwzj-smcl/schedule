import {
    SCHEDULE_INIT_FAILED,
    SCHEDULE_INIT_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function userReducer(state = {}, action = null) {
    switch (action.type) {
        default:
            return Object.assign({}, state, action.data);
    }
}