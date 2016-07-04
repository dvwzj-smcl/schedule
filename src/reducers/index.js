import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userReducer from './userReducer';
import menuReducer from './menuReducer';
import pageReducer from './pageReducer';

const rootReducer = combineReducers({
    menu: menuReducer,
    user: userReducer,
    page: pageReducer,
    routing: routerReducer
});

export default rootReducer;
