import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import SemiModal from '../widgets/SemiModal';
// import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import SemiText from '../forms/SemiText';
import SemiSelect from '../forms/SemiSelect';

class UserModal extends Component {
    constructor(props, context) {
        super(props, context);
        
        let userId = props.params.id;
        this.state = {
            open: true,
            data: {},
            values: {},
            changePass: true,
            ready: false,
            get: [
                {url:'branches/list', name: 'data.branches'},
                {url:'roles/list', name: 'data.roles'}
            ],
            submit: userId? {url: `users/${userId}`, method: 'put'} : {url: 'users'},
            title: userId? 'Edit User' : 'Create User',
            togglePass: null
        };

        // todo: Additional Create/Edit settings here...
        if(userId) { // edit
            this.state.get.push({url:`users/${userId}/edit`, name: 'values'});
        }

        this.getCallback = this.getCallback.bind(this);
        this.submitCallback = this.submitCallback.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleOpenPassword = this.handleOpenPassword.bind(this);
    }

    componentWillMount(){
        if (typeof this.props.params.id!=="undefined") {
            this.setState({changePass:false});
            let togglePass = (<Row>
                <Col xs md={6}>
                    <Toggle
                        name="changePass"
                        label="change password"
                        onToggle={this.handleOpenPassword}
                    />
                </Col>
            </Row>);
            this.setState({togglePass});
        }
    }

    getCallback(data) {
        // console.log('*data', data);
        this.setState(data);
    }

    submitCallback(data) {
        // todo : check error
        if(data.error) {
            this.context.dialog.alert(data.error, 'Error');
            return false;
        }
        // return true; // will goBack browser history

        if (data.length <= 0) {
            console.log('redirect!');
            this.context.router.push('/users');
            location.reload();
            // window.location.href = '/users' ;
        }
    }

    submitForm(data) {
        // todo: Filter or Change data before POST to server
        console.log('***data', data);
        return data;
    }

    handleOpenPassword(){
        let changepass = (this.state.changePass) ? false :  true ;
        this.setState({changePass:changepass});
    }


    render() {
        let values = this.state.values;
        const {title,get,submit,togglePass,changePass} = this.state ;

        return (
            <SemiModal 
                ref="modal" 
                title={title}
                get={get}
                alwaysOpen // disable open/close
                getCallback={this.getCallback}
                submit={submit} // url. REMOVE if no need to send data
                submitForm={this.submitForm} // filter data before sending to server -or- just process here if no need to send data
                submitCallback={this.submitCallback} // callback from server. REMOVE if no need to send data
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
                </Row>

                {togglePass}

                {changePass ?
                    <Row>
                        <Col xs md={6}>
                            <SemiText
                                name="password"
                                type="password"
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
                                validations="equalsField:password"
                                required
                                floatingLabelText="confim password"
                                fullWidth={true}
                            />
                        </Col>
                    </Row>
                    :
                    null}
                <Row>
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
                            hintText="Primary phone number"
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
                            multiple
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
    params: PropTypes.object
};
UserModal.contextTypes = {
    router: PropTypes.object.isRequired,
    dialog: PropTypes.object.isRequired
};

export default connect(({user})=>({user}))(UserModal);