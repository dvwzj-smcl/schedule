import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import { login, isAuthenticated, getError } from '../../actions/userActions';

import Divider from 'material-ui/Divider';
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import ErrorMessage from '../forms/ErrorMessage';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import SemiSelector from '../widgets/SemiSelector';

import AlertBox from '../widgets/AlertBox';

import api from '../../api';
import $ from 'jquery';
class UserCreateModal extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: true,
            user: [],
            openAlertBox: false,
            alertText: '',
            branches: [],
            roles: []
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.handleAlertOpen = this.handleAlertOpen.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);

        this.redirect = this.redirect.bind(this);

        this.getData = this.getData.bind(this);
        this.enableButton = this.enableButton.bind(this);
        this.disableButton = this.disableButton.bind(this);
        this.submitForm = this.submitForm.bind(this);



        this.createData =  this.createData.bind(this);
        this.editData =  this.editData.bind(this);
        this.storeData =  this.storeData.bind(this);
        this.updateData =  this.updateData.bind(this);
    }

    componentDidMount(){
        // console.log('[ManageUserTypePage] componentDidMount');
        // if (typeof this.props.userId!="undefined"){
        //     console.log('load Edit data');
        //     this.getData();
        // }
        this.getData();
    }




    handleOpen() {
        this.setState({open: true});
    };

    handleClose() {
        this.setState({open: false});
        this.redirect();
    };

    handleAlertOpen(){
        this.setState({openAlertBox: true});
    }

    handleAlertClose(){
        this.setState({openAlertBox: false});
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

    ajax(method, url, data, success, error){
        data = JSON.stringify(data);
        let state = Object.assign({}, this.state, {loading: true});
        this.setState(state);
        let access_token = this.props.user.access_token;
        // console.log('access_token',access_token);
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            setTimeout(()=>{
                let state = Object.assign({}, this.state, {loading: false});
                this.setState(state);
            }, 1000);

            if (response.status == "error"){
                this.setState({alertText: response.data.error});
                this.handleAlertOpen();

            }
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }

    getData(){
        (typeof this.props.userId!=="undefined") ? this.editData() :  this.createData();
    }

    editData(){
        this.ajax('GET', api.baseUrl('/user/' + this.props.userId + '/edit'), null,
            (response)=> {
                if (response.status == "success") {
                    this.setState({branches: response.data.branches});
                    this.setState({roles: response.data.roles});
                    this.setState({user: response.data});
                }
            },
            error=> {
            }
        );
    }
    createData(){
        console.log('create data');
        this.ajax('GET', api.baseUrl('/user/create'), null,
            (response)=> {
                if (response.status == "success") {
                    this.setState({branches: response.data.branches});
                    this.setState({roles: response.data.roles});
                    console.log(response);
                }
            },
            error=> {
            }
        );
    }

    submitForm(data) {

        if (typeof this.props.userId!="undefined"){
            this.updateData(data);
        }else{
            this.storeData(data);
        }
    }

    updateData(data){
        console.log('update');
        this.ajax('PUT', api.baseUrl('/user/'+this.props.userId ), data,
            (response)=>{
                console.log('response',response);
                if(response.status=="success"){
                    this.handleClose();
                }
            },
            error=>{}
        );
    }
    storeData(data){
        console.log('store',data);
        this.ajax('post', api.baseUrl('/user' ), data,
            (response)=>{
                console.log('response',response);
                if(response.status=="success"){
                    this.handleClose();
                }
            },
            error=>{}
        );
    }

    redirect(){
        //toastr.success('Course saved');
        this.context.router.push('/users');
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {
                  this.formsyForm.submit();
                }}
                type="submit"
            />,
        ];

        const radios = [];
        for (let i = 0; i < 30; i++) {
            radios.push(
                <RadioButton
                    key={i}
                    value={`value${i + 1}`}
                    label={`Option ${i + 1}`}
                />
            );
        }
        const {user} = this.state ;

        const {password} = (typeof this.props.userId!=="undefined") ? "" :
            <div>
                <SemiText
                    name="password"
                    type="password"
                    value={user.password}
                    ref="password"
                    validations={{minLength: 3,maxLength: 50}}
                    required
                    hintText="What is login password?"
                    floatingLabelText="password"
                    underlineShow={true}
                />
                <br />
                <SemiText
                    name="confirmPassword"
                    type="password"
                    value={user.password}
                    ref="confirmPassword"
                    validations="equalsField:password"
                    validationError={ErrorMessage.equalsField}
                    required
                    hintText="What is login password?"
                    floatingLabelText="confim password"
                    underlineShow={true}
                />
                <br />
            </div>
            ;

        // console.log('render state',this.state);
        return (
            <div>
                <AlertBox
                    openAlertBox={this.state.openAlertBox}
                    alertText={this.state.alertText}
                    alertFunction={this.handleAlertClose}
                />
                <RaisedButton label="Scrollable Dialog" onTouchTap={this.handleOpen} />
                <Dialog
                    title="Create User"
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    autoScrollBodyContent={true}
                    style={{zIndex :'900'}}
                >
                    <Formsy.Form
                        noSubmit

                        ref={(form) => {
                            this.formsyForm = form;
                        }}
                        onValid={this.enableButton}
                        onInvalid={this.disableButton}
                        onValidSubmit={this.submitForm}
                    >

                        <SemiText
                            name="username"
                            value={user.username}
                            ref="username"
                            validations={{minLength: 3,maxLength: 50}}
                            required
                            hintText="What is user login name?"
                            floatingLabelText="username"
                            underlineShow={true}
                        />
                        <br />

                        {password}

                        <SemiText
                            name="name"
                            value={user.name}
                            ref="name"
                            validations={{minLength: 3, maxLength: 50}}
                            required
                            hintText="What is user name?"
                            floatingLabelText="Name"
                            underlineShow={true}
                        />
                        <br />
                        <SemiText
                            name="email"
                            value={user.email}
                            ref="email"
                            validations="isEmail"
                            required
                            hintText="What is user email?"
                            floatingLabelText="email"
                            underlineShow={true}
                        />
                        <br />
                        <SemiSelector  name="branch"
                                       ref="branch"
                                       dataSelector={this.state.branches}
                                       selectValue={user.branchId}
                                       required
                                       floatingLabelText={'branch'}
                        >
                        </SemiSelector>
                        <br />
                        <SemiText
                            name="phone"
                            value={user.phone}
                            ref="phone"
                            validations={{minLength: 3,maxLength: 50}}
                            required
                            hintText="What is user phone?"
                            floatingLabelText="phone"
                            underlineShow={true}
                        />
                        <br />
                        <SemiText
                            name="phone2"
                            value={user.phone2}
                            ref="phone2"
                            validations={{minLength: 3,maxLength: 50}}
                            hintText="What is user phone2?"
                            floatingLabelText="phone2"
                            underlineShow={true}
                        />
                        <br />
                        <SemiSelector  name="roles"
                                       ref="roles"
                                       dataSelector={this.state.roles}
                                       selectValue={user.roleId}
                                       required
                                       floatingLabelText={'roles'}
                        >
                        </SemiSelector>


                    </Formsy.Form>
                </Dialog>
            </div>
        );
    }
}

UserCreateModal.propTypes = {
    // actions: PropTypes.object.isRequired,
    // routing: PropTypes.object.isRequired
};
UserCreateModal.contextTypes = {
    router: PropTypes.object.isRequired
};
function mapStateToProps(state, ownProps){



    return {
        user: state.user,
        userId: ownProps.params.id
    };
}
export default connect(mapStateToProps)(UserCreateModal);