import React, { PropTypes } from 'react';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

const HomePage = (props) => {
    return (
        <Toolbar>
            <ToolbarGroup>
                <ToolbarTitle text="Home" />
            </ToolbarGroup>
        </Toolbar>
    );
};

HomePage.propTypes = {};

export default HomePage;
