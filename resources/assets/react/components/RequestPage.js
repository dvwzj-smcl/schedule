import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import SemiModal from './widgets/SemiModal';
//import SemiSelect from './forms/SemiSelect';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import api from '../api';

import $ from 'jquery';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import moment from 'moment';
import 'fullcalendar';
import 'fullcalendar/dist/lang-all';

// Forms
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

//import ErrorMessage from './forms/ErrorMessage';

import Validation from 'react-validation';
import SemiValidation from './forms/SemiValidation';
import validator from 'validator';

Object.assign(Validation.rules, {
    // Key name maps the rule
    required: {
        // Function to validate value
        rule: (value, component, form) => {
            return value.toString().trim();
        },
        // Function to return hint
        // You may use current value to inject it in some way to the hint
        hint: value => {
            return "";
        }
    },
    optional: {
        rule: () => {
            return true;
        },
    },
    email: {
        // Example usage with external 'validator'
        rule: (value, component, form) => {
            let optional = component.props.validations.indexOf("optional")>-1;
            return optional ? (value ? validator.isEmail(value) : true) : validator.isEmail(value);
        },
        hint: value => {
            return `${value} isnt an Email.`;
        }
    },
    // This example shows a way to handle common task - compare two fields for equality
    password: {
        // rule function can accept 2 extra arguments:
        // component - current checked component
        // form - form component which has 'states' inside native 'state' object
        rule: (value, component, form) => {
            // form.state.states[name] - name of corresponding field
            let password = form.state.states.password;
            let passwordConfirm = form.state.states.passwordConfirm;
            // isUsed, isChanged - public properties
            let isBothUsed = password && passwordConfirm && password.isUsed && passwordConfirm.isUsed;
            let isBothChanged = isBothUsed && password.isChanged && passwordConfirm.isChanged;

            if (!isBothUsed || !isBothChanged) {
                return true;
            }

            return password.value === passwordConfirm.value;
        },
        hint: value => {
            return <span className='form-error is-visible'>Passwords should be equal.</span>
        }
    }
});

class RequestPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.inputError = this.inputError.bind(this);
        this.inputOnChange = this.inputOnChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {

    }
    inputError(e){
        console.log(e);
    }
    inputOnChange(e){
        console.log('props', e);
    }

    onSubmit(event){
        event.preventDefault();
        console.log(this.refs.form.getData());
    }

    ajax(method, url, data, success, error){
        data = JSON.stringify(data);
        let state = Object.assign({}, this.state, {loading: true});
        this.setState(state);
        let access_token = this.props.user.access_token;
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
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }

    render() {
        return (
            <div>
                <PageHeading title="Request" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={9}>
                            <Panel title="Request">
                                <div className="con-pad">
                                    <SemiValidation.components.Form ref="form" onSubmit={this.onSubmit}>
                                        <SemiValidation.components.TextField hintText="Email" name="email" validations={['optional', 'email']} />
                                        <SemiValidation.components.TextField hintText="Username" name="username" validations={['required']} />
                                        <SemiValidation.components.SelectField name="test" validations={['optional']} options={[{id:1, name:'test 1'}, {id:2, name:'test 2'}]} />
                                        <SemiValidation.components.SelectField multiple name="test2" validations={['required']} options={[{id:3, name:'test 3'}, {id:4, name:'test 4'}]} />
                                        <SemiValidation.components.MultipleSelectField name="test3" validations={['optional']} options={[{id:5, name:'test 5'}, {id:6, name:'test 6'}]} />
                                        <SemiValidation.components.AutoComplete hintText="Doctor" name="doctor_id" dataSource={[{value:1,text:'test 1'},{value:2,text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"id", text:"user.name"}} validations={['required']} />
                                        <SemiValidation.components.RaisedButton label="Submit" type="submit" />
                                    </SemiValidation.components.Form>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={3}>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

RequestPage.propTypes = {};
RequestPage.contextTypes = {
    dialog: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RequestPage);