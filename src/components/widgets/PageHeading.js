import React, { PropTypes } from 'react';

const PageHeading = ({title, description}) => {
    return (
        <div className="page-heading">
            <h1 className="title">{title}</h1>
            <p className="description">{description}</p>
        </div>
    );
};

PageHeading.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

export default PageHeading;