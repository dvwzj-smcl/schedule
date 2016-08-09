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
        this.state = {
            open: true,
            data: {},
            values: {},
            changePass: false,
            title: props.params.id? 'Edit User' : 'Create User'
        };
        this.handleOpenPassword = this.handleOpenPassword.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onLoad(ajax) {
        let userId = this.props.params.id;
        let urls = [
            {url:'branches/list', name: 'data.branches'},
            {url:'roles/list', name: 'data.roles'}
        ];
        if(userId) { // edit
            urls.push({url:`users/${userId}/edit`, name: 'values'});
        }

        // must return a promise
        return ajax.getAll(urls).then( data => {
            this.setState(data);
            return data;
        });
    }

    onSubmit(data, ajax) {
        let userId = this.props.params.id;
        let url = userId ? `users/${userId}` : 'users';
        let method = userId ? 'put' : 'post';

        // todo
        // must return a promise
        return ajax.call(method, url, data);
    }


    // submitCallback(data) {
    //
    //     console.log('data', data);
    //     if(data.error) {
    //         // todo : show error
    //     }
    //
    //     // this.context.router.push('/users');
    //     this.context.dataTable.reload();
    //     return true; // will goBack browser history
    // }

    handleOpenPassword(){
        this.setState({changePass: !this.state.changePass});
    }

    render() {
        let values = this.state.values;
        let editId = this.props.params.id;
        const {title,changePass} = this.state;

        let togglePass = (<Row style={{marginTop: 16}}>
            <Col xs md={6}>
                <Toggle
                    name="changePass"
                    label="change password"
                    toggled={changePass}
                    onToggle={this.handleOpenPassword}
                />
            </Col>
        </Row>);

        return (
            <SemiModal
                ref="modal"
                title={title}
                alwaysOpen // disable open/close for route modal
                onLoad={this.onLoad}
                onSubmit={this.onSubmit}
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

                {editId ? togglePass : null}

                {changePass || !editId ?
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
                    </Row> : null}
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
    dialog: PropTypes.object.isRequired,
    dataTable: PropTypes.object
};

export default connect(({user})=>({user}))(UserModal);