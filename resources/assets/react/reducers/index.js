import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';
import appReducer from './appReducer';
import scheduleReducer from './scheduleReducer';

const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    schedule: scheduleReducer,
    routing: routerReducer
});

export default rootReducer;
