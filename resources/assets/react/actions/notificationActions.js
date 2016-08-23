import {
    NOTIFICATION_GET_SC_TASKS,
    NOTIFICATION_GET_SC_EVENTS_STATUS,
    NOTIFICATION_TEST,
} from '../constants/actionTypes';

export function getScheduleTasks(params) {
    return {
        params,
        type: NOTIFICATION_GET_SC_TASKS,
        moduleName: 'notification',
        map: 'scTasks',
        callAPI: `schedules/tasks` // function or string URL
    }
}

export function getScheduleEventsStatus(params) {
    return {
        params,
        type: NOTIFICATION_GET_SC_EVENTS_STATUS,
        moduleName: 'notification',
        map: 'scEventsStatus',
        // onSuccess: testAction,
        callAPI: `schedules/events-status` // function or string URL
    }
}

export function testAction(params) {
    return {
        params,
        type: NOTIFICATION_TEST,
        moduleName: 'notification',
        map: 'asdf',
        callAPI: `schedules/5555555` // function or string URL
    }
}