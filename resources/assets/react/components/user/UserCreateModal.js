import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { login, isAuthenticated, getError } from '../../actions/userActions';

import Divider from 'material-ui/Divider';
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class UserCreateModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
        this.context.router.push('/users');
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={this.handleClose}
            />,
        ];

        const radios = [];
        for (let i = 0; i < 30; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={`value${i + 1}`}
                    label={`Option ${i + 1}`}
                />
            );
        }

        return (
            <div>
                <RaisedButton label="Scrollable Dialog" onTouchTap={this.handleOpen} />
                <Dialog
                    title="Scrollable Dialog"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                >
                    <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
                        {radios}
                    </RadioButtonGroup>
                </Dialog>
            </div>
        );
    }
}

UserCreateModal.propTypes = {
    // actions: PropTypes.object.isRequired,
    // routing: PropTypes.object.isRequired
};
UserCreateModal.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(({user})=>({user}))(UserCreateModal);