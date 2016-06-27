import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { fetchProfile, updateProfile } from './actions/userActions';
import routes from './routes';
import configureStore from './store/configureStore';

import './styles/custom.css';
require('./favicon.ico');

const store = configureStore();
store.dispatch(fetchProfile());
/*
Promise.all([
    store.dispatch(fetchProfile())
]).then(()=>{
    if(!store.getState().user.profile) browserHistory.replace('/login');
});
*/

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>, document.getElementById('app')
);
