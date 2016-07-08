import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';

const Panel = ({title, children}) => {
    let appBar = title ? (<AppBar className="panel-bar" title={title} showMenuIconButton={false} />) : null;
    let style = {marginTop:30};
    return (
        <Paper style={style}>
            {appBar}
            {children}
        </Paper>
    );
};

Panel.propTypes = {
    title: PropTypes.string,
    children: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ])
};
export default Panel;