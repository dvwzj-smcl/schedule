import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Form } from 'formsy-react';
import ReactDOM from 'react-dom';
import ApiCall from '../../api/ApiCall';
import Loading from '../widgets/Loading';

class SemiForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            canSubmit: false,
            ready: props.get? false : true
            // ready: false
        };

        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.getCallback = this.getCallback.bind(this);
        this.notifyFormError = this.notifyFormError.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.submit = this.submit.bind(this);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return this.state.canSubmit !== nextState.canSubmit;
    // }

    enableButton() {
        this.setState({
            canSubmit: true
        });
    }

    getCallback(data) {
        if(this.props.getCallback) {
            this.setState({
                ready: true
            });
            // todo: error handling
            this.props.getCallback(data);
        }
    }

    disableButton() {
        this.setState({
            canSubmit: false
        });
    }

    /** default for sumbit form
     * override by onValidSubmitC
     * ajax: POST
     */
    submitForm(data) {
        if(this.props.submitForm) {
            data = this.props.submitForm(data);
        }
        // console.log('semiform: default-submit', data, this.props.submitForm);
        this.refs.apiCall.getWrappedInstance().callPost(data);
    }

    notifyFormError(/*data*/) {}

    // can submit by calling this, instead of submit button press
    submit() {
        ReactDOM.findDOMNode(this.refs.submitBtn).click();
    }

    resetForm() {
        this.refs.form.reset();
    }

    render() {
        // console.log('render: form');
        let props = this.props;
        let resetBtn = props.hasReset && !props.noButton ? (
            <RaisedButton
                label="Reset"
                style={{marginTop: 24, marginLeft: 24}}
                onClick={this.resetForm}
            />
        ) : null;

        let submitBtn = props.noSubmit || props.noButton ? null : (
            <RaisedButton
                formNoValidate
                secondary={true}
                style={{marginTop: 24}}
                type="submit"
                label={props.submitLabel || 'Submit'}
                disabled={!this.state.canSubmit}
            />);
        return (
            <Form
                className="semiForm"
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                onValidSubmit={this.submitForm}
                onInvalidSubmit={this.notifyFormError}
                ref="form"
                {...props} 
            >
                {(()=>{
                    if(this.state.ready) return props.children;
                    else return <Loading inline />;
                })()}
                {submitBtn}
                {resetBtn}
                <ApiCall ref="apiCall"
                    get={props.get} getCallback={this.getCallback}
                    submit={props.submit} submitCallback={props.submitCallback}
                />
                <button style={{display:'none'}} ref="submitBtn" type="submit">Submit</button>
            </Form>);
    }
}


SemiForm.propTypes = {
    hasReset: PropTypes.bool,
    submitLabel: PropTypes.string,
    enableButton: PropTypes.func,
    disableButton: PropTypes.func,
    submitForm: PropTypes.func,
    submit: PropTypes.object,
    resetForm: PropTypes.func,
    notifyFormError: PropTypes.func,
    children: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    noSubmit: PropTypes.bool
};

export default SemiForm;