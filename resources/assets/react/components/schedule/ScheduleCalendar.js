import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
// import Paper from 'material-ui/Paper';
// import FlatButton from 'material-ui/FlatButton';


// Forms
import SemiSelect from '../forms/SemiSelect';
import SemiDate from '../forms/SemiDate';
import FormGenerator from '../forms/FormGenerator';
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import Calendar from '../widgets/Calendar';
import SemiModal from '../widgets/SemiModal';
import SemiButton from '../widgets/SemiButton';
import ContextMenu from '../widgets/ContextMenu';
import $ from 'jquery';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';

import helper from '../../libs/helper';

class ScheduleCalendar extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventModal: {
                data:{},
                customer:{}
            }
        };
        this.eventColors = context.eventColors;
        this.loaded = {};
        this.isOrganizer = props.params.role == 'organizer';
    }

    componentWillReceiveProps(nextProps) {
        this.isOrganizer = nextProps.params.role == 'organizer';
        let params = this.props.params;
        let nextParams = nextProps.params;
        if(helper.isParamChanged(params, nextProps.params)) {
            this.init().then(calendar => {
                calendar.gotoDate(nextParams.date);
            });
            if(params.doctor_id != nextParams.doctor_id || params.hides != nextParams.hides) this.refreshCalendar();
        }
    }
    
    componentWillMount() {
        console.log('*cal', this.context.hides);
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        this.init().then( calendar => {
            // Lookup for Brighter Background Colors
            let doctors = this.props.schedule.data.doctors;
            let colors = {};
            for(let doctor_id in doctors) {
                let doctor = doctors[doctor_id];
                for(let category_id in doctor.categories) {
                    let category = doctor.categories[category_id];
                    if(!colors[doctor_id]) colors[doctor_id] = {};
                    colors[doctor_id][category_id] = {
                        color: category.color,
                        bgColor: this.increaseBrightness(category.color, 50)
                    }
                }
            }
            this.colors = colors;
        });
    }

    // avoid refs.calendar && this.props.schedule.data undefined
    init = () => {
        return new Promise( resolve => {
            let me = this;
            if(me.refs.calendar && me.initialized()) {
                this.doctors = this.props.schedule.data.doctors;
                resolve(me.refs.calendar);
            } else {
                let interval = setInterval(function(){
                    if(me.refs.calendar && me.initialized()) {
                        clearInterval(interval);
                        resolve(me.refs.calendar);
                    }
                }, 500);
            }
        });
    };

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };
    
    refreshCalendar = () => {
        console.log('refresh');
        this.init().then(calendar=> { // refresh
            calendar.refresh(this.fetchEventSource);
        });
    };

    onContextMenuSelect = (key) => {
        // console.log('key', this.calEvent);
        let {event_id, category_id, customer, sub_category_id, start} = this.calEvent;
        if(key == 'edit') {
            let data = {
                sub_category_id: this.doctors[this.props.params.doctor_id].categories[category_id].sub_categories, isEdit: true
            };
            let values = {
                ...customer, sub_category_id, start: new Date(start), event_id
            };
            this.setState({eventModal:{data, values}});
            this.refs.eventModal.open();
        } else if(['cancel','reject','approve','pending'].indexOf(key)) {
            this.context.dialog.confirm('Are you sure?', `${key.capitalize()} Appointment`, (confirm) => {
                if(confirm) {
                    this.context.ajax.call('get', `schedules/events/${event_id}/${key}`, null).then( response => {
                        this.refreshCalendar();
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
                start: values.start,
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
        let method = this.state.eventModal.data.isEdit ? 'put' : 'post';
        let url = this.state.eventModal.data.isEdit ? `schedules/events/${values.event_id}` : `schedules/events`;
        return ajax.call(method, url, req).then( response => {
            console.log('response', response);
            this.refs.eventModal.close();
            this.refreshCalendar();
        });
    };

    // --- Full Calendar Functions

    eventClick = (calEvent, jsEvent) => {
        // console.log('calEvent.sale_id', calEvent, jsEvent);
        console.log('calEvent.status', calEvent.status);
        if(!calEvent.self && !this.isOrganizer) return;
        this.calEvent = calEvent; // pass value without using state

        // hide context menu items
        let hide = [];
        if(calEvent.status == 'approved') hide.push('approve');
        else if(calEvent.status == 'canceled') hide.push('cancel');
        else if(calEvent.status == 'pending') hide.push('pending');
        else if(calEvent.status == 'rejected') hide.push('reject');

        this.refs.eventContextMenu.open(jsEvent.target, {hide});
    };

    dayClick = (date, jsEvent) => {
        if (this.isOrganizer) return;
        if (jsEvent.target.classList.contains('fc-bgevent')) {
            let slot = $(jsEvent.target).data();
            let {id, sc_category_id} = slot;
            // console.log('this.doctors[this.props.params.doctor_id]', this.doctors);
            let data = {
                sub_category_id: this.doctors[this.props.params.doctor_id].categories[sc_category_id].sub_categories
            };
            let values = {
                customer: {}, start: helper.toDate(date)
            };
            // console.log('data', data, values);
            this.setState({eventModal:{data, values}});
            this.refs.eventModal.open({sc_category_id, id});
        }
    };

    onCalendarViewChange = (startDate) => {
        // do nothing now
    };

    eventRender = (event, element) => { // trick: passing event data to background event
        $(element).data(event);
    };

    increaseBrightness = (hex, percent) => {
        // strip the leading # if it's there
        hex = hex.replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if(hex.length == 3){
            hex = hex.replace(/(.)/g, '$1$1');
        }

        var r = parseInt(hex.substr(0, 2), 16),
            g = parseInt(hex.substr(2, 2), 16),
            b = parseInt(hex.substr(4, 2), 16);

        return '#' +
            ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
            ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
            ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
    };

    nextWeek = (isNext) => {
        let current = new Date(this.props.params.date);
        if(isNext) {
            let nextWeek = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
            this.context.navigate({date: nextWeek.getISODate()});
        } else {
            let prevWeek = new Date(current.getTime() - 7 * 24 * 60 * 60 * 1000);
            this.context.navigate({date: prevWeek.getISODate()});
        }
    };

    fetchEventSource = (start, end, timezone, callback) => {
        // fix: override FC's start/end
        let params = 'start='+start.unix()+'&end='+end.unix();
        let props = this.props;
        let me = this;
        // if(me.loading) return; // commented because if going too fast, will load wrong week
        me.loading = true;
        me.context.ajax.call('get', `schedules/doctors/${props.params.doctor_id}/events?${params}`).then( response => {
            // todo: retry and loading
            me.init().then( calendar => {
                let {slots,events} = response.data;
                me.user = me.props.user;
                for(let i in slots) {
                    let slot = slots[i];
                    let doctor_id = slot.sc_doctor_id;
                    let cat_id = slot.sc_category_id;
                    slot.index = i; // array index
                    // if(slot.is_full) slot.rendering = 'background';
                    slot.rendering = 'background';
                    slot.color = me.colors[doctor_id][cat_id].bgColor;
                }

                // filter events
                if(this.isOrganizer) {
                    events = events.filter(event=> {
                        // colors
                        if(this.context.hides[event.status]) return false;
                        event.color = me.eventColors[event.status];
                        return true;
                    });
                } else {
                    events = events.filter(event=> {
                        event.self = (event.sale_id == me.user.id) || false;
                        if(event.self) {
                            if(this.context.hides[event.status]) return false;
                        } else {
                            if(this.context.hides['other']) return false;
                        }
                        // colors
                        event.color = event.self ? me.eventColors[event.status] : me.eventColors.other;
                        return true;
                    });
                }

                callback(slots.concat(events));
                me.data = {slots, events};
                me.loading = false;
            });
        }).catch( error => {
            me.loading = false;
        });
    };

    render() {
        console.log('render: calendar', this.state);

        let props = this.props;
        let params = props.params;
        let data = props.schedule.data;
        let state = this.state;
        
        // Context Menu
        let eventActions = [
            {id: 'cancel', name: 'Cancel'},
            {id: 'reject', name: 'Reject'},
            {id: 'approve', name: 'Approve'},
            {id: 'edit', name: 'Edit'}
        ];
        if(!this.isOrganizer) eventActions.splice(1,2);
        
        // Create/Edit Form
        let formTemplate = {
            data: this.state.eventModal.data,
            values: this.state.eventModal.values,
            // values: {first_name: 'Semi', last_name: 'colon', hn: '55123456', phone: '0871234567', contact: 'kickass.to'}, // default values
            settings: {},
            // validators: {hn: {rule: '/^\d{6,7}$/', hint: 'Invalid HN'}},
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
                    {type: 'text', name: 'hn', label: 'HN', validations: ['hn'], hint:'optional. (eg. 5512345)'},
                    {type: 'text', name: 'phone', label: 'Phone*', required: true, hint:'phone or mobile number'}
                ],
                [
                    {type: 'text', name: 'contact', label: 'Contact*', required: true, hint:'Facebook, Line or other social media'}
                ]
            ]
        };

        let eventModal = (
            <SemiModal onSubmit={this.onAddEventSubmit} ref="eventModal" formTemplate={formTemplate} />
        );
        
        let eventPopover = (
            <ContextMenu ref="eventContextMenu" onSelect={this.onContextMenuSelect} data={eventActions} />
        );

        // init Calendar and Fetching

        let me = this;
        let calendarSettings = {
            header: false,
            droppable: false,
            editable: false,
            selectable: false,
            defaultDate: props.params.date, // gotoDate on first load
            eventClick: this.eventClick,
            eventRender: this.eventRender,
            dayClick: this.dayClick,
            onViewChange: this.onCalendarViewChange,
            events: this.fetchEventSource
        };

        return (
            <Panel title="Schedule">
                {eventModal}
                {eventPopover}
                <div className="semicon">
                    <div className="calendar-header">
                        <h2>{(new Date(this.props.params.date)).toDateString()}</h2>
                        <div className="button-group right" style={{zIndex: 999999}}>
                            <FloatingActionButton mini={true} className="button" onTouchTap={this.nextWeek.bind(this, false)}>
                                <HardwareKeyboardArrowLeft />
                            </FloatingActionButton>
                            <FloatingActionButton mini={true} className="button" onTouchTap={this.nextWeek.bind(this, true)}>
                                <HardwareKeyboardArrowRight />
                            </FloatingActionButton>
                        </div>
                    </div>
                    <div>
                        <Calendar {...calendarSettings} ref="calendar" />
                    </div>
                </div>
            </Panel>
        );
    }
}

ScheduleCalendar.propTypes = {};
ScheduleCalendar.contextTypes = {
    router: PropTypes.object,
    ajax: PropTypes.object,
    hides: PropTypes.object,
    eventColors: PropTypes.object,
    navigate: PropTypes.func,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
export default connect(mapStateToProps)(ScheduleCalendar);