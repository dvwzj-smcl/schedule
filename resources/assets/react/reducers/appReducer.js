import {
    MENU_SIDEBAR_TOGGLE
} from '../constants/actionTypes';

import initialState from './initialState';

export default function appReducer(state = initialState.app, action = null) {
    switch (action.type) {
        case MENU_SIDEBAR_TOGGLE:
            let sidebar = Object.assign({}, state.sidebar, {expanded: !state.sidebar.expanded});
            return Object.assign({}, state, {sidebar});
        default:
            return state;
    }
}