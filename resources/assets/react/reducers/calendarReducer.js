import {
    CALENDAR_GET_EVENTS,
    CALENDAR_GET_DOCTORS,
    CALENDAR_GET_CATEGORIES
} from '../constants/actionTypes';

import initialState from './initialState';

export default function calendarReducer(state = initialState.calendar, action = null) {
    switch (action.type) {
        case CALENDAR_GET_EVENTS:
            return Object.assign({}, state, {between: action.between, events: action.events, slots: action.slots});
        case CALENDAR_GET_DOCTORS:
            return Object.assign({}, state, {doctors: action.doctors});
        case CALENDAR_GET_CATEGORIES:
            return Object.assign({}, state, {categories: action.categories});
        default:
            return state;
    }
}