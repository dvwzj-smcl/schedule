import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';
import menuReducer from './menuReducer';
import calendarReducer from './calendarReducer';

const rootReducer = combineReducers({
    menu: menuReducer,
    user: userReducer,
    calendar: calendarReducer,
    routing: routerReducer
});

export default rootReducer;
