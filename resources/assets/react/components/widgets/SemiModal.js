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
        this.submitForm = this.submitForm.bind(this);
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
            // Close the dialog only when the callback returns true
            if(this.props.submitCallback(data)) this.close();
        } else {
            this.close();
        }
    };

    submitForm(data) {
        // merge with external data (from this.open)
        if(this.props.submitForm) {
            this.props.submitForm(Object.assign({}, data, this.state.externalData));
        }
    };

    // Recommended! please use this (by ref) instead of plain context.ajax()
    ajax(method, url, data, success, error) {
        // todo: add Loading... to submit button
        this.refs.form.ajax(method, url, data, success, error);
    }

    // open with optional external data
    open(externalData) {
        this.setState({ open: true, externalData});
    };

    close() {
        if(this.props.alwaysOpen) {
            this.context.router.goBack();
        } else {
            if(this.props.onClose) this.props.onClose();
            this.setState({ open: false });
        }
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
                        noButton
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        getUrls={props.getUrls}
                        getCallback={props.getCallback}
                        submitUrl={props.submitUrl}
                        submitForm={this.submitForm}
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


