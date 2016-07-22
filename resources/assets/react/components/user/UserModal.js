import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import SemiModal from '../widgets/SemiModal';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Divider from 'material-ui/Divider';
import SemiText from '../forms/SemiText';
import SemiSelect from '../forms/SemiSelect';

class UserModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            data: {},
            values: {}
        };
        this.getCallback = this.getCallback.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    getCallback(data) {
        // console.log('*data', data);
        this.setState(data);
        // this.refs.branch.setValue(1);
    }

    submitCallback(data) {
        console.log('submitCallback', data);
    }

    submitForm(data) {
        // todo: Filter or Change data before POST to server
        return data;
    }

    render() {
        let values = this.state.values;
        // console.log('render: usermodal', this.state, values.branchId, values.roleId);
        return (
            <SemiModal 
                ref="modal" 
                title="Create User"
                get={[
                    {url:'branches/list', name: 'data.branches'},
                    {url:'roles/list', name: 'data.roles'},
                    {url:'user/1/edit', name: 'values'}
                ]}
                getCallback={this.getCallback}
                submit={{url: 'user'}} // url
                submitForm={this.submitForm} // filter
                submitCallback={this.submitCallback} // callback from server
            >
                <Row>
                    <Col xs md={6}>
                        <SemiText
                            name="username"
                            value={values.username}
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
                            value={values.email}
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
                            // defaultValue="asdfasdf"
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
                            // defaultValue="asdfasdf"
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
                            value={values.name}
                            validations={{ minLength: 3, maxLength: 50 }}
                            required
                            floatingLabelText="full name"
                            fullWidth={true}
                        />
                    </Col>
                    <Col xs md={6}>
                        <SemiSelect
                            name="branch"
                            data={this.state.data.branches}
                            value={values.branchId}
                            required
                            floatingLabelText={'branch'}
                            fullWidth={true}
                        />
                    </Col>
                </Row><Row>
                    <Col xs md={6}>
                        <SemiText
                            name="phone"
                            value={values.phone}
                            validations={{minLength: 3,maxLength: 50}}
                            required
                            hintText="Primary phone number"u
                            floatingLabelText="phone"
                            fullWidth={true}
                        />

                    </Col>
                    <Col xs md={6}>
                        <SemiText
                            name="phone2"
                            value={values.phone_2}
                            validations={{minLength: 3,maxLength: 50}}
                            hintText="Secondary phone number"
                            floatingLabelText="another phone"
                            fullWidth={true}
                        />
                    </Col>
                </Row><Row>
                    <Col xs md={6}>
                        <SemiSelect
                            name="roles"
                            data={this.state.data.roles}
                            value={values.roleId}
                            required
                            floatingLabelText={'roles'}
                            fullWidth={true}
                        />
                    </Col>
                    <Col xs md={6}>
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