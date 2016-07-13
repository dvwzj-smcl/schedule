import {
    CALENDAR_GET_EVENTS,
    CALENDAR_GET_DOCTORS,
    CALENDAR_GET_CATEGORIES
} from '../constants/actionTypes';

import api from '../api';

function calendarGetEvents(json){
    const events = json.events;
    const slots = json.slots;
    const between = json.between;
    return {type: CALENDAR_GET_EVENTS, between, events, slots};
}
function calendarGetDoctors(json){
    const doctors = json.doctors;
    return {type: CALENDAR_GET_DOCTORS, doctors};
}
function calendarGetCategories(json){
    const categories = json.categories;
    return {type: CALENDAR_GET_CATEGORIES, categories};
}

export function getEvents(year, month){
    return (dispatch, getState)=>{
        return fetch(
                api.baseUrl('/calendar/events'+(year?'/'+year+(month?'/'+month:''):'')),
                {
                    headers: {
                        'Access-Token': getState().user.access_token
                    }
                }
            ).then(response=>response.json()).then(json=>{
            return dispatch(calendarGetEvents(json));
        }, ()=>{});
    };
}
export function getDoctors(year, month){
    return (dispatch, getState)=>{
        return fetch(
            api.baseUrl('/calendar/doctors'),
            {
                headers: {
                    'Access-Token': getState().user.access_token
                }
            }
        ).then(response=>response.json()).then(json=>{
                return dispatch(calendarGetDoctors(json));
            }, ()=>{});
    };
}
export function getCategories(year, month){
    return (dispatch, getState)=>{
        return fetch(
            api.baseUrl('/calendar/categories'),
            {
                headers: {
                    'Access-Token': getState().user.access_token
                }
            }
        ).then(response=>response.json()).then(json=>{
                return dispatch(calendarGetCategories(json));
            }, ()=>{});
    };
}