import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { Row, Col } from 'react-flexbox-grid';

import SemiModal from '../widgets/SemiModal';
// import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Toggle from 'material-ui/Toggle';
import SemiText from '../../backups/components/forms/SemiText';
import SemiSelect from '../../backups/components/forms/SemiSelect';

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
        let SuccessMessage = userId ? 'User Updated' : 'User Created';

        // todo
        // must return a promise
        return ajax.call(method, url, data).then( response => {
            this.context.dialog.alert(SuccessMessage, 'Success', 'success');
            this.context.dataTable.handleReload();
            return response;
        }).catch( error => {
            this.context.dialog.alert(error, 'Error');
            throw error;
        });
    }


    handleOpenPassword(){
        console.log('123', 123);
        this.setState({changePass: !this.state.changePass});
    }

    render() {
        console.log('render: User Modal');
        let values = this.state.values;
        let editId = this.props.params.id;
        let data = this.state.data;
        let isEdit = !!this.props.params.id;
        const {title,changePass} = this.state;

        console.log('changePass', changePass);

        let formTemplate = {
            data: {branch_id: data.branches, roles: data.roles},
            values: this.state.values,
            // values: {
            //     username: 'user1',
            //     email: 'admin@localhost.com',
            //     password: 'password555',
            //     passwordConfirm: 'password555',
            //     branch_id: 1,
            //     name: 'test name',
            //     phone: '1234',
            //     phone_2: '1',
            //     roles: [1]
            // },
            components: [
                [
                    {type: 'text', name: 'username', label: 'Username*', required: true},
                    {type: 'text', name: 'email', label: 'Email*', required: true, validations:'isEmail'}
                ],
                {
                    settings: {hide: !isEdit},
                    items: [
                        (<Toggle
                            name="changePass"
                            label="Change Password"
                            style={{marginTop: 24, marginBottom: 8}}
                            labelPosition="right"
                            toggled={changePass}
                            onToggle={this.handleOpenPassword}
                        />)
                    ]
                },
                {
                    settings: {hide: isEdit && !changePass},
                    items: [
                        {type: 'password', name: 'password', label: 'Password*', required: true},
                        {type: 'password', name: 'passwordConfirm', label: 'Confirm Password*', hint: 'Same as password', required: true, validations:'equalsField:password'}
                    ]
                },
                [
                    {type: 'text', name: 'name', label: 'Full Name*', required: true},
                    {type: 'select', name: 'branch_id', label: 'Branch*', required: true}
                ],
                [
                    {type: 'text', name: 'phone', label: 'Phone*', required: true},
                    {type: 'text', name: 'phone_2', label: 'Secondary Phone', hint: 'Secondary phone number'}
                ],
                [
                    {type: 'multiselect', name: 'roles', label: 'Roles*', required: false}
                ]
            ]
        };

        return (
            <SemiModal
                ref="modal"
                title={title}
                alwaysOpen // disable open/close for route modal
                onLoad={this.onLoad}
                onSubmit={this.onSubmit}
                formTemplate={formTemplate}
            />
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