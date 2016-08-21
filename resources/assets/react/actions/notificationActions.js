import {
    NOTIFICATION_GET_PHONE_REQUEST,
    NOTIFICATION_GET_PHONE_FAILED,
    NOTIFICATION_GET_PHONE_SUCCESS
} from '../constants/actionTypes';

export function getPhone() {
    return {
        types: [NOTIFICATION_INIT_REQUEST, NOTIFICATION_GET_PHONE_FAILED, NOTIFICATION_GET_PHONE_SUCCESS],
        shouldCallAPI: (state) => !state.NOTIFICATION.init,
        callAPI: `NOTIFICATIONs/init`
    }
}