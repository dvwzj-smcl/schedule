import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';

// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiForm from '../forms/SemiForm';

import {HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            category: null,
            sub_category: null,
            color: null
        };
    }

    componentWillMount() {
        this.props.actions.init(true);
    }

    initialized = () => {
        return this.props.actions.init(false);
    };
    
    onDoctorChange = (id) => {
        this.context.navigate({id});
    };
    onCategoryChange = (id) => {
        let categories = this.props.schedule.data.categories;
        let category = null;
        for(let i in categories){
            if(categories[i].id==id) category = categories[i];
        }
        this.setState({category});
    };
    onSubCategoryChange = (id) => {
        let categories = this.state.category.sub_categories;
        let sub_category = null;
        for(let i in categories){
            if(categories[i].id==id) sub_category = categories[i];
        }
        console.log('sub', sub_category);
        this.setState({sub_category});
    };
    onColorChange = (color) => {
        console.log(color);
    };

    render() {
        // console.log('render: sc page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let doctor_id = props.params.id ? parseInt(props.params.id) : 0;
        console.log('doctor_id', doctor_id);
        let formTemplate = {
            data: {doctor_id: data.doctors},
            values: {doctor_id},
            components: [
                [{type: 'select', name: 'doctor_id', label: 'Doctor*', onChange: this.onDoctorChange}]
            ]
        };
        let formTemplate2 = {
            data: {category_id: data.categories},
            values: {},
            components: [
                [{type: 'select', name: 'category_id', label: 'Category*', onChange: this.onCategoryChange}]
            ]
        };
        let formTemplate3 = {
            data: {sub_category_id: this.state.category ? this.state.category.sub_categories : []},
            values: {},
            components: [
                [{type: 'select', name: 'sub_category_id', label: 'Sub Category*', onChange: this.onSubCategoryChange}]
            ]
        };
        let formTemplate4 = {
            components: [
                [{type: 'color', name: 'color', hintText: 'Color*', onChange: this.onColorChange, floatingLabelText: "Color (Required)", floatingLabelFixed: true, validations:['required']}]
            ]
        };
        return (
            <Row>
                <Col md={3}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={formTemplate} />
                        </div>
                    </Panel>
                </Col>
                <Col md={3} style={{display: doctor_id?'block':'none'}}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={formTemplate2} />
                        </div>
                    </Panel>
                </Col>
                <Col md={3} style={{display: this.state.category?'block':'none'}}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={formTemplate3} />
                        </div>
                    </Panel>
                </Col>
                <Col md={3} style={{display: this.state.sub_category?'block':'none'}}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm compact formTemplate={formTemplate4} />
                        </div>
                    </Panel>
                </Col>
            </Row>
        );
    }
}

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    navigate: PropTypes.func,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);