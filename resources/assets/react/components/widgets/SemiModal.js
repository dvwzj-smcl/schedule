/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ApiCall from '../../api/ApiCall';
import SemiForm from '../forms/SemiForm';
import Confirm from '../widgets/Confirm';

class SemiModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
        this.state = {
            canSubmit: false
        }
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    handleOpen() {
        console.log('handle Open');
        this.setState({ open: true });
    };

    handleClose() {
        console.log('handleClose');
        this.setState({ open: false });
        // this.context.dialog.alert({description: 'Test Description', title: 'Test Title'});
        // this.context.dialog.confirm({description: 'Test Description', title: 'Test Title', callback: () => {console.log('callback!')}});
    };

    clickSubmit() {
        this.refs.form.submit();
    }

    render() {
        // console.log('render: modal');
        let props = this.props;
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
                onTouchTap={this.clickSubmit}
                disabled={!this.state.canSubmit}
                type="submit"
            />
        ];
        return (
            <div>
                <Dialog
                    title={props.title}
                    actions={actions}
                    modal={true}
                    open={true}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true} >
                    <SemiForm
                        ref="form"
                        noSubmit
                        onValidSubmit={props.submitForm}
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        get={props.get}
                        getCallback={props.getCallback}
                        submit={props.post}
                        submitCallback={props.submitCallback}
                    >
                        {props.children}
                    </SemiForm>
                </Dialog>
            </div>
        );
    }
}

SemiModal.propTypes = {
};

SemiModal.contextTypes = {
    router: PropTypes.object.isRequired,
    dialog: PropTypes.object.isRequired
};

export default SemiModal;


