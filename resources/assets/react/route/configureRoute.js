import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { routerActions } from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import App from '../components/App';
import LoginPage from '../components/LoginPage';
import NotFoundPage from '../components/NotFoundPage';
import DashboardPage from '../components/DashboardPage';
import HomePage from '../components/HomePage';
import ScheduleCalendar from '../components/schedule/ScheduleCalendar';
import SchedulePage from '../components/schedule/SchedulePage';
import ScheduleSummaryPage from '../components/schedule/ScheduleSummaryPage';
import SettingPage from '../components/schedule/SettingPage';
import CustomerPage from '../components/CustomerPage';
import BranchPage from '../components/BranchPage';
import DoctorSettingPage from '../components/schedule/DoctorSettingPage';
import CategorySettingPage from '../components/schedule/CategorySettingPage';
import SlotPage from '../components/schedule/SlotPage';
import UserPage from '../components/user/UserPage';
import UserModal from '../components/user/UserModal';
import FormDemoPage from '../components/FormDemoPage';
import DataTableDemo from '../components/DataTableDemo';

const UserIsAuthenticated = UserAuthWrapper({
    authSelector: state => state.user, // how to get the user state
    authenticatingSelector: state => state.user.authenticating, // for async session loading.
    LoadingComponent: LoginPage, // how to get the user state
    failureRedirectPath: '/#/login',
    predicate: auth => auth.authenticating!==true && !auth.error,
    redirectAction: routerActions.replace, // the redux action to dispatch for redirect
    wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
});

export default function configureRoute(store){

    const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
    return (
        <Route path="/" component={App}>
            <IndexRoute component={UserIsAuthenticated(DashboardPage)} />
            <Route path="login" component={LoginPage} />
            <Route path="users" component={UserIsAuthenticated(UserPage)}>
                <Route path="create" component={UserIsAuthenticated(UserModal)} />
                <Route path=":id" component={UserIsAuthenticated(UserModal)} />
            </Route>
            <Route path="slots(/:doctor_id)(/:date)" component={UserIsAuthenticated(SlotPage)} />
            <Route path="schedules/summary(/:date)(/:hides)" component={UserIsAuthenticated(ScheduleSummaryPage)} />
            <Route path="schedules/:role" component={UserIsAuthenticated(SchedulePage)}>
                <Route path="(:doctor_id)(/:date)(/:hides)" component={UserIsAuthenticated(ScheduleCalendar)} />
            </Route>
            <Route path="settings" component={UserIsAuthenticated(SettingPage)}>
                <Route path="doctors(/:doctor_id)(/:category_id)" component={UserIsAuthenticated(DoctorSettingPage)} />
                <Route path="categories(/:category_id)" component={UserIsAuthenticated(CategorySettingPage)} />
            </Route>
            <Route path="customers(/:customer_id)" component={UserIsAuthenticated(CustomerPage)} />
            <Route path="branches(/:id)" component={UserIsAuthenticated(BranchPage)} />
            <Route path="form" component={UserIsAuthenticated(FormDemoPage)} />
            <Route path="datatable" component={UserIsAuthenticated(DataTableDemo)} />
            <Route path="*" component={UserIsAuthenticated(NotFoundPage)} />
        </Route>
    );
}