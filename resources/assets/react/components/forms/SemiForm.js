import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Form } from 'formsy-react';

class SemiForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false
        };

        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.notifyFormError = this.notifyFormError.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.canSubmit !== nextState.canSubmit;
    }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    submitForm(data) {
        console.log('data', data);
    }

    notifyFormError(/*data*/) {
        // console.error('Form error:', data);
    }

    resetForm() {
        this.refs.form.reset();
    }

    render() {

        let resetBtn = this.props.hasReset ? (
            <RaisedButton
                label="Reset"
                style={{marginTop: 24, marginLeft: 24}}
                onClick={this.resetForm}
            />
        ) : null;

        let submitBtn = this.props.noSubmit ? null : (
            <RaisedButton
                formNoValidate
                secondary={true}
                style={{marginTop: 24}}
                type="submit"
                label={this.props.submitLabel || 'Submit'}
                disabled={!this.state.canSubmit}
            />);

        return (
            <Form
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm}
                onInvalidSubmit={this.notifyFormError}
                ref="form"
                {...this.props} >
                {this.props.children}
                {submitBtn}
                {resetBtn}
            </Form>);
    }
}


SemiForm.propTypes = {
    hasReset: PropTypes.bool,
    submitLabel: PropTypes.string,
    enableButton: PropTypes.func,
    disableButton: PropTypes.func,
    submitForm: PropTypes.func,
    resetForm: PropTypes.func,
    notifyFormError: PropTypes.func,
    children: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    noSubmit: PropTypes.bool
};

export default SemiForm;