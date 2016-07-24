import {
    MENU_SIDEBAR_TOGGLE,
    MENU_SIDEBAR_IS_EXPANDED,
    MENU_SIDEBAR_IS_COLLAPSED
} from '../constants/actionTypes';

import api from '../api';



/**
 * menu
 */
function menuSidebarIsExpanded(){
    return {type: MENU_SIDEBAR_IS_EXPANDED};
}
function menuSidebarIsCollapsed(){
    return {type: MENU_SIDEBAR_IS_COLLAPSED};
}
function menuSidebarToggle(){
    return {type: MENU_SIDEBAR_TOGGLE};
}

export function sidebarIsExpanded(){
    return (dispatch, getState)=>{
        dispatch(getState().menu.sidebar.expanded ?  menuSidebarIsExpanded() : menuSidebarIsCollapsed());
        return getState().menu.sidebar.expanded;
    };
}
export function sidebarToggle(){
    return (dispatch, getState)=>{
        dispatch(menuSidebarToggle());
        return dispatch(getState().menu.sidebar.expanded ?  menuSidebarIsExpanded() : menuSidebarIsCollapsed());
    };
}