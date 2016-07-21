/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactDOM from 'react-dom';

class Alert extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            title: 'Alert',
            description: 'Something happened!'
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close(){
        console.log('close');
        this.setState({ open: false });
        // this.props.alertFunction() ;
    }

    open({description, title}){
        this.setState({ open: true, description, title });
    }

    render() {
        let state = this.state;
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.close}
            />
        ];
        return (
            <Dialog
                style={{zIndex: 99999}}
                titleStyle={{ backgroundColor: '#C62828', color: '#FFFFFF' }}
                title={state.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.close}
                bodyStyle={{ marginTop: 20 }}
                autoScrollBodyContent={true}
            >
                {state.description}
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

// const Confirm = (message, options) => {
//     let cleanup, component, props, wrapper;
//     if (options == null) {
//         options = {};
//     }
//     props = Object.assign({}, options, {message: message});
//     wrapper = document.getElementById('layout').appendChild(document.createElement('div'));
//     component = ReactDOM.render(<AlertBox {...props}/>, wrapper);
//     cleanup = function() {
//         React.unmountComponentAtNode(wrapper);
//         return setTimeout(function() {
//             return wrapper.remove();
//         });
//     };
//     return component.promise.always(cleanup).promise();
// };

export default Alert;


