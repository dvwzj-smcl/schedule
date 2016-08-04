/* eslint-disable import/default */
import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

class Alert extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: props.open || false,
            title: props.title? props.title : 'Alert',
            description: props.description? props.description : 'Something happened!'
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close(){
        this.setState({ open: false });
    }

    open([description, title]){
        this.setState({ open: true, description, title });
    }

    render() {
        let state = this.state;
        const actions = [
            <FlatButton
                label="Ok"
                key="okBtn"
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

export default Alert;


