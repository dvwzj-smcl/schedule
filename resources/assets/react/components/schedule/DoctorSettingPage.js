import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';

// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiForm from '../forms/SemiForm';
import SemiDataTable from '../widgets/SemiDataTable';
import TextField from 'material-ui/TextField';

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
    onColorChange = (color) => {
        console.log(color);
    };
    onSubCategoryChange = (sub_categories) => {
        /*
        let categories = this.state.category.sub_categories;
        let sub_category = null;
        for(let i in categories){
            if(categories[i].id==id) sub_category = categories[i];
        }
        console.log('sub', sub_category);
        this.setState({sub_category});
        */
        console.log(sub_categories);
    };
    saveColor(data){
        console.log(data);
    }
    saveSubCategory(data){
        console.log(data);
    }

    render() {
        // console.log('render: sc page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        console.log(data);
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
            components: [
                [{type: 'select', name: 'category_id', label: 'Category*', onChange: this.onCategoryChange}]
            ]
        };
        let color = this.state.category ? this.state.category.color : null;
        let formTemplate3 = {
            values: {color},
            components: [
                [{type: 'color', name: 'color', hintText: 'Color*', onChange: this.onColorChange, floatingLabelText: "Color (Required)", floatingLabelFixed: true, validations:['required']}]
            ]
        };
        let dataSource = this.state.category ? this.state.category.sub_categories : [];
        console.log('dataSource', dataSource);
        return (
            <Row>
                <Col md={3}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={formTemplate} />
                        </div>
                    </Panel>
                    <Panel>
                        <div className="semicon" style={{display: doctor_id?'block':'none'}}>
                            <SemiForm noButton compact formTemplate={formTemplate2} />
                        </div>
                    </Panel>
                </Col>
                <Col md={3} style={{display: this.state.category?'block':'none'}}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm compact submitLabel="Save" formTemplate={formTemplate3} onSubmit={this.saveColor} />
                        </div>
                    </Panel>
                </Col>
                <Col md={6} style={{display: this.state.category?'block':'none'}}>
                    <Panel>
                        <div className="semicon">
                            <form>
                                <SemiDataTable
                                    settings={{
                                        table:{
                                            selectable: false,
                                            multiSelectable: false
                                        },
                                        header:{
                                            displaySelectAll: false,
                                            enableSelectAll: false,
                                            adjustForCheckbox: false
                                        },
                                        body:{
                                            displayRowCheckbox: false
                                        },
                                        fields:[
                                            {
                                                title: "Name",
                                                key: "name"
                                            },
                                            {
                                                title: "Duration",
                                                key: "duration",
                                                custom: (row, index, tbProps)=>{
                                                    return (
                                                        <TextField name="durations[]" value={row.duration} readonly underlineShow={false} />
                                                    );
                                                }
                                            }
                                        ],
                                        limit: false
                                    }}
                                    dataSource={dataSource} />
                            </form>
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