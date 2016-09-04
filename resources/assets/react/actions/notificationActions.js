import {
    NOTIFICATION_GET_SC_TASKS,
    NOTIFICATION_GET_SC_EVENTS_STATUS,
    NOTIFICATION_TEST,
} from '../constants/actionTypes';

export function getScheduleTasks(checkAndLoad) {
    return {
        checkAndLoad,
        type: NOTIFICATION_GET_SC_TASKS,
        moduleName: 'notification',
        map: 'scTasks',
        callAPI: `schedules/tasks` // function or string URL
    }
}

export function getScheduleEventsStatus(checkAndLoad) {
    return {
        checkAndLoad,
        type: NOTIFICATION_GET_SC_EVENTS_STATUS,
        moduleName: 'notification',
        map: 'scEventsStatus',
        // onSuccess: testAction,
        callAPI: `schedules/events-status` // function or string URL
    }
}