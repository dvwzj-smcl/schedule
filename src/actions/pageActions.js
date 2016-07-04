import {
    PAGE_UPDATE_TITLE,
    PAGE_UPDATE_DESCRIPTION
} from '../constants/actionTypes';

import api from '../api';

export function updateTitle(title){
    return (dispatch)=>{
        return dispatch({type: PAGE_UPDATE_TITLE, title});
    };
}
export function updateDescription(description){
    return (dispatch)=>{
        return dispatch({type: PAGE_UPDATE_DESCRIPTION, description});
    };
}