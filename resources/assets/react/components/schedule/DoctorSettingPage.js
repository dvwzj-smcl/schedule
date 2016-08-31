import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';
import {List, ListItem} from 'material-ui/List';
import {ContentCreate, ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import * as scheduleActions from '../../actions/scheduleActions';
import SemiForm from '../forms/SemiForm';
import SemiDataTable from '../widgets/SemiDataTable';

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

    saveColor = (data) => {
        console.log('save color', data);
        this.context.ajax.call('put', `schedules/doctors/${this.props.params.doctor_id}`, data).then(response => {
            this.context.dialog.alert('Data saved', 'Success', 'success');
            this.props.actions.init();
        }).catch(error => {
            this.context.dialog.alert(error, 'Error');
        });
    };

    saveSubcategory = (data) => {
        console.log('save', data);
        // todo: JSON
        this.context.ajax.call('put', `schedules/doctors/${this.props.params.doctor_id}`, {data}).then(response => {
            this.context.dialog.alert('Data saved', 'Success', 'success');
            this.props.actions.init();
        }).catch(error => {
            this.context.dialog.alert(error, 'Error');
        });
    };

    editSubcategory = (params) => {
        this.refs.subcategoryModal.open();
    };

    render() {
        // console.log('render: doctor setting page', this.state);
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
        if (doctor_id) {
            category_id = category_id ? parseInt(category_id) : 0;
            selectComponents.push([{type: 'select', name: 'category_id', label: 'Category*', onChange: this.onCategoryChange}]);
        }
        let selectForm = {
            data: {doctor_id: data.doctors, category_id: data.categories},
            values: {doctor_id, category_id},
            components: selectComponents
        };

        // --- Doctor Settings

        let doctorSettingForm = null;
        if (doctor_id) {
            let color = data.doctors[doctor_id].color;
            doctorSettingForm = {
                values: {color},
                components: [
                    [{type: 'color', name: 'color', label: 'Colors*', floatingLabelFixed: true, required: true}]
                ]
            };
        }
        
        // --- Subcategory Settings

        let components = [
            [{type: 'color', name: 'color', label: 'Colors*', floatingLabelFixed: true, required: true}],
            [{type: 'hidden', name: `category_id`}]
        ];

        let subcategoryForm = null;
        if(category_id) {
            let doctorSubcats = category_id ? data.doctors[doctor_id].categories[category_id].sub_categories : {},
                subcats = data.categories[category_id].sub_categories;

            let color = data.doctors[doctor_id].categories[category_id].color;
            let values = {color, category_id};
            for(let index in subcats){
                let i = subcats[index].id;
                let name, category_id, sub_category_id, duration, enable;
                if(doctorSubcats[i]) {
                    let item = doctorSubcats[i];
                    name = item.name;
                    duration = item.duration;
                    category_id = item.category_id;
                    sub_category_id = item.sub_category_id;
                    enable = item.enable;
                } else {
                    let item = subcats[index];
                    name = item.name;
                    duration = item.duration;
                    category_id = item.sc_category_id;
                    sub_category_id = item.id;
                    enable = false;
                }
                values[`enable-${sub_category_id}`] = enable;
                values[`duration-${sub_category_id}`] = duration;
                values[`category_id-${sub_category_id}`] = category_id;
                values[`sub_category_id-${sub_category_id}`] = sub_category_id;
                components.push([
                    {type: 'string', value: `${name}`, required: true},
                    {type: 'toggle', label: 'Enable', name: `enable-${sub_category_id}`, fullWidth: false},
                    {type: 'slider', label: 'Duration', name: `duration-${sub_category_id}`, showValue:true, step:10, min: 10, max: 180, required: true},
                    {type: 'hidden', name: `category_id-${sub_category_id}`},
                    {type: 'hidden', name: `sub_category_id-${sub_category_id}`}
                ]);
            }
            // for(let i in doctorSubcats) {
            //     let item = doctorSubcats[i];
            //     let {name, category_id, sub_category_id, duration, enable} = item;
            //     values[`enable-${sub_category_id}`] = enable;
            //     values[`duration-${sub_category_id}`] = duration;
            //     values[`category_id-${sub_category_id}`] = category_id;
            //     values[`sub_category_id-${sub_category_id}`] = sub_category_id;
            //     components.push([
            //         {type: 'string', value: `${name}`, required: true},
            //         {type: 'toggle', label: 'Enable', name: `enable-${sub_category_id}`, fullWidth: false},
            //         {type: 'slider', label: 'Duration', name: `duration-${sub_category_id}`, showValue:true, step:10, min: 10, max: 180, required: true},
            //         {type: 'hidden', name: `category_id-${sub_category_id}`},
            //         {type: 'hidden', name: `sub_category_id-${sub_category_id}`}
            //     ]);
            // }
            subcategoryForm = {
                values: values,
                components: components
            };
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
                <Col md={9}>
                {!doctor_id ? null : (
                    <Row>
                        <Col md={4}>
                            <Panel title="Doctor" type="secondary">
                                <div className="semicon">
                                    <SemiForm buttonRight formTemplate={doctorSettingForm} onSubmit={this.saveColor} submitLabel="Save"/>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={8}>
                            {!category_id ? null : (
                                <Panel title="Category" type="secondary">
                                    <div className="semicon">
                                        <SemiForm buttonRight formTemplate={subcategoryForm} onSubmit={this.saveSubcategory} submitLabel="Save"/>
                                    </div>
                                </Panel>
                            )}
                        </Col>
                    </Row>
                )}
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
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);