import {
    PAGE_UPDATE_TITLE,
    PAGE_UPDATE_DESCRIPTION
} from '../constants/actionTypes';

import initialState from './initialState';

export default function menuReducer(state = initialState.page, action = null) {
    switch (action.type) {
        case PAGE_UPDATE_TITLE:
            return Object.assign({}, state, {title: action.title});
        case PAGE_UPDATE_DESCRIPTION:
            return Object.assign({}, state, {description: action.description});
        default:
            return state;
    }
}