import React, { PropTypes } from 'react';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

const NotFoundPage = (props) => {
    return (
        <Toolbar>
            <ToolbarGroup>
                <ToolbarTitle text="404 - Page Not Found" />
            </ToolbarGroup>
        </Toolbar>
    );
};

NotFoundPage.propTypes = {};

export default NotFoundPage;
