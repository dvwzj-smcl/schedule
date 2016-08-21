import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ScheduleCalendar from './ScheduleCalendar';
import { bindActionCreators } from 'redux';
import * as scheduleActions from '../../actions/scheduleActions';

class SaleSchedule extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let {...rest} = this.props;
        let params = this.props.params;
        rest.hides = this.context.hides;
        rest.eventActions = [
            {id: 'cancel', name: 'Cancel'},
            {id: 'reject', name: 'Reject'},
            {id: 'accept', name: 'Accept'},
            {id: 'edit', name: 'Edit'}
        ];
        if(params.role == 'sale') {
            rest.eventActions.splice(1,2);
        }
        console.log('rest', rest);
        return <ScheduleCalendar {...rest} />;
    }
}

SaleSchedule.contextTypes = {
    hides: PropTypes.object,
    eventColors: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SaleSchedule);
