import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import { routerActions } from 'react-router-redux';

import App from '../components/App';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';

export default function configureRoute(store){
    const UserIsAuthenticated = UserAuthWrapper({
        authSelector: state => state.user, // how to get the user state
        predicate: auth => auth.access_token,
        redirectAction: routerActions.replace, // the redux action to dispatch for redirect
        wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
    });
    const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);

    const useLogin = true; // true - to normally have to log in - change here
    return (useLogin)? (
        <Route path="/" component={App}>
            <IndexRoute component={UserIsAuthenticated(HomePage)} onEnter={connect(UserIsAuthenticated.onEnter)} />
            <Route path="/login" component={LoginPage} />
            <Route path="*" component={UserIsAuthenticated(NotFoundPage)} onEnter={connect(UserIsAuthenticated.onEnter)} />
        </Route>
    ):(
        // For testing without logging in
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="*" component={HomePage} />
        </Route>
    );

}