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
import SemiButton from '../widgets/SemiButton';
import ContextMenu from '../widgets/ContextMenu';
import $ from 'jquery';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            eventModal: {
                data:{},
                customer:{}
            }
        };
        // variables
        this.eventColors = {
            other: '#B1B1B1',
            self: '#7AE7BF'
        };
        this.loaded = {};
    }

    componentWillReceiveProps(nextProps) {
        let params = this.props.params;
        let nextParams = nextProps.params;
        if(params.date != nextParams.date || params.doctor_id != nextParams.doctor_id) {
            this.refreshCalendar(nextParams.doctor_id, nextParams.date);

            // todo: goto when click GO only
            this.init().then(calendar => {
                calendar.gotoDate(nextParams.date);
            });
            // this.loadSlotsWithEvents();
        }
        // this.setViewState(nextProps.params);
    }
    
    componentWillMount() {
        // this.setViewState(this.props.params);
    }

    // todo: remove this and above
    // setViewState = params => {
    //     this.setState({view: {
    //         doctor: params.doctor_id ? params.doctor_id : 1,
    //         date: params.date ? new Date(params.date) : new Date()
    //     }})
    // };

    componentDidUpdate() {
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
        this.init().then( calendar => {
            // Brighter Background Color
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
            this.refreshCalendar();
            this.loading = false;
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

    refreshCalendar = (doctor_id, date) => {

        if(!doctor_id) doctor_id = this.props.params.doctor_id;
        if(!date) date = this.props.params.date;

        // console.log('load****');

        // should we load data?
        if(this.loading) return;
        if(doctor_id == this.props.params.doctor_id) {
            if(this.data) {
                let slots = this.data.slots;
                let currentDate = new Date(date);
                currentDate.setHours(0,0,0,0);
                currentDate = currentDate.getTime();
                for(let i in slots) {
                    let slot = slots[i];
                    let slotDate = new Date(slot.start);
                    slotDate.setHours(0,0,0,0);
                    slotDate = slotDate.getTime();
                    if(slotDate == currentDate) {
                        console.log('*slot', new Date(slotDate), new Date(currentDate));
                        return;
                    }
                }
            }
        }

        // prepare and fetch data
        date = new Date(date);
        let dateParam = this.context.helper.toDateString(date);
        console.log('date', date);
        this.loading = true;
        this.context.ajax.call('get', `schedules/doctors/${doctor_id}/events/${dateParam}`, null).then( response => {
            this.init().then( calendar => {
                let {slots,events} = response.data;
                this.user = this.props.user;
                for(let i in slots) {
                    let slot = slots[i];
                    let doctor_id = slot.sc_doctor_id;
                    let cat_id = slot.sc_category_id;
                    slot.index = i; // array index
                    // if(slot.is_full) slot.rendering = 'background';
                    slot.rendering = 'background';
                    slot.color = this.colors[doctor_id][cat_id].bgColor;
                }
                for(let i in events) {
                    let event = events[i];
                    event.self = (event.sale_id == this.user.id) || false;
                    // todo: hide events
                    event.color = event.self ? this.eventColors.self : this.eventColors.other;
                }
                calendar.setEventSource(slots);
                calendar.addEventSource(events);

                this.data = {slots, events};
                this.loading = false;
            });
        }).catch( error => {} );
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
        } else if(key == 'cancel') {
            this.context.dialog.confirm('Are you sure?', 'Cancel Appointment', (confirm) => {
                if(confirm) {
                    this.context.ajax.call('get', `schedules/events/${event_id}/cancel`, null).then( response => {
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
        if(!calEvent.self) return;
        this.calEvent = calEvent; // pass value without using state
        this.refs.eventContextMenu.open(jsEvent.target);
    };

    dayClick = (date, jsEvent) => {
        console.log('date', this.context.helper.toDate(date));
        if (jsEvent.target.classList.contains('fc-bgevent')) {
            let slot = $(jsEvent.target).data();
            let {id, sc_category_id} = slot;
            console.log('this.doctors[this.props.params.doctor_id]', this.doctors);
            let data = {
                sub_category_id: this.doctors[this.props.params.doctor_id].categories[sc_category_id].sub_categories
            };
            let values = {
                customer: {}, start: this.context.helper.toDate(date)
            };
            this.setState({eventModal:{data, values}});
            this.refs.eventModal.open({sc_category_id, id});
        }
    };

    // todo: remove this
    onCalendarViewChange = (startDate) => {
        if(this.canChangeUrl) { // prevent change url on load
            // console.log('startDate', startDate);
            let date = this.context.helper.toDateString(startDate);
            this.context.router.push(`/schedules/${this.props.params.doctor_id}/${date}`);
        } else {
            this.canChangeUrl = true;
        }
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
        console.log('isNext', isNext);
        if(isNext) {
            let nextWeek = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
            nextWeek = this.context.helper.toDateString(nextWeek);
            this.context.router.push(`/schedules/${this.props.params.doctor_id}/${nextWeek}`);
        } else {
            let prevWeek = new Date(current.getTime() - 7 * 24 * 60 * 60 * 1000);
            prevWeek = this.context.helper.toDateString(prevWeek);
            this.context.router.push(`/schedules/${this.props.params.doctor_id}/${prevWeek}`);
        }
    };

    render() {
        // console.log('render: sc page', this.state);
        if(!this.initialized()) return <Loading />;

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
                    {type: 'text', name: 'hn', label: 'HN', validations: ['hn'], hint:'optional. (eg. 5512345)'},
                    {type: 'text', name: 'phone', label: 'Phone*', required: true, hint:'phone or mobile number'}
                ],
                [
                    {type: 'text', name: 'contact', label: 'Contact*', required: true, hint:'Facebook, Line or other social media'}
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

        return (
            <Panel title="Schedule">
                {eventModal}
                {eventPopover}
                <div className="semicon">
                    <div className="calendar-header">
                        <h2>{(new Date(this.props.params.date)).toString()}</h2>
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
                        <Calendar droppable={false} editable={false} ref="calendar"
                                  eventClick={this.eventClick}
                                  eventRender={this.eventRender}
                                  dayClick={this.dayClick}
                                  selectable={false}
                                  defaultDate={props.params.date} // gotoDate on first load
                                  onViewChange={this.onCalendarViewChange}
                                  header={false}
                        />
                    </div>
                </div>
            </Panel>
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