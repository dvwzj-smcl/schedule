import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { login, isAuthenticated, getError } from '../actions/userActions';

import Divider from 'material-ui/Divider';
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';

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

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.canSubmit !== nextState.canSubmit) || (this.props.user.error !== nextProps.user.error);
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
        this.props.actions.login(data.username, data.password).then((json)=>{
            console.log('json', json);
            if(this.props.actions.isAuthenticated()){
                this.context.router.replace(this.props.routing.locationBeforeTransitions.query.ref || '/');
            }
        });
    }

    notifyFormError(/*data*/) {
        console.error('Form error:', data);
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col xs mdOffset={4} md={4}>
                        <Paper>
                            <AppBar
                                title="Login"
                                showMenuIconButton={false} />
                            <SemiForm
                                onValidSubmit={this.submitForm}
                                style={{padding: '16px 24px'}}>
                                <SemiText
                                    name="username"
                                    validations="isWords"
                                    validationError={this.errorMessages.wordsError}
                                    required
                                    hintText="What is your username?"
                                    floatingLabelText="Username"
                                    defaultValue="organizera"
                                    underlineShow={false}
                                    />
                                <Divider />
                                <SemiText
                                    name="password"
                                    type="password"
                                    validationError={this.errorMessages.wordsError}
                                    required
                                    hintText="What is your password?"
                                    floatingLabelText="Password"
                                    defaultValue="password"
                                    underlineShow={false}
                                    />
                                <Divider />
                            </SemiForm>
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

LoginPage.propTypes = {
    actions: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired
};
LoginPage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(
    (state)=>{
        return {
            user: state.user,
            routing: state.routing
        };
    },
    (dispatch)=>{
        return {
            actions: {
                getError: bindActionCreators(getError, dispatch),
                login: bindActionCreators(login, dispatch),
                isAuthenticated: bindActionCreators(isAuthenticated, dispatch)
            }
        };
    }
)(LoginPage);