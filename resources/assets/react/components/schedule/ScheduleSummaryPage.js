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
                    if (params.hides != nextParams.hides) this.refreshCalendar();
                }
            });
        }
    };

    setValuesState = (params) => {
        let {date} = params;
        this.setState({
            values: {
                date: date ? new Date(date) : new Date()
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
        let date = data.date ? (typeof data.date === 'string') ? data.date : data.date.getISODate() : new Date();
        this.navigate({date})
    };

    navigate = (params) => {
        if(this.props.params.hides === undefined && params.hides === undefined) params.hides = ''; // fix hides undefined
        params = Object.assign({
            date: (new Date()).getISODate(), hides: ''
        }, this.props.params, params);
        this.context.router.push(`/schedules/summary/${params.date}/${params.hides}`);
    };

    // ----- Calendar Functions

    onDateChange = (date) => {
        this.navigate({date: date.getISODate()});
    };

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
        me.context.ajax.call('get', `schedules/events?${params}`).then( response => {
            me.init().then( () => {
                let {events} = response.data;
                let doctors = me.props.schedule.data.doctors;
                me.user = me.props.user;
                for(let i in events) {
                    let event = events[i];
                    let doctor_id = event.sc_doctor_id;
                    event.color = doctors[doctor_id].color;
                }
                callback(events);
                me.loading = false;
            });
        }).catch( error => {
            console.log('error: fetchEventSource', error);
            me.loading = false;
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

    render() {
        console.log('render: Summary', this.props.schedule);
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors, categories} = props.schedule.data;
        let {date} = props.params;

        // --- Forms

        let formTemplate = {
            values: this.state.values,
            components: [
                [{type: 'date', name: 'date', label: 'Date', required: true}]
            ]
        };

        // --- Colors

        if (props.schedule.data) {
            // todo
            // let {doctors} = props.schedule.data;
            // this.colorList = [];
            // for (let i in doctors) {
            //     let {color, user} = doctors[i];
            //     this.colorList.push(<Checkbox key={i} name={name} label={name} checked={true} iconStyle={{fill: color}} labelStyle={{color: color}}/>);
            // }
        }

        // --- Calendar

        let calendarSettings = {
            header: false,
            droppable: false,
            editable: false,
            selectable: false,
            slotDuration: '00:10:00',
            defaultDate: props.params.date, // gotoDate on first load
            onDateChange: this.onDateChange,
            events: this.fetchEventSource
        };

        return (
            <div>
                <ContextMenu ref="eventContextMenu" onSelect={this.onContextMenuSelect} data={eventActions} />
                <PageHeading title="Schedule" description={formTemplate.values.date.toString()} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div className="semicon">
                                    <SemiForm submitLabel="GO" buttonRight compact onSubmit={this.onSubmit} formTemplate={formTemplate} />
                                </div>
                            </Panel>
                            <Panel title="Show" type="secondary">
                                <div className="semicon">
                                    {this.colorList}
                                </div>
                            </Panel>
                        </Col>
                        <Col md={9}>
                            {!date ? null : (
                                <Panel title="Schedule">
                                    <div className="semicon">
                                        <Calendar {...calendarSettings} ref="calendar" date={this.props.params.date} />
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