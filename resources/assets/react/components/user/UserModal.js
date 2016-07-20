import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';

import SemiModal from '../widgets/SemiModal';
import ApiCall from '../../api/ApiCall';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import SemiText from '../forms/SemiText';

class UserModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            user: {}
        };
        this.submitForm = this.submitForm.bind(this);
    }

    submitForm(data) {
        // to do
        console.log('data', data);
        // this.refs.modal.handleClose();
    }

    render() {
        let user = this.state.user;
        return (
            <SemiModal ref="modal" submitForm={this.submitForm} title="Create User">
                <Grid className="form-wrap">
                    <Row>
                        <Col xs md={6}>
                            <SemiText
                                name="username"
                                value={user.username}
                                validations={{ minLength: 3, maxLength: 50 }}
                                required
                                hintText="What is login username?"
                                floatingLabelText="username"
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs md={6}>
                            <SemiText
                                name="email"
                                value={user.email}
                                validations="isEmail"
                                required
                                floatingLabelText="email"
                                underlineShow={true}
                            />
                        </Col>
                    </Row><Row>
                        <Col xs md={6}>
                            <SemiText
                                name="password"
                                type="password"
                                value={user.password}
                                validations={{ minLength: 3, maxLength: 50 }}
                                hintText="Longer the better"
                                floatingLabelText="password"
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs md={6}>
                            <SemiText
                                name="confirmPassword"
                                type="password"
                                value={user.password}
                                validations="equalsField:password"
                                required
                                floatingLabelText="confim password"
                                fullWidth={true}
                            />
                        </Col>
                    </Row><Row>
                        <Col xs md={6}>
                            <SemiText
                                name="name"
                                value={user.name}
                                validations={{ minLength: 3, maxLength: 50 }}
                                required
                                floatingLabelText="full name"
                                fullWidth={true}
                            />
                        </Col>
                        <Col xs md={6}>
                        </Col>
                    </Row>
                </Grid>
            </SemiModal>
        );
    }
}

UserModal.propTypes = {
    // actions: PropTypes.object.isRequired,
    // routing: PropTypes.object.isRequired
};
UserModal.contextTypes = {
    router: PropTypes.object.isRequired
};

export default connect(({user})=>({user}))(UserModal);