import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';

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

import ErrorMessage from './forms/ErrorMessage';

function pad(num, size){ return ('000000000' + num).substr(-size); }

class CalendarPage extends Component {
    constructor(props, context){
        super(props, context);
        this.events = [];
    }
    componentDidMount(){
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
            editable: true,
            slotEventOverlap: false,
            events: [
                {
                    start: '00:00',
                    end: '08:00',
                    color: 'gray',
                    rendering: 'background',
                    dow: [1,2,3,4,5]
                },
                {
                    start: '12:00',
                    end: '13:00',
                    color: 'gray',
                    rendering: 'background',
                    dow: [1,2,3,4,5]
                },
                {
                    start: '17:00',
                    end: '24:00',
                    color: 'gray',
                    rendering: 'background',
                    dow: [1,2,3,4,5]
                },
                {
                    start: '00:00',
                    end: '24:00',
                    color: 'gray',
                    rendering: 'background',
                    dow: [0,6]
                },
                {
                    start: '08:00',
                    end: '09:00',
                    color: 'green',
                    rendering: 'background',
                    dow: [1]
                },
                {
                    start: '2016-07-04 08:00',
                    end: '2016-07-04 09:00',
                    color: 'black',
                    title: 'test 1'
                },
                {
                    start: '2016-07-04 08:00',
                    end: '2016-07-04 09:00',
                    color: 'black',
                    title: 'test 2'
                }
            ]
        });
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
                            <Panel>
                                <List>
                                    <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
                                    <ListItem primaryText="Starred" leftIcon={<ActionGrade />} />
                                    <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
                                    <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
                                    <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
                                </List>
                                <Divider />
                                <List>
                                    <ListItem primaryText="All mail" rightIcon={<ActionInfo />} />
                                    <ListItem primaryText="Trash" rightIcon={<ActionInfo />} />
                                    <ListItem primaryText="Spam" rightIcon={<ActionInfo />} />
                                    <ListItem primaryText="Follow up" rightIcon={<ActionInfo />} />
                                </List>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}


export default connect((state)=>{
    return {}
},(dispatch)=>{
    return {}
})(CalendarPage);
