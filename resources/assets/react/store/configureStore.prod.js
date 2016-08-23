import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import semiAPIMiddleware from '../middlewares/semiAPIMiddleware';

const routingMiddleware = routerMiddleware(browserHistory);

export default function configureStore(initialState) {
    return createStore(rootReducer, initialState, applyMiddleware(thunk, routingMiddleware, semiAPIMiddleware));
}
