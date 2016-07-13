import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import { getEvents, getDoctors, getCategories } from '../actions/calendarActions';
import { isAdmin, isDoctor, isOrganizer, isSale } from '../actions/userActions';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';

import $ from 'jquery';
import moment from 'moment';
import 'fullcalendar';
import 'fullcalendar/dist/lang-all';

// Forms
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import ErrorMessage from './forms/ErrorMessage';

function pad(num, size){ return ('000000000' + num).substr(-size); }

class CalendarPage extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            doctor_id: null,
            category_id: null
        };
        this.selectDoctor = this.selectDoctor.bind(this);
        this.selectCategory = this.selectCategory.bind(this);
    }
    selectDoctor(event, index, doctor_id){
        this.setState({
            doctor_id
        });
    }
    selectCategory(event, index, category_id){
        this.setState({
            category_id
        });
    }

    componentDidMount(){
        var promises = [];
        promises.push(this.props.actions.calendar.getEvents());
        if(this.props.user.isOrganizer){
            promises.push(this.props.actions.calendar.getDoctors());
            promises.push(this.props.actions.calendar.getCategories());
        }
        Promise.all(promises).then(()=>{
            let events = [];
            if(this.props.user.isOrganizer){
                events = this.props.calendar.slots.map((slot)=>{
                    return {
                        title: slot.doctor.name,
                        start: slot.start,
                        end: slot.end
                    };
                });
            }
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month, agendaWeek, agendaDay'
                },
                lang: 'en',
                timezone: 'Asia/Bangkok',
                height: 'auto',
                minTime: '08:00',
                maxTime: '17:00',
                allDaySlot: false,
                slotDuration: '00:30:00',
                editable: false,
                slotEventOverlap: false,
                events: events,
                viewRender: (view, element)=>{
                    const {between} = this.props.calendar;
                    const {getEvents} = this.props.actions.calendar;
                    const start = view.intervalStart.format('YYYY-MM-DD');
                    const end = moment(view.intervalStart).endOf('month').format('YYYY-MM-DD');
                    if(start!==between[0] && end!==between[1]){
                        const year = view.intervalStart.format('YYYY');
                        const month = view.intervalStart.format('MM');
                        getEvents(year, month);
                    }
                }
            });
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        const shouldUpdate = (nextProps.calendar.events!=this.props.calendar.events || nextProps.calendar.doctors!=this.props.calendar.doctors || nextProps.calendar.categories!=this.props.calendar.categories || this.state!=nextState);
        return shouldUpdate;
    }
    componentDidUpdate(){
        let events = [];
        if(this.props.user.isOrganizer){
            events = this.props.calendar.slots.map((slot)=>{
                return {
                    title: slot.doctor.name,
                    start: slot.start,
                    end: slot.end
                };
            });
        }
        console.log('componentDidUpdate', events);
    }

    render(){
        return (
            <div>
                <PageHeading title="Calendar" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={9}>
                            <Panel title="Home">
                                <div className="con-pad">
                                    <div id="calendar"></div>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={3}>
                            {this.props.user.isAdmin ?
                                (
                                    <Panel>
                                        <List>
                                            <ListItem primaryText="Admin" leftIcon={<ContentInbox />} />
                                        </List>
                                    </Panel>
                                ) : null}
                            {this.props.user.isDoctor ?
                                (
                                    <Panel>
                                        <List>
                                            <ListItem primaryText="Doctor" leftIcon={<ContentInbox />} />
                                        </List>
                                    </Panel>
                                ) : null}
                            {this.props.user.isOrganizer ?
                                (
                                    <Panel>
                                        <List>
                                            <ListItem primaryText="Organizer" leftIcon={<ContentInbox />} />
                                        </List>
                                        <SelectField fullWidth={false} floatingLabelText="Doctors" value={this.state.doctor_id} onChange={this.selectDoctor}>
                                            {this.props.calendar.doctors.map((doctor, i)=>{
                                                return(
                                                    <MenuItem key={i} value={doctor.id} primaryText={doctor.user.name} />
                                                );
                                            })}
                                        </SelectField>
                                        <SelectField fullWidth={false} floatingLabelText="Categories" value={this.state.category_id} onChange={this.selectCategory}>
                                            {this.props.calendar.categories.map((category, i)=>{
                                                return(
                                                    <MenuItem key={i} value={category.id} primaryText={category.name} />
                                                );
                                            })}
                                        </SelectField>
                                    </Panel>
                                ) : null}
                            {this.props.user.isSale ?
                                (
                                    <Panel>
                                        <List>
                                            <ListItem primaryText="Sale" leftIcon={<ContentInbox />} />
                                        </List>
                                    </Panel>
                                ) : null}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default connect((state)=>{
    return {
        user: state.user,
        calendar: state.calendar
    }
},(dispatch)=>{
    return {
        actions: {
            calendar: {
                getEvents: bindActionCreators(getEvents, dispatch),
                getDoctors: bindActionCreators(getDoctors, dispatch),
                getCategories: bindActionCreators(getCategories, dispatch)
            }
        }
    }
})(CalendarPage);
