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
            open: false,
            title: 'Confirm',
            description: 'Something happened!'
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
    }

    close(){
        if(this.state.callback) this.state.callback(false);
        this.setState({ open: false });
        // this.props.alertFunction() ;
    }

    open([description, title, callback]){
        this.setState({ open: true, description, title, callback });
    }

    onConfirm() {
        // todo : confirm function
        if(this.state.callback) this.state.callback(true);
        this.setState({ open: false });
    }

    render() {
        let state = this.state;
        const actions = [
            <FlatButton
                label="Cancel"
                key=""
                primary={true}
                onTouchTap={this.close}
            />,
            <FlatButton
                label="Confirm"
                primary={true}
                onTouchTap={this.onConfirm}
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

export default Confirm;


