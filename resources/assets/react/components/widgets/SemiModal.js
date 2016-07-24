/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SemiForm from '../forms/SemiForm';

class SemiModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.clickSubmit = this.clickSubmit.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.state = {
            canSubmit: false,
            open: props.alwaysOpen ? true : props.open || false
        };
    }

    enableButton() {
        this.setState({ canSubmit: true });
    }

    disableButton() {
        this.setState({ canSubmit: false });
    }

    submitCallback(data) {
        if(this.props.submitCallback) {
            if(this.props.submitCallback(data)) this.close();
        }
    };

    open() {
        this.setState({ open: true });
    };

    close() {
        if(this.props.alwaysOpen) {
            this.context.router.goBack();
        } else {
            if(this.props.onClose) this.props.onClose();
            this.setState({ open: false });
        }
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
                onTouchTap={this.close}
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
                    open={this.state.open}
                    onRequestClose={this.close}
                    autoScrollBodyContent={true} >
                    <SemiForm
                        ref="form"
                        noSubmit
                        submitForm={props.submitForm}
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        get={props.get}
                        getCallback={props.getCallback}
                        submit={props.submit}
                        submitCallback={this.submitCallback}
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


