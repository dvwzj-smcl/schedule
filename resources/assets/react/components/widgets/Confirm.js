/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactDOM from 'react-dom';


class AlertBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(){
        console.log('close');
        // this.props.alertFunction() ;
    }

    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
        return (
            <Dialog
                muiTheme
                titleStyle={{ backgroundColor: '#C62828', color: '#FFFFFF' }}
                title="Alert!"
                actions={actions}
                modal={false}
                open={true}
                onRequestClose={this.handleClose}
                bodyStyle={{ marginTop: 20 }}
                autoScrollBodyContent={true}
            >
                {this.props.description}
            </Dialog>
        );
    }
}

// AlertBox.propTypes = {
//     openAlertBox: PropTypes.bool.isRequired,
//     alertText: PropTypes.string.isRequired,
//     alertFunction: PropTypes.func.isRequired
// };
//
// AlertBox.contextTypes = {
//     router: PropTypes.object.isRequired
// };

const Confirm = (message, options) => {
    let cleanup, component, props, wrapper;
    if (options == null) {
        options = {};
    }
    props = Object.assign({}, options, {message: message});
    wrapper = document.body.appendChild(document.createElement('div'));
    component = ReactDOM.render(<AlertBox {...props}/>, wrapper);
    cleanup = function() {
        React.unmountComponentAtNode(wrapper);
        return setTimeout(function() {
            return wrapper.remove();
        });
    };
    return component.promise.always(cleanup).promise();
};

export default Confirm;


