/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactDOM from 'react-dom';

class Confirm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close(){
        console.log('close');
        this.setState({ open: false });
        // this.props.alertFunction() ;
    }

    open(){
        this.setState({ open: true });
    }

    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.close}
            />
        ];
        return (
            <Dialog
                titleStyle={{ backgroundColor: '#C62828', color: '#FFFFFF' }}
                title="Alert!"
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.close}
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

export default Confirm;


