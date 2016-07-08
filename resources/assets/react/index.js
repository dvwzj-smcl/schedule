/* eslint-disable import/default */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import configureRoute from './route/configureRoute';
import configureStore from './store/configureStore';
require('./favicon.ico'); // Tell webpack to load favicon.ico
import 'fullcalendar/dist/fullcalendar.css';
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import { syncHistoryWithStore } from 'react-router-redux';

// import jwt from 'jsonwebtoken';
// var encode = jwt.sign({payload: {username: 'admin', password: 'admin1234'}}, 'base64:Q6ERrj4q7NCiSD27kFQNrRkiJFS//jIHbcXHzF4+3qQ=')
// console.log(encode);

const store = configureStore();
const routes = configureRoute(store);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={routes} />
    </Provider>, document.getElementById('app')
);
