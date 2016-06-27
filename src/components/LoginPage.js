import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';

import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

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
        this.checkManualValid = this.checkManualValid.bind(this);
    }
    componentDidMount() {
    }
    componentDidUpdate() {
    }

    checkManualValid(){
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
        console.log(JSON.stringify(data, null, 4));
    }

    notifyFormError(data) {
        console.error('Form error:', data);
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
                                onSubmit={this.submitForm}
                                onValid={this.enableButton}
                                onInvalid={this.disableButton}
                                onValidSubmit={this.submitForm}
                                onInvalidSubmit={this.notifyFormError}
                                style={{padding: '16px 24px'}}>
                                <FormsyText
                                    name="username"
                                    validations="isWords"
                                    validationError={this.wordsError}
                                    required
                                    hintText="What is your username?"
                                    floatingLabelText="Username"
                                    underlineShow={false}
                                    />
                                <Divider />
                                <FormsyText
                                    name="password"
                                    type="password"
                                    validations="isWords"
                                    validationError={this.wordsError}
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
    };
}

LoginPage.propTypes = {};

export default LoginPage;