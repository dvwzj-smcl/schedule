import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const FormsyTextMixin = React.createClass({
    propTypes: {
        type: PropTypes.string
    },
    mixins: [Formsy.Mixin],
    handleOnChange(event){
        this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
    },
    render(){
        const cloneProps = Object.assign({}, this.props);
        cloneProps.onChange = this.handleOnChange;
        cloneProps.value = this.getValue();
        cloneProps.checked = this.props.type === 'checkbox' && this.getValue() ? 'checked' : null;
        return React.cloneElement(<FormsyText {...cloneProps} />);
    }
});

class LoginPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            canSubmit: false
        };
        this.errorMessages = {
            wordsError: "Please only use letters",
            numericError: "Please provide a number",
            urlError: "Please provide a valid URL"
        };

        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.notifyFormError = this.notifyFormError.bind(this);
    }

    componentDidMount() {
    }
    componentDidUpdate() {
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
        this.props.userActions.login(data);
    }

    notifyFormError(/*data*/) {
        //console.error('Form error:', data);
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col mdOffset={4} md={4}>
                        <Paper>
                            <AppBar
                                title="Login"
                                showMenuIconButton={false} />
                            <Formsy.Form
                                ref="login-form"
                                onValid={this.enableButton}
                                onInvalid={this.disableButton}
                                onValidSubmit={this.submitForm}
                                onInvalidSubmit={this.notifyFormError}
                                style={{padding: '16px 24px'}}>
                                <FormsyTextMixin
                                    name="username"
                                    validations="isWords"
                                    validationError={this.errorMessages.wordsError}
                                    required
                                    hintText="What is your username?"
                                    floatingLabelText="Username"
                                    underlineShow={false}
                                    />
                                <Divider />
                                <FormsyTextMixin
                                    name="password"
                                    type="password"
                                    validations="isWords"
                                    validationError={this.errorMessages.wordsError}
                                    required
                                    hintText="What is your password?"
                                    floatingLabelText="Password"
                                    underlineShow={false}
                                    />
                                <Divider />
                                <RaisedButton
                                    secondary={true}
                                    style={{marginTop: 12}}
                                    type="submit"
                                    label="Login"
                                    disabled={!this.state.canSubmit} />
                            </Formsy.Form>
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

LoginPage.propTypes = {
    userActions: PropTypes.array
};

export default LoginPage;