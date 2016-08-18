import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from '../components/App';
import HomePage from '../components/HomePage';
import CalendarPage from '../components/CalendarPage';
import OrganizerPage from '../components/OrganizerPage';
import RequestPage from '../components/RequestPage';
import SchedulePage from '../components/schedule/SchedulePage';
import SearchPage from '../components/schedule/SearchPage';
import DoctorPage from '../components/schedule/DoctorPage';
import DoctorSettingPage from '../components/schedule/DoctorSettingPage';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import UserPage from '../components/user/UserPage';
import UserModal from '../components/user/UserModal';


const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user, // how to get the user state
    authenticatingSelector: state => state.user.authenticating, // for async session loading.
    LoadingComponent: LoginPage, // how to get the user state
    predicate: auth => auth.authenticating!==true && !auth.error,
    redirectAction: routerActions.replace, // the redux action to dispatch for redirect
    wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
});

export default function configureRoute(store){

    const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);

    const useLogin = true; // true - to normally have to log in - change here
    return (useLogin) ? (
        <Route path="/" component={App}>
            <IndexRoute component={UserIsAuthenticated(HomePage)} />
            <Route path="login" component={LoginPage} />
            <Route path="users" component={UserIsAuthenticated(UserPage)}>
                <Route path="create" component={UserIsAuthenticated(UserModal)} />
                <Route path=":id" component={UserIsAuthenticated(UserModal)} />
            </Route>
            <Route path="organizer" component={UserIsAuthenticated(OrganizerPage)} />
            <Route path="request" component={UserIsAuthenticated(RequestPage)} />
            <Route path="schedules" component={UserIsAuthenticated(SearchPage)}>
                <Route path=":doctor_id(/:date)(/:show)" component={UserIsAuthenticated(SchedulePage)} />
            </Route>
            <Route path="doctors/settings" component={UserIsAuthenticated(DoctorPage)}>
                <Route path=":doctor_id" component={UserIsAuthenticated(DoctorSettingPage)} />
            </Route>
            <Route path="*" component={UserIsAuthenticated(NotFoundPage)} />
        </Route>
    ):(
        // For testing without logging in
        <Route path="/" component={App}>
            <IndexRoute component={HomePage} />
            <Route path="/calendar" component={CalendarPage} onEnter={connect(UserIsAuthenticated.onEnter)}/>
            <Route path="*" component={HomePage} />
        </Route>
    );

}