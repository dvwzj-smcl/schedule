import {
    SCHEDULE_INIT,
    SCHEDULE_GET_PENDING_EVENTS,
    SCHEDULE_EXAMPLE
} from '../constants/actionTypes';

export function initSchedule(checkAndLoad) {
    return {
        checkAndLoad,
        type: SCHEDULE_INIT,
        moduleName: 'schedule',
        // shouldCallAPI: (state, isLoaded) => !isLoaded,
        callAPI: `schedules/init`
    }
}

export function getPendingEvents(checkAndLoad) {
    return {
        checkAndLoad,
        type: SCHEDULE_GET_PENDING_EVENTS,
        moduleName: 'schedule',
        map: 'pendingEvents',
        callAPI: `schedules/organizer/pending-events`
    }
}

// Just for demonstration only, not working properly.
export function example(checkAndLoad) {
    return {
        checkAndLoad, // true|false|undefined
        /*
         * undefined: return promise & force load.
         * true: return loaded (boolean) & if not loaded -> load
         * false: return loaded (boolean)
         */

        // (required) unique
        type: SCHEDULE_EXAMPLE,

        // (required) same throughout this file
        moduleName: 'schedule',
        
        // if no map, results in -> this.props.schedule
        map: 'example', // results in -> this.props.schedule.example

        // By default, it only checks for loading flag. Use this if you want more.
        shouldCallAPI: (state, isLoaded) => state.user.access_token && !isLoaded,

        onSuccess: (data) => {
            // do something with the loaded data
            getPendingEvents(); // or dispatch another action
        },
        
        // callAPI: `schedules/organizer/pending-events`,
        // or
        callAPI: fetch(`schedules/organizer/pending-events`, {
            method: 'get',
            headers: { 'Access-Token': 'find your own way to get access_token' }
        }).then(res=>{
            // do something
            return res;
        }).catch(error=>{
            //do something
            throw error;
        }),

        // ( optional ) more data to reducer
        payload: {more: 'data'} 
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