import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const NotFoundPage = (props) => {
    return (
        <div>
            <Link to="/">404</Link>
        </div>
    );
};

NotFoundPage.propTypes = {};

export default NotFoundPage;
