import {
    SCHEDULE_INIT
} from '../constants/actionTypes';

// ----- Latest Version
export function initSchedule(params) {
    return {
        params,
        type: SCHEDULE_INIT,
        moduleName: 'schedule',
        // shouldCallAPI: (state, isLoaded) => !isLoaded,
        callAPI: `schedules/init`
    }
}

// ----- Old Version
/*export function initSchedule() {
    return {
        types: [SCHEDULE_INIT_REQUEST, SCHEDULE_INIT_SUCCESS, SCHEDULE_INIT_FAILED],
        shouldCallAPI: (state) => !state.schedule.init,
        callAPI: `schedules/init`
    }
}*/

// ----- Old Version : Variations
/*export function initSchedule(userId) {
    return {
        types: [SCHEDULE_INIT_REQUEST, SCHEDULE_INIT_SUCCESS, SCHEDULE_INIT_FAILED],
        shouldCallAPI: (state) => !state.posts[userId],
        callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
        payload: { userId }
    }
}*/


// ----- Original
/*function scheduleInit(data){
    return {type: SCHEDULE_INIT, data};
}

function scheduleInitRequest(){
    return {type: SCHEDULE_INIT_REQUEST};
}

function scheduleInitSuccess(){
    return {type: SCHEDULE_INIT_SUCCESS};
}

function scheduleInitFailed(){
    return {type: SCHEDULE_INIT_FAILED};
}
export function initSchedule(){
    return (dispatch, getState)=>{
        if(getState().schedule.data){
            return Promise.resolve(dispatch(isScheduleInitialized()));
        }
        dispatch(scheduleInitRequest());
        return fetch(
            api.baseUrl('/schedules/init'),
            {
                method: 'get',
                headers: {
                    Authorization: getState().user.access_token
                }
            }
        ).then(response=>response.json()).then(json=>{
            dispatch(scheduleInitSuccess());
            if(json.status == "error") {
                return(dispatch(scheduleInitFailed()));
            }
            return dispatch(scheduleInit(json.data));
        }, ()=> {
            dispatch(scheduleInitFailed());
        });
    };
}*/