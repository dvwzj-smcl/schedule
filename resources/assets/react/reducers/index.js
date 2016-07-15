import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';
import menuReducer from './menuReducer';

const rootReducer = combineReducers({
    menu: menuReducer,
    user: userReducer,
    routing: routerReducer
});

export default rootReducer;
