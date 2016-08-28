import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';
import Calendar from '../widgets/Calendar';
import {List, ListItem} from 'material-ui/List';
import * as scheduleActions from '../../actions/scheduleActions';
import helper from '../../libs/helper';
import SemiForm from '../forms/SemiForm';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ScheduleFilter from './ScheduleFilter';
import ScheduleEventList from './ScheduleEventList';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import {ActionPermIdentity, ActionInfo, HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';
import ContextMenu from '../widgets/ContextMenu';

// Context Menu
const eventActions = [
    {id: 'delete', name: 'Delete'}
];

class SlotPage extends Component {
    constructor(props, context) {
        super(props, context);
        // variables
        this.eventColors = {
            other: '#B1B1B1',
            approved: '#00AAA0',
            rejected: '#C22326',
            canceled: '#FDB632',
            pending: '#A8216B'
        };
        this.hides = {}
    }

    componentWillReceiveProps(nextProps) {
        this.refreshPage(nextProps);
    }

    componentWillMount() {
        let props = this.props;
        props.actions.init(true);
        this.setValuesState(props.params);
        this.refreshPage();
    }

    componentDidMount() {
    }

    getChildContext() {
        return {
            eventColors: this.eventColors,
            hides: this.hides,
            navigate: this.navigate,
            initialized: this.initialized
        };
    }

    refreshPage = nextProps => {
        let props = nextProps ? nextProps : this.props;
        let params = props.params;
        let paramChanged = nextProps && helper.isParamChanged(this.props.params, nextProps.params);
        this.setValuesState(props.params);
        if(!nextProps || paramChanged) {
            this.init().then(() => {
                // --- Calendar
                if(nextProps) {
                    this.init().then(calendar => {
                        calendar.gotoDate(nextProps.params.date);
                    });
                    if (params.doctor_id != nextProps.params.doctor_id) this.refreshCalendar();
                }
            });
        }
    };

    setValuesState = (params) => {
        let {doctor_id, date} = params;
        this.setState({
            values: {
                doctor_id: doctor_id ? parseInt(doctor_id) : 1,
                date: date ? new Date(date) : new Date()
                // date2: date ? new Date(date).toString() : new Date().toString(),
            }
        });
    };

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
        return this.props.actions.init(false);
    };

    onSubmit = (data) => {
        console.log('data', data);
        let date = data.date ? (typeof data.date === 'string') ? data.date : data.date.getISODate() : new Date();
        this.navigate({date, doctor_id: data.doctor_id})
    };

    navigate = (params) => {
        params = Object.assign({
            doctor_id: 1, date: (new Date()).getISODate()
        }, this.props.params, params);
        this.context.router.push(`/slots/${params.doctor_id}/${params.date}`);
    };

    // ----- Calendar Functions

    refreshCalendar = () => {
        console.log('refresh');
        this.init().then(calendar=> { // refresh
            calendar.refresh(this.fetchEventSource);
        });
    };

    undoCalendar = (calEvent) => {
        this.init().then(calendar=> { // refresh
            calendar.updateEvent(calEvent);
        });
    };

    fetchEventSource = (start, end, timezone, callback) => {
        // fix: override FC's start/end
        let params = 'start='+start.unix()+'&end='+end.unix();
        let props = this.props;
        let me = this;
        me.loading = true;
        me.context.ajax.call('get', `schedules/doctors/${props.params.doctor_id}/events?${params}`).then( response => {
            me.init().then( () => {
                let {slots} = response.data;
                let doctors = me.props.schedule.data.doctors;
                console.log('slot', slots);
                me.user = me.props.user;
                for(let i in slots) {
                    let slot = slots[i];
                    let doctor_id = slot.sc_doctor_id;
                    let cat_id = slot.sc_category_id;
                    slot.index = i; // array index
                    slot.color = doctors[doctor_id].categories[cat_id].color;
                }
                callback(slots);
                me.loading = false;
            });
        }).catch( error => {
            console.log('error: fetchEventSource', error);
            me.loading = false;
        });
    };

    nextWeek = (isNext) => {
        let current = new Date(this.props.params.date);
        if(isNext) {
            let nextWeek = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
            this.navigate({date: nextWeek.getISODate()});
        } else {
            let prevWeek = new Date(current.getTime() - 7 * 24 * 60 * 60 * 1000);
            this.navigate({date: prevWeek.getISODate()});
        }
    };

    eventResize = (calEvent) => {
        this.updateEvent(calEvent);
    };
    eventDrop = (calEvent) => {
        this.updateEvent(calEvent);
    };
    eventClick = (calEvent, jsEvent) => {
        this.refs.eventContextMenu.open(jsEvent.target, calEvent);
    };
    select = (a, b, jsEvent, view, anchor) => {
        console.log('****', jsEvent.pageY);
        let start = a.format('YYYY-MM-DD H:mm:ss');
        let end = b.format('YYYY-MM-DD H:mm:ss');
        this.refs.categoryContextMenu.open(anchor, {start, end});
    };
    updateEvent = (calEvent) => {
        this.context.dialog.confirm('Are you sure you want to apply this change?', null, (confirm)=>{
            if(confirm) {
                let {start, end, sc_doctor_id, sc_organizer_id, sc_category_id, id} = calEvent;
                let data = {start: start.format('YYYY-MM-DD H:mm:ss'), end: end.format('YYYY-MM-DD H:mm:ss'), sc_doctor_id, sc_organizer_id, sc_category_id};
                this.context.ajax.call('put', `schedules/slots/${id}`, data).then( response => {
                    this.refreshCalendar();
                }).catch( error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }else{
                this.undoCalendar(calEvent);
            }
        });
    };

    onContextMenuSelect = (key, data) => {
        console.log('key, data', key, data);
        if(key === 'delete') {
            this.context.dialog.confirm('Are you sure you want to delete?', null, (confirm)=>{
                console.log(confirm);
                if(confirm) {
                    console.log('confirm');
                    this.context.ajax.call('delete', `schedules/slots/${data.id}`, null).then( response => {
                        this.refreshCalendar();
                    }).catch( error => {
                        this.context.dialog.alert(error, 'Error');
                    });
                }else{
                    console.log('cancel');
                }
            });
        }
    };

    onSelectCategory = (category_id, data) => {
        let req = {doctor_id:this.props.params.doctor_id, category_id, start: data.start, end: data.end}
        this.context.ajax.call('post', `schedules/slots`, req).then( response => {
            this.refreshCalendar();
        }).catch( error => {
            this.context.dialog.alert(error, 'Error');
        });
    };

    render() {
        console.log('render: ScPage(parent)', this.props.schedule);
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors, categories} = props.schedule.data;
        let {doctor_id, date} = props.params;

        // --- Forms

        let formTemplate = {
            data: {doctor_id: doctors},
            values: this.state.values,
            components: [
                [{type: 'select', name: 'doctor_id', label: 'Doctor*', required: true}],
                [{type: 'date', name: 'date', label: 'Date', required: true}]
            ]
        };

        // --- Colors

        if (props.schedule.data) {
            let {doctors, categories} = props.schedule.data;
            this.colorList = [];
            if (doctor_id) {
                for (let i in doctors[doctor_id].categories) {
                    let {color, name}= categories[i];
                    this.colorList.push(<Checkbox key={i} name={name} label={name} checked={true} iconStyle={{fill: color}} labelStyle={{color: color}}/>);
                }
            }
        }

        // --- Calendar

        let calendarSettings = {
            header: false,
            droppable: true,
            editable: true,
            selectable: true,
            slotDuration: '00:30:00',
            defaultDate: props.params.date, // gotoDate on first load
            eventClick: this.eventClick,
            eventResize: this.eventResize,
            eventDrop: this.eventDrop,
            select: this.select,
            events: this.fetchEventSource
        };

        return (
            <div>
                <ContextMenu ref="eventContextMenu" onSelect={this.onContextMenuSelect} data={eventActions} />
                <ContextMenu ref="categoryContextMenu" onSelect={this.onSelectCategory} data={categories} />
                <PageHeading title="Schedule" description={formTemplate.values.date.toString()} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div className="semicon">
                                    <SemiForm submitLabel="GO" buttonRight compact onSubmit={this.onSubmit} formTemplate={formTemplate} />
                                </div>
                            </Panel>
                            {!doctor_id ? null : (
                                <Panel title="Show" type="secondary">
                                    <div className="semicon">
                                        {this.colorList}
                                    </div>
                                </Panel>
                            )}
                        </Col>
                        <Col md={9}>
                            {!doctor_id ? null : (
                                <Panel title="Schedule">
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
                            )}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SlotPage.propTypes = {};
SlotPage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};
SlotPage.childContextTypes = {
    eventColors: PropTypes.object,
    hides: PropTypes.object,
    navigate: PropTypes.func,
    initialized: PropTypes.func
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SlotPage);