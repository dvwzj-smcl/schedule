import React from 'react';
import { Link } from 'react-router';
import PageHeading from './widgets/PageHeading';

const NotFoundPage = () => {
    return (
        <div>
            <PageHeading title="404" description="page not found" />
            <div className="content-wrap">
                <Link to="/"> Go back to homepage </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
