import React, { PropTypes } from 'react';

import MainContent from './MainContent';

const NotFoundPage = (props) => {
    return (
        <MainContent toolbarTitle="404 - File Not Found" />
    );
};

NotFoundPage.propTypes = {};

export default NotFoundPage;
