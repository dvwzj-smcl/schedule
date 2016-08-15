import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';

// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiSelect from '../forms/SemiSelect';
import SemiDate from '../forms/SemiDate';
import FormGenerator from '../forms/FormGenerator';
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import Calendar from '../widgets/Calendar';
import SemiModal from '../widgets/SemiModal';
import ContextMenu from '../widgets/ContextMenu';
import $ from 'jquery';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        let params = this.props.params;
        this.state = {
            eventModal: {
                data: {},
                customer:{}
            },
            view: {
                doctor: params.doctor_id ? params.doctor_id : 1,
                date: params.date ? new Date(params.date) : new Date()
            }
        };
        console.log('this.state.view.date', this.state.view.date);
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
        this.loadSlotsWithEvents(this.state.view.doctor, this.state.view.date);
    }

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };

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
                    // todo: hide events
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

    onContextMenuSelect = (key) => {
        // console.log('key', this.calEvent);
        let {event_id, category_id, customer, sub_category_id, start} = this.calEvent;
        if(key == 'edit') {
            let data = {
                sub_category_id: this.doctors[this.state.view.doctor].categories[category_id].sub_categories, isEdit: true
            };
            let values = {
                ...customer, sub_category_id, start: new Date(start), event_id
            };
            this.setState({eventModal:{data, values}});
            this.refs.eventModal.open();
        } else if(key == 'cancel') {
            this.context.dialog.confirm('Are you sure?', 'Cancel Appointment', (confirm) => {
                if(confirm) {
                    this.context.ajax.call('get', `schedules/events/${event_id}/cancel`, null).then( response => {
                        this.loadSlotsWithEvents(this.state.view.doctor, this.refs.calendar.getViewStart());
                    }).catch( error => {
                        this.context.dialog.alert(error, 'Error');
                    });
                }
            });
        }
    };

    // --- Modal Functions

    onAddEventSubmit = (data, ajax) => {
        // console.log('data from addCatId', data);
        // 'status' and 'end' are calculated at the server
        let values = this.state.eventModal.values;
        let req = {
            slot_id: data.id,
            event: {
                id: values.event_id,
                start: data.start,
                sc_slot_id: data.id,
                sc_sub_category_id: data.sub_category_id,
                sale_id: this.props.user.id
            },
            customer: {
                id: values.id, // because spread
                first_name: data.first_name,
                last_name: data.last_name,
                hn: data.hn,
                phone: data.phone,
                contact: data.contact
            }
        };
        console.log('req', req);
        let method = this.state.eventModal.data.isEdit ? 'put' : 'post';
        let url = this.state.eventModal.data.isEdit ? `schedules/events/${values.event_id}` : `schedules/events`;
        return ajax.call(method, url, req).then( response => {
            console.log('response', response);
            this.refs.eventModal.close();
            this.loadSlotsWithEvents(this.state.view.doctor, data.date);
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
            let data = {
                sub_category_id: this.doctors[this.state.view.doctor].categories[sc_category_id].sub_categories
            };
            let values = {
                customer: {}, start: this.toDate(date)
            };
            this.setState({eventModal:{data, values}});
            this.refs.eventModal.open({sc_category_id, id});
        }
    };

    eventRender = (event, element) => { // trick: passing event data to background event
        $(element).data(event);
    };

    // from Moment to Date
    toDate = (moment) => {
        return new Date(moment.format('YYYY-MM-DD H:mm:ss'));
    };

    render() {
        if(!this.initialized()) return <Loading />;
        console.log('render: sc page');

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let formTemplate = {
            data: this.state.eventModal.data,
            values: this.state.eventModal.values,
            settings: {},
            validations: {
                hn: {rule: '/^\d{6,7}$/', hint: 'Invalid HN'}
            },
            components: [
                [
                    {type: 'select', name: 'sub_category_id', label: 'Subcategory*', required: true, disabled: state.eventModal.data.isEdit},
                    {type: 'date', name: 'start', label: 'Date', required: true, disabled: true}
                ],
                [
                    {type: 'text', name: 'first_name', label: 'First Name*', required: true},
                    {type: 'text', name: 'last_name', label: 'Last Name*', required: true}
                ],
                [
                    {type: 'text', name: 'hn', label: 'HN', required: true, validations: ['hn'], hint:'optional. (eg. 5512345)'},
                    {type: 'text', name: 'phone', label: 'Phone**', required: true, hint:'phone or mobile number'}
                ],
                [
                    {type: 'text', name: 'contact', label: 'Phone*', required: true, hint:'Facebook, Line or other social media'}
                ]
                // [
                //     {defaultValue: 'ftest', type: 'text', name: 'first_name', label: 'First Name*', required: true},
                //     {defaultValue: 'ltest', type: 'text', name: 'last_name', label: 'Last Name*', required: true}
                // ],
                // [
                //     {defaultValue: '5500123', type: 'text', name: 'hn', label: 'HN', required: true, validations: ['hn'], hint:'optional. (eg. 5512345)'},
                //     {defaultValue: '0871234567', type: 'text', name: 'phone', label: 'Phone**', required: true, hint:'phone or mobile number'}
                // ],
                // [
                //     {defaultValue: 'test contact', type: 'text', name: 'contact', label: 'Phone*', required: true, hint:'Facebook, Line or other social media'}
                // ]
            ]
        };

        let eventModal = (
            <SemiModal onSubmit={this.onAddEventSubmit} ref="eventModal">
                <FormGenerator formTemplate={formTemplate} />
            </SemiModal>
        );

        let eventPopover = (
            <ContextMenu ref="eventContextMenu" onSelect={this.onContextMenuSelect}
                data={[
                    {id:'cancel', name:'Cancel'},
                    {id:'edit', name:'Edit'}
                ]}
            >
            </ContextMenu>
        );
        return (
            <Panel title="Schedule">
                {eventModal}
                {eventPopover}
                <div className="con-pad">
                    <Calendar droppable={false} editable={false} ref="calendar"
                              eventClick={this.eventClick}
                              eventRender={this.eventRender}
                              dayClick={this.dayClick}
                              selectable={false}
                    />
                </div>
            </Panel>
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