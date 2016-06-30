import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import HomePage from './components/HomePage';
import FormPage from './components/test/FormPage';
import NotFoundPage from './components/NotFoundPage';

export default (
    <Route path="/" component={App}>
        <Route path="form" component={FormPage}/>
        <IndexRoute component={HomePage}/>
        <Route path="*" component={NotFoundPage}/>
    </Route>
);
