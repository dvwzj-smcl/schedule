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
            type: props.type || 'error',
            description: props.description? props.description : 'Something happened!'
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }

    close(){
        this.setState({ open: false });
    }

    open([description, title, type]){
        this.setState({ open: true, description, title, type});
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
        let color = '#C62828';
        if(state.type == 'success') color = '#43A047';
        if(state.type == 'warning') color = '#EF6C00';
        let desc = typeof state.description === 'string' ? state.description : 'Something happened';
        return (
            <Dialog
                style={{zIndex: 99999}}
                titleStyle={{ backgroundColor: color, color: '#FFFFFF' }}
                title={state.title}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.close}
                bodyStyle={{ marginTop: 20 }}
                autoScrollBodyContent={true}
            >
                <div>{desc}</div>
            </Dialog>
        );
    }
}

export default Alert;


