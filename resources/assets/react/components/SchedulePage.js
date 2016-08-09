import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import Loading from './widgets/Loading';

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
import $ from 'jquery';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventModal: {customer:{}},
            doctor: 1 // doctor_id or false
        };

        // variables
        this.initCalendar = false;
        this.colors = {
            other: '#B1B1B1',
            self: '#7AE7BF'
        };

        this.initialized = this.initialized.bind(this);
        this.loadSlots = this.loadSlots.bind(this);
        this.onSelectSubcategory = this.onSelectSubcategory.bind(this);
        this.onClose = this.onClose.bind(this);

        this.eventClick = this.eventClick.bind(this);
        this.dayClick = this.dayClick.bind(this);
    }

    loadSlots(doctor_id) {
        this.context.ajax.call('get', `schedules/doctors/${doctor_id}/events`, null).then( response => {
            let me = this;
            let {slots,events} = response.data;
            // avoid refs.calendar undefined
            var interval = setInterval(function(){
                if(me.refs.calendar && me.initialized()) {
                    clearInterval(interval);
                    me.doctors = me.props.schedule.data.doctors;
                    me.user = me.props.user;
                    let doctors = me.doctors;
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
                        event.self = (event.sale_id == me.user.id) || false;
                        event.color = event.self ? me.colors.self : me.colors.other;
                    }
                    me.refs.calendar.addEventSource(slots);
                    me.refs.calendar.addEventSource(events);
                }
            }, 500);
        }).catch( error => {} );
    }

    initialized() {
        return this.props.schedule && this.props.schedule.init;
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
        this.loadSlots(1);
    }

    // --- Modal Functions

    onSelectSubcategory(data, ajax) {
        console.log('data from addCatId', data);
        return ajax.call('post', `schedules/slots/${data.slot_id}/add_event`, data).then( response => {
            console.log('response', response);
            this.refs.eventModal.close();
        });
    }

    onClose() {
        // console.log('close addCatId');
    }

    // --- Calendar Functions

    eventClick(calEvent) { // for removing their own events only
        if(!calEvent.self) return;
        let {id, category_id, customer, sub_category_id, start} = calEvent;

        this.setState({eventModal:{
            customer, sub_category_id, start: new Date(start),
            subcats: this.doctors[this.state.doctor].categories[category_id].sub_categories} // set modal dropdown
        });
        this.refs.eventModal.open({category_id, id});
    }

    eventRender(event, element) { // trick: passing event data to background event
        $(element).data(event);
    }

    dayClick(date, jsEvent) {
        if (jsEvent.target.classList.contains('fc-bgevent')) {
            let slot = $(jsEvent.target).data();
            let {id, sc_category_id} = slot;
            this.setState({eventModal:{
                customer:{}, start: new Date(date),
                subcats: this.doctors[this.state.doctor].categories[sc_category_id].sub_categories} // set modal dropdown
            });
            this.refs.eventModal.open({sc_category_id, id});
        }
    }

    render() {
        // console.log('render: sc page', this.props.schedule);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        console.log('props.schedule.data', props.schedule.data);
        let data = props.schedule.data;
        let {doctors} = data;
        let state = this.state;

        let eventModal =(
            <SemiModal onSubmit={this.onSelectSubcategory} onClose={this.onClose} ref="eventModal">
            <Row>
                <Col xs md={6}>
                    <SemiSelect
                        data={state.eventModal.subcats}
                        value={state.eventModal.sub_category_id}
                        name="subcat"
                        required
                        floatingLabelText="Subcategory*"
                        fullWidth={true}
                    />
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
                        fullWidth={true}
                    />
                </Col>
                <Col xs md={6}>
                    <SemiText
                        name="last_name"
                        value={state.eventModal.customer.last_name}
                        required
                        floatingLabelText="Last Name*"
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
                fullWidth={true}
            />
        </SemiModal>);

        return (
            <div>
                { eventModal }
                <PageHeading title="Schedule" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <SemiForm submitLabel="GO" buttonRight compact>
                                        <SemiSelect
                                            data={data.categories}
                                            name="category"
                                            floatingLabelText="Category"
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
    ajax: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);