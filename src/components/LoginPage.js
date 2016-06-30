import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import Formsy from 'formsy-react';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import SemiText from './forms/SemiText';

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
                                <SemiText
                                    name="username"
                                    validations="isWords"
                                    validationError={this.errorMessages.wordsError}
                                    required
                                    hintText="What is your username?"
                                    floatingLabelText="Username"
                                    underlineShow={false}
                                    />
                                <Divider />
                                <SemiText
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
    userActions: PropTypes.object
};

export default LoginPage;