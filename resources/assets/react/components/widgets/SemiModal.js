/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SemiForm from '../forms/SemiFormsy';

class SemiModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            canSubmit: false,
            open: props.alwaysOpen ? true : props.open || false
        };
    }

    enableButton = () => {
        if(this.state.canSubmit === true) return;
        this.setState({ canSubmit: true });
    };

    disableButton = () => {
        if(this.state.canSubmit === false) return;
        this.setState({ canSubmit: false });
    };

    // todo: delete this
    submitCallback = (data) => {
        if(this.props.submitCallback) {
            // Close the dialog only when the callback returns true
            if(this.props.submitCallback(data)) this.close();
        } else {
            this.close();
        }
    };

    onLoad = (ajax) => {
        if(this.props.onLoad) return this.props.onLoad(ajax);
    };

    onSubmit = (data, ajax) => {
        if(typeof ajax === 'function') return; // unknown bug fix, try removing this and console.log(ajax) to see the bug

        if(this.props.onSubmit) {
            let promise = this.props.onSubmit(Object.assign({}, data, this.state.externalData), ajax);
            if(promise) {
                return promise.then( response => {
                    this.close();
                    return response;
                }).catch( error => {
                    // todo: error handling
                    throw error; // to .catch SemiForm
                });
            } else {
                this.close();
            }

        }
    };

    // for ref.open. May have external data.
    open = (externalData) => {
        this.setState({ open: true, externalData});
    };

    close = () => {
        if(this.props.alwaysOpen) {
            this.context.router.goBack();
        } else {
            if(this.props.onClose) this.props.onClose();
            this.setState({ open: false });
        }
    };

    clickSubmit = () => {
        this.refs.form.submit();
    };

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
        let children = props.formTemplate ? null : props.children;
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
                        onLoad={this.props.onLoad? this.onLoad : null}
                        onSubmit={this.props.onSubmit? this.onSubmit : null}
                        formTemplate={props.formTemplate}
                    >
                        {children}
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


