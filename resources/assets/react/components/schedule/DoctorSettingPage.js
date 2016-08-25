import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import {ContentCreate, ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import * as scheduleActions from '../../actions/scheduleActions';
import SemiForm from '../forms/SemiForm';
import SemiDataTable from '../widgets/SemiDataTable';
import SemiButton from '../widgets/SemiButton';
import SemiModal from '../widgets/SemiModal';
import TextField from 'material-ui/TextField';

import {HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            subcategory: {values: {}}
        }
    }

    componentWillMount() {
        this.props.actions.init(true);
    }

    initialized = () => {
        return this.props.actions.init(false);
    };

    navigate = (params) => {
        // not quite useful
        params = Object.assign({
            doctor_id: '1'
        }, this.props.params, params);
        this.context.router.push(`/settings/doctors/${params.doctor_id}${params.category_id ? '/'+params.category_id : ''}`);
    };

    // ----- On Changes

    onDoctorChange = (doctor_id) => {
        this.navigate({doctor_id});
    };
    
    onCategoryChange = (category_id) => {
        this.navigate({category_id});
    };

    saveColor(data){
        console.log(data);
    }

    saveSubcategory(data){
        console.log('save', data);
    }

    editSubcategory = (params) => {
        this.refs.subcategoryModal.open();
    };

    render() {
        console.log('render: doctor setting page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let {doctor_id, category_id} = props.params;

        // --- Select

        doctor_id = doctor_id ? parseInt(doctor_id) : 0;
        let selectComponents = [
            [{type: 'select', name: 'doctor_id', label: 'Doctor*', onChange: this.onDoctorChange}]
        ];
        if(doctor_id) {
            category_id = category_id ? parseInt(category_id) : 0;
            selectComponents.push([{type: 'select', name: 'category_id', label: 'Category*', onChange: this.onCategoryChange}]);
        }
        let selectForm = {
            data: {doctor_id: data.doctors, category_id: data.categories},
            values: {doctor_id, category_id},
            components: selectComponents
        };

        // --- Category Settings

        let categorySettingForm = null;
        if(category_id) {
            let color = data.categories[category_id].color;
            categorySettingForm = {
                values: {color},
                components: [
                    [{type: 'color', name: 'color', label: 'Colors*', hintText: 'Color*', floatingLabelText: 'Color (Required)', floatingLabelFixed: true, validations:['required']}]
                ]
            };
        }

        let subcategoriesObj =  category_id ? data.doctors[doctor_id].categories[category_id].sub_categories : {};
        let dataSource = [];
        for(let i in subcategoriesObj) {
            let item = subcategoriesObj[i];
            dataSource.push(item);
        }

        // --- Modal
        let subcategoryModal = null;
        if(category_id) {
            let formTemplate = {
                data: {},
                values: this.state.subcategory.values,
                settings: {},
                components: [
                    [
                        {type: 'text', name: 'Enabled', label: 'First Name*', required: true}, // todo toggle
                        {type: 'text', name: 'duration', label: 'Last Name*', required: true} // todo: integer only input
                    ]
                ]
            };
            subcategoryModal = (
                <SemiModal onSubmit={this.saveSubcategory} ref="subcategoryModal" formTemplate={formTemplate} />
            );
        }

        return (
            <Row>
                <Col md={3}>
                    <Panel title="Select" type="secondary">
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={selectForm} />
                        </div>
                    </Panel>
                </Col>
                {!category_id ? null : (
                    <Col md={9}>
                        {subcategoryModal}
                        <Row>
                            <Col md={4}>
                                <Panel title="Info" type="secondary">
                                    <div className="semicon">
                                        <SemiForm buttonRight formTemplate={categorySettingForm} onSubmit={this.saveColor} submitLabel="Save"/>
                                    </div>
                                </Panel>
                            </Col>
                            <Col md={8}>
                                <Panel title="Subcategories" type="secondary">
                                    <div className="semicon">
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
                                                        title: "Enabled",
                                                        key: "enable"
                                                    },
                                                    {
                                                        title: "Duration",
                                                        key: "duration",
                                                        custom: (row, index, tbProps)=>{
                                                            return (
                                                                <TextField name="durations[]" value={row.duration} readonly underlineShow={false} />
                                                            );
                                                        }
                                                    },
                                                    {
                                                        title: "Actions",
                                                        key: 'action',
                                                        custom: (row,index,tbDataProps)=>{
                                                        // console.log('row,index,tbDataProps',row,index,tbDataProps);
                                                            return (
                                                                <div>
                                                                    <IconButton onClick={this.editSubcategory.bind(this, row)} >
                                                                        <ContentCreate />
                                                                    </IconButton>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                ],
                                                limit: false
                                            }}
                                        dataSource={dataSource} />
                                    </div>
                                </Panel>
                            </Col>
                        </Row>
                    </Col>
                )}
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