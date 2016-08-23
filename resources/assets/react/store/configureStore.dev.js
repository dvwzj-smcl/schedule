import { createStore, compose, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import semiAPIMiddleware from '../middlewares/semiAPIMiddleware';

const routingMiddleware = routerMiddleware(browserHistory);

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware(thunk, routingMiddleware, semiAPIMiddleware),
            window.devToolsExtension ? window.devToolsExtension() : f => f // add support for Redux dev tools
        )
    );

    if (module.hot) {
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers').default;
            store.replaceReducer(nextReducer);
        });
    }

    return store;
}
