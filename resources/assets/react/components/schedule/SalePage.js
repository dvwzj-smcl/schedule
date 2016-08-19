import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import SchedulePage from './SchedulePage';

const SalePage = (props, context) => {
    let {...rest} = props;
    rest.hides = context.hides;
    return <SchedulePage {...rest} />;
};

SalePage.contextTypes = {
    hides: PropTypes.object,
    eventColors: PropTypes.object
};

export default SalePage;
