import {
    MENU_SIDEBAR_TOGGLE,
    MENU_SIDEBAR_IS_EXPANDED,
    MENU_SIDEBAR_IS_COLLAPSED
} from '../constants/actionTypes';

import initialState from './initialState';

export default function menuReducer(state = initialState.menu, action = null) {
    switch (action.type) {
        case MENU_SIDEBAR_TOGGLE:
            let sidebar = Object.assign({}, state.sidebar, {expanded: !state.sidebar.expanded});
            return Object.assign({}, state, {sidebar});
        case MENU_SIDEBAR_IS_EXPANDED:
        case MENU_SIDEBAR_IS_COLLAPSED:
            return Object.assign({}, state);
        default:
            return state;
    }
}