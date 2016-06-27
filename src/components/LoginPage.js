import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

class LoginPage extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            username: null,
            password: null
        };
        this.updateForm = this.updateForm.bind(this);
        this.login = this.login.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }
    login(){
        console.log('login', this.state);
    }
    handleKeyDown(e) {
        if (e.keyCode === 13) this.login();
    }
    updateForm(e){
        console.log('updateForm', e.target.name, e.target.value);
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
                            <div style={{padding: '14px 26px'}}>
                                <TextField underlineShow={false} hintText="Username" name="username" onChange={this.updateForm} onKeyDown={this.handleKeyDown} />
                                <Divider />
                                <TextField underlineShow={false} hintText="Password" name="password" type="password" onChange={this.updateForm} onKeyDown={this.handleKeyDown} />
                                <Divider />
                                <RaisedButton label="Login" secondary={true} style={{marginTop: 12}} onTouchTap={this.login} />
                            </div>
                        </Paper>
                    </Col>
                </Row>
            </Grid>
        );
    };
}

LoginPage.propTypes = {};

export default LoginPage;