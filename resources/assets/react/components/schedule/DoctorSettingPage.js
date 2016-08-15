import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';

// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../actions/scheduleActions';

// Forms
import SemiSelect from './forms/SemiSelect';
import SemiDate from './forms/SemiDate';
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import Calendar from './widgets/Calendar';
import SemiModal from './widgets/SemiModal';
import ContextMenu from './widgets/ContextMenu';
import $ from 'jquery';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventModal: {customer:{}},
            doctor: 1 // doctor_id or false
        };

        // variables
        this.colors = {
            other: '#B1B1B1',
            self: '#7AE7BF'
        };
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
        this.loadSlotsWithEvents(this.state.doctor);
    }

    loadSlotsWithEvents = (doctor_id, date = new Date()) => {
        let timestamp = parseInt(date.getTime()/1000); // to unix timestamp
        this.context.ajax.call('get', `schedules/doctors/${doctor_id}/events/${timestamp}`, null).then( response => {
            this.manageCalendar( calendar => {
                let {slots,events} = response.data;
                this.doctors = this.props.schedule.data.doctors;
                this.user = this.props.user;
                let doctors = this.doctors;
                for(let i in slots) {
                    let slot = slots[i];
                    let doctor_id = slot.sc_doctor_id;
                    let cat_id = slot.sc_category_id;
                    slot.index = i; // array index
                    // if(slot.is_full) slot.rendering = 'background';
                    slot.rendering = 'background';
                    slot.color = doctors[doctor_id].categories[cat_id].color;
                }
                for(let i in events) {
                    let event = events[i];
                    event.self = (event.sale_id == this.user.id) || false;
                    event.color = event.self ? this.colors.self : this.colors.other;
                }
                calendar.setEventSource(slots);
                calendar.addEventSource(events);
            });
        }).catch( error => {} );
    };

    // avoid refs.calendar undefined
    manageCalendar = (callback) => {
        let me = this;
        if(me.refs.calendar && me.initialized()) {
            callback(me.refs.calendar);
        } else {
            let interval = setInterval(function(){
                if(me.refs.calendar && me.initialized()) {
                    clearInterval(interval);
                    callback(me.refs.calendar);
                }
            }, 500);
        }
    };

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };

    onContextMenuSelect = (key) => {
        console.log('key', key);
        if(key == 'edit') {
            let {id, category_id, customer, sub_category_id, start} = this.calEvent;
            this.setState({eventModal:{
                customer, sub_category_id, start: new Date(start), isEdit: true,
                subcats: this.doctors[this.state.doctor].categories[category_id].sub_categories} // set modal dropdown
            });
            this.refs.eventModal.open({category_id, id});
        } else if(key == 'delete') {
            this.context.dialog.confirm('Are you sure?', 'Delete', (confirm) => {
                if(confirm) {

                }
            });
        }
    };

    // --- Modal Functions

    onAddEventSubmit = (data, ajax) => {
        console.log('data from addCatId', data);
        // status and end are calculated at the server
        let req = {
            event: {
                start: data.date,
                sc_slot_id: data.id,
                sc_sub_category_id: data.sub_category_id,
                sale_id: this.props.user.id
            },
            customer: {
                first_name: data.first_name,
                last_name: data.last_name,
                hn: data.hn,
                phone: data.phone,
                contact: data.contact
            }
        };
        return ajax.call('post', `schedules/slots/${data.id}/add_event`, req).then( response => {
            console.log('response', response);
            this.refs.eventModal.close();
            this.loadSlotsWithEvents(this.state.doctor, data.date);
        });
    };

    // --- Full Calendar Functions

    eventClick = (calEvent, jsEvent) => {
        // console.log('calEvent.sale_id', calEvent, jsEvent);
        if(!calEvent.self) return;
        this.calEvent = calEvent; // pass value without using state
        this.refs.eventContextMenu.open(jsEvent.target);
    };

    dayClick = (date, jsEvent) => {
        console.log('date', this.toDate(date));
        if (jsEvent.target.classList.contains('fc-bgevent')) {
            let slot = $(jsEvent.target).data();
            let {id, sc_category_id} = slot;
            this.setState({eventModal:{
                customer:{}, start: this.toDate(date),
                subcats: this.doctors[this.state.doctor].categories[sc_category_id].sub_categories} // set modal dropdown
            });
            this.refs.eventModal.open({sc_category_id, id});
        }
    };

    eventRender = (event, element) => { // trick: passing event data to background event
        $(element).data(event);
    };

    // helper
    toDate = (date) => {
        return new Date(date.format('YYYY-MM-DD H:mm:ss'));
    };

    render() {
        // console.log('render: sc page', this.props.schedule);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        console.log('props.schedule.data', props.schedule.data);
        let data = props.schedule.data;
        let {doctors} = data;
        let state = this.state;
        
        let formTemplate = {
            settings: {},
            validations: {
                hn: {rule: '/^\d{6,7}$/', hint: 'Invalid HN'}
            },
            components: [
                [
                    {type: 'select', name: 'sub_category_id', label: 'Subcategory*', required: true},
                    {type: 'date', name: 'sub_category_id', label: 'Date', required: true, disabled: true}
                ],
                [
                    {type: 'text', name: 'first_name', label: 'First Name*', required: true},
                    {type: 'text', name: 'last_name', label: 'Last Name*', required: true, disabled: true}
                ],
                [
                    {type: 'hn', name: 'hn', label: 'Date', required: true, disabled: true, validations: ['hn'], hint:'optional. (eg. 5512345)'},
                    {type: 'text', name: 'phone', label: 'Phone**', required: true, hint:'phone or mobile number'}
                ],
                [
                    {type: 'text', name: 'contact', label: 'Phone*', required: true, hint:'Facebook, Line or other social media'}
                ]
            ]
        }
        ;

        let eventModal =(
            <SemiModal onSubmit={this.onAddEventSubmit} ref="eventModal" formTemplate={formTemplate}
            >
            <Row>
                <Col xs md={6}>
                    <SemiSelect data={state.eventModal.subcats} value={state.eventModal.sub_category_id} disabled={state.eventModal.isEdit} name="sub_category_id" required floatingLabelText="Subcategory*" fullWidth={true}/>
                </Col>
                <Col xs md={6}>
                    <SemiDate
                        name="date"
                        defaultDate={state.eventModal.start}
                        disabled
                        floatingLabelText="Date"
                        fullWidth={true}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs md={6}>
                    <SemiText
                        name="first_name"
                        value={state.eventModal.customer.first_name}
                        required
                        floatingLabelText="First Name*"
                        defaultValue="firstname"
                        fullWidth={true}
                    />
                </Col>
                <Col xs md={6}>
                    <SemiText
                        name="last_name"
                        value={state.eventModal.customer.last_name}
                        required
                        floatingLabelText="Last Name*"
                        defaultValue="lastname"
                        fullWidth={true}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs md={6}>
                    <SemiText
                        name="hn"
                        validations={{matchRegexp: /^\d{6,7}$/}}
                        validationError="invalid HN"
                        value={state.eventModal.customer.hn}
                        hintText="optional. (eg. 5512345)"
                        defaultValue="5500001"
                        floatingLabelText="HN"
                        fullWidth={true}
                    />
                </Col>
                <Col xs md={6}>
                    <SemiText
                        name="phone"
                        value={state.eventModal.customer.phone}
                        required
                        hintText="phone or mobile number"
                        defaultValue="test"
                        floatingLabelText="Phone*"
                        fullWidth={true}
                    />
                </Col>
            </Row>
            <SemiText
                name="contact"
                value={state.eventModal.customer.contact}
                required
                hintText="Facebook, Line or other social media"
                floatingLabelText="Contact*"
                defaultValue="test"
                fullWidth={true}
            />
        </SemiModal>);

        let eventPopover = (
            <ContextMenu ref="eventContextMenu" onSelect={this.onContextMenuSelect}
                data={[
                    {id:'delete', name:'Delete'},
                    {id:'edit', name:'Edit'}
                ]}
            >
            </ContextMenu>
        );
        return (
            <div>
                {eventModal}
                {eventPopover}
                <PageHeading title="Schedule" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <SemiForm submitLabel="GO" buttonRight compact>
                                        <SemiSelect
                                            data={data.doctors}
                                            name="category"
                                            floatingLabelText="Doctor"
                                            fullWidth={true}
                                        />
                                        <SemiDate
                                            name="date"
                                            required
                                            floatingLabelText="Date"
                                            fullWidth={true}
                                        />
                                    </SemiForm>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={9}>
                            <Panel title="Schedule">
                                <div className="con-pad">
                                    <Calendar droppable={false} editable={false} ref="calendar"
                                              eventClick={this.eventClick}
                                              eventRender={this.eventRender}
                                              dayClick={this.dayClick}
                                              selectable={false}
                                    />
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);