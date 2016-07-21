import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import SemiModal from '../widgets/SemiModal';
import ApiCall from '../../api/ApiCall';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import SemiText from '../forms/SemiText';
import SemiSelect from '../forms/SemiSelect';

class UserModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            user: {},
            data: {},
            value: { branch: 1 }
        };
        this.submitForm = this.submitForm.bind(this);
        this.getCallback = this.getCallback.bind(this);
    }

    submitForm(data) {
        // to do
        console.log('data', data);
        // this.refs.modal.handleClose();
    }

    getCallback(data) {
        this.setState({data});
        // this.refs.branch.setValue(1);
    }

    submitCallback(data) {
        console.log('submitCallback', ...data);
    }

    render() {
        console.log('render: usermodal', this.state);
        let user = this.state.user;
        return (
            <SemiModal 
                ref="modal" 
                submitForm={this.submitForm} 
                title="Create User"
                get={[{url:'branches/list', name: 'branches'}, {url:'roles/list', name: 'roles'}]}
                getCallback={this.getCallback}
                submit={{url: 'user', data: {}}}
                submitCallback={this.getCallback}
            >
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
                            fullWidth={true}
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
                        <SemiSelect
                            name="branch"
                            ref="branch"
                            data={this.state.data.branches}
                            value={this.state.value.branch}
                            required
                            floatingLabelText={'branch'}
                            fullWidth={true}
                        />
                    </Col>
                </Row>
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