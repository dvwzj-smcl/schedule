import React, { PropTypes } from 'react';
import { Toolbar, ToolbarGroup, /*ToolbarSeparator,*/ ToolbarTitle } from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';

const MainContent = (props) => {
    return (
        <Paper>
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarTitle text={props.toolbarTitle} />
                </ToolbarGroup>
            </Toolbar>
            {props.children?(
            <div style={{padding: '14px 26px'}}>
                {props.children}
            </div>
            ):null}
        </Paper>
    );
};

MainContent.propTypes = {
    toolbarTitle: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.array
    ])
};

export default MainContent;