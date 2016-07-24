import {
    SCHEDULE_INIT_FAILED,
    SCHEDULE_INIT_SUCCESS
} from '../constants/actionTypes';

import initialState from './initialState';

export default function userReducer(state = initialState.schedule, action = null) {
    switch (action.type) {
        case SCHEDULE_INIT_FAILED:
            let {error} = action;
            // todo : correct this
            return Object.assign({}, state, {error, init: false});
        case SCHEDULE_INIT_SUCCESS:
            let {data} = action;
            // console.log('* data', action);
            return Object.assign({}, state, {data, init: true});
        default:
            return state;
    }
}