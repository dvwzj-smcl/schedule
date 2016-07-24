/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';

import $ from 'jquery';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'fullcalendar';
import 'fullcalendar/dist/lang-all';
import moment from 'moment';

class Calendar extends Component {
    constructor(props, context) {
        super();
        this.state = {};
        this.addEventSource = this.addEventSource.bind(this);
    }

    addEventSource(slots) {
        $('#calendar').fullCalendar('addEventSource', slots);
    }
    
    componentDidMount() {
        let props = this.props;
        let settings = Object.assign({}, {
            lang: 'en',
            timezone: 'Asia/Bangkok',
            defaultView: 'agendaWeek',
            height: 'auto',
            minTime: '06:00',
            maxTime: '21:00',
            allDaySlot: false,
            slotDuration: '00:30:00',
            editable: true,
            selectable: true,
            droppable: true,
            unselectAuto: true,
            slotEventOverlap: false,
            forceEventDuration: true,
            events: [],
            defaultTimedEventDuration: '02:00:00'
        }, props);

        $('#calendar').fullCalendar(settings);
    }

    render() {
        console.log('render: calendar');
        let state = this.state;
        return (
            <div id="calendar"></div>
        );
    }
}

Calendar.propTypes = {
    // openAlertBox: PropTypes.bool.isRequired
};

Calendar.contextTypes = {
    // router: PropTypes.object.isRequired
};

export default Calendar;


