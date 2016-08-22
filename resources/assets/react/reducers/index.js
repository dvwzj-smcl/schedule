import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';
import appReducer from './appReducer';
import scheduleReducer from './scheduleReducer';
import notificationReducer from './notificationReducer';

const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    schedule: scheduleReducer,
    notification: notificationReducer,
    routing: routerReducer
});

export default rootReducer;
