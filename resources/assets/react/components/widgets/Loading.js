import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = ({inline}) => {
    if(inline) return(
        <div className="center-modal">
            <CircularProgress size={2} />
        </div>
    );
    return (
        <div className="center">
            <div className="center-inner loading">
                <CircularProgress size={2} />
            </div>
        </div>
    );
};

Loading.propTypes = {};
export default Loading;