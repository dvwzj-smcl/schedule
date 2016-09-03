import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import SemiModal from './widgets/SemiModal';
// import SemiDataTable from './widgets/SemiDataTable';
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
import SemiForm from './forms/SemiForm';

// Forms
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';
import TextField from 'material-ui/TextField';

//import ErrorMessage from './forms/ErrorMessage';

import SemiValidation from './../backups/components/forms/SemiValidation';
import Validation from 'react-validation';

Object.assign(Validation.rules, {
    semi: {
        rule: (value, component, form) => {
            let optional = component.props.validations.indexOf("optional")>-1;
            let check = value&&value&&value.match(/semi:/g);
            return optional ? (value ? check : true) : check;
        },
        hint: value => {
            return "Accept only `semi:`";
        }
    },
    semi2: {
        rule: (value, component, form) => {
            let optional = component.props.validations.indexOf("optional")>-1;
            let re = new RegExp(/semi:/g);
            let check = value&&re.test(value);
            return optional ? (value ? check : true) : check;
        },
        hint: value => {
            return "Accept only `semi:`";
        }
    }
});

class FormDemoPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.inputError = this.inputError.bind(this);
        this.inputOnChange = this.inputOnChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

    }

    add = (a, b) => {
        return a + b;
    };

    log = (target, name, descriptor) => {
        var oldValue = descriptor.value;

        descriptor.value = function() {
            console.log(`Calling "${name}" with`, arguments);

            return oldValue.apply(null, arguments);
        };

        return descriptor;
    };

    componentDidMount() {
        this.add(44, 55);
    }

    inputError(e){
        console.log(e);
    }
    inputOnChange(e){
        console.log('props', e);
    }

    onSubmit(event){
        console.log('submit event', event);
        event.preventDefault();
        console.log(this.refs.form.getData());
    }

    onSemiformSubmit(data){
        console.log('submit', data);
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

        // ************* Test SemiFrom: Formsy Here!
        let formTemplate = {
            values: {
                first_name: 'Semi',
                last_name: 'Semi',
                password: 'asdfasdf',
                passwordConfirm: 'asdfasdf',
                date: new Date(),
                test_select: '1',
                test_multiple_select: [1,'2'],
                test_color: '#c5cae9',
                test_number: 123,
                test_toggle1: true,
                test_checkbox1: [2]
            }, // default values
            settings: {},
            // validators: {hn: {rule: '/^\d{6,7}$/', hint: 'Invalid HN'}},
            components: [
                [
                    {type: 'password', name: 'password', label: 'Password*', required: true},
                    {type: 'password', name: 'passwordConfirm', label: 'Confirm Password*', hint: 'Same as password', required: true, validations:'equalsField:password'}
                ],
                [
                    {type: 'text', name: 'first_name', label: 'First Name*', required: true, validations:'isAlphanumeric', disabled: true},
                    {type: 'date', name: 'date', label: 'Date*', required: true}
                ],
                [
                    {type: 'select', name: 'test_select', label: 'Test Select*', options:[{id:1,name:'asdf'},{id:2,name:'qwer'}], required: true, disabled: true},
                    {type: 'multiselect', name: 'test_multiple_select', label: 'Test Multiple Select*', options:[{id:1,name:'asdf'},{id:2,name:'zxcv'}], required: true, disabled: true}
                ],
                [
                    {type: 'color', name: 'test_color', label: 'Test Color*', required: true},
                    {type: 'numeric', name: 'test_number', label: 'Test Number*', disabled: true}
                ],
                [
                    {type: 'slider', name: 'test_slider1', label: 'Test Slider 1*', step: 10, min: 0, max: 120, showValue: true, required: false},
                    {type: 'toggle', name: 'test_toggle1', label: 'Test Toggle 1*', labelPosition: "right", required: false}
                ],
                [
                    {type: 'slider', name: 'test_slider2', label: 'Test Slider 2*', step: 10, min: 0, max: 120, showValue: false, required: false},
                    {type: 'toggle', name: 'test_toggle2', label: 'Test Toggle 2*', required: false}
                ],
                [
                    {type: 'checkbox', name: 'test_checkbox1', label: 'Test Checkbox 1*', options:[{id:1,name:'aaaa'},{id:2,name:'bbbb'}], required: false},
                    {type: 'radio', name: 'test_radio1', label: 'Test Radio 1*', options:[{id:3,name:'cccc'},{id:4,name:'dddd'}], required: false}
                ],
                [
                    {type: 'checkbox', name: 'test_checkbox2', label: 'Test Checkbox 2*', labelPosition: "right", options:[{id:1,name:'aaaa'},{id:2,name:'bbbb'}], required: false},
                    {type: 'radio', name: 'test_radio2', label: 'Test Radio 2*', labelPosition: "right", options:[{id:3,name:'cccc'},{id:4,name:'dddd'}], required: false}
                ],
                [
                    {type: 'autocomplete', name: 'test_auto_complete', label: 'Test Auto Complete*', dataSource: [{value:1,text:'test 1'},{value:2,text:'test 2'}],  /*dataSourceResult:"doctors", dataSourceSearch: 'name', dataSourceMap: {value: 'id', text: 'user.name'},*/ required: false},
                    {type: 'typeahead', name: 'test_type_ahead', label: 'Test Type Ahead*', dataSource: [{value:3,text:'test 3'},{value:4,text:'test 4'}], required: false}
                ]
            ]
        };

        // original
        let formItems1 = (
            <div>
                <SemiValidation.components.TextField hintText="Email" name="email" floatingLabelText="Email (Optional)" floatingLabelFixed={true} validations={['optional', 'email']} />
                <SemiValidation.components.TextField hintText="Username" name="username" floatingLabelText="Username (Required)" floatingLabelFixed={true} validations={['optional']} />
                <SemiValidation.components.SelectField hintText="Test 1" name="test" floatingLabelText="Single Selection (Required)" floatingLabelFixed={true} validations={['optional']} options={[{id:1, name:'test 1'}, {id:2, name:'test 2'}]} />
                <SemiValidation.components.SelectField hintText="Test 2" multiple name="test2" floatingLabelText="Multiple Selection (Required)" floatingLabelFixed={true} validations={['optional']} options={[{id:3, name:'test 3'}, {id:4, name:'test 4'}]} />
                <SemiValidation.components.MultipleSelectField hintText="Test 3" name="test3" floatingLabelText="Multiple Selection (Optional)" floatingLabelFixed={true} validations={['optional']} options={[{id:5, name:'test 5'}, {id:6, name:'test 6'}]} />
                <SemiValidation.components.AutoComplete hintText="Doctor" name="doctor_id" floatingLabelText="Auto Complete (Required)" floatingLabelFixed={true} dataSource={[{value:1,text:'test 1'},{value:2,text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"id", text:"user.name"}} validations={['optional']} />
                <SemiValidation.components.TypeAhead hintText="Doctor Name" name="doctor_name" floatingLabelText="TypeAhead (Required)" floatingLabelFixed={true} dataSource={[{value:'test 1',text:'test 1'},{value:'test 2',text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"user.name", text:"user.name"}} validations={['optional']} />
                <SemiValidation.components.ColorPicker hintText="Color" name="color" floatingLabelText="Color Picker (Optional)" floatingLabelFixed={true} validations={['optional']} />
                <SemiValidation.components.DatePicker name="date" floatingLabelText="Date Picker (Optional)" format="YYYY-MM-DD" floatingLabelFixed={true} validations={['optional']} />
            </div>
        );

        // for fullWidth bugs
        let formItems2 = (
            <div>
                <Row>
                    <Col xs md={6}>
                        <SemiValidation.components.DatePicker name="date" floatingLabelText="Date Picker (Optional)" format="YYYY-MM-DD" fullWidth={true} floatingLabelFixed={true} validations={['optional']} />
                    </Col>
                    <Col xs md={6}>
                        <SemiValidation.components.TextField hintText="Username" name="username" floatingLabelText="Username (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} />
                    </Col>
                </Row>
                <Row>
                    <Col xs md={6}>
                        <SemiValidation.components.TextField hintText="Password"  name="password" type="password" floatingLabelText="Passsword (Required)" fullWidth={true} floatingLabelFixed={true} validations={['required', 'password']} />
                    </Col>
                    <Col xs md={6}>
                        <SemiValidation.components.TextField hintText="Password Confirm" name="passwordConfirm" type="password" floatingLabelText="Passsword (Required)" fullWidth={true} floatingLabelFixed={true} validations={['required', 'password']} />
                    </Col>
                </Row>
                <SemiValidation.components.TextField hintText="Email" name="email" floatingLabelText="Email (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional', 'email']} />
                <SemiValidation.components.SelectField value={1} hintText="Test 1" name="test" floatingLabelText="Single Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:1, name:'test 1'}, {id:2, name:'test 2'}]} />
                <SemiValidation.components.SelectField hintText="Test 2" multiple name="test2" floatingLabelText="Multiple Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:3, name:'test 3'}, {id:4, name:'test 4'}]} />
                <SemiValidation.components.MultipleSelectField hintText="Test 3" name="test3" floatingLabelText="Multiple Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:5, name:'test 5'}, {id:6, name:'test 6'}]} />
                <SemiValidation.components.AutoComplete hintText="Doctor" name="doctor_id" floatingLabelText="Auto Complete (Optional)" fullWidth={true} floatingLabelFixed={true} dataSource={[{value:1,text:'test 1'},{value:2,text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"id", text:"user.name"}} validations={['optional']} />
                <SemiValidation.components.AutoComplete typeahead hintText="Doctor Name" name="doctor_name" floatingLabelText="TypeAhead (Optional)" fullWidth={true} floatingLabelFixed={true} dataSource={[{value:'test 1',text:'test 1'},{value:'test 2',text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"user.name", text:"user.name"}} validations={['optional']} />
                <SemiValidation.components.TypeAhead hintText="Doctor Name 2" name="doctor_name2" floatingLabelText="TypeAhead (Optional)" fullWidth={true} floatingLabelFixed={true} dataSource={[{value:'test 1',text:'test 1'},{value:'test 2',text:'test 2'}]} dataSourceSearch="name" dataSourceResult="doctors" dataSourceMap={{value:"user.name", text:"user.name"}} validations={['optional']} />
                <SemiValidation.components.ColorPicker hintText="Color" name="color" floatingLabelText="Color Picker (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} />
                <SemiValidation.components.DatePicker name="date" floatingLabelText="Date Picker (Optional)" format="YYYY-MM-DD" fullWidth={true} floatingLabelFixed={true} validations={['optional']} />
                <SemiValidation.components.TextField value="semi:" hintText="Just type 'semi:'" name="semi" floatingLabelText="Semi (Required)" fullWidth={true} floatingLabelFixed={true} validations={['required', 'semi']} />
                <SemiValidation.components.TextField hintText="Just type 'semi:'" name="semi2" floatingLabelText="Semi (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional', 'semi2']} />
                <SemiValidation.components.Radio name="test4" value={5} floatingLabelText="Radio Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:5, name:'test 5'}, {id:6, name:'test 6'}]} />
                <SemiValidation.components.Radio multiple name="test5" value={[7]} floatingLabelText="Checkbox Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:7, name:'test 7'}, {id:8, name:'test 8'}]} />
                <SemiValidation.components.Checkbox name="test6" floatingLabelText="Checkbox Selection (Optional)" fullWidth={true} floatingLabelFixed={true} validations={['optional']} options={[{id:9, name:'test 9'}, {id:10, name:'test 10'}]} />
            </div>
        );

        return (
            <div>
                <PageHeading title="Request" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={9}>
                            <Panel title="SemiForm">
                                <div className="con-pad">
                                    <SemiForm formTemplate={formTemplate} onSubmit={this.onSemiformSubmit}/>
                                </div>
                            </Panel>
                            <Panel title="SemiValidation">
                                <div className="con-pad">
                                    <SemiValidation.components.Form ref="form" onSubmit={this.onSubmit}>
                                        {formItems2}
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

FormDemoPage.propTypes = {};
FormDemoPage.contextTypes = {
    dialog: PropTypes.object
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
)(FormDemoPage);