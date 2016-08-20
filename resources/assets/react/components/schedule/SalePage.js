import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import SchedulePage from './SchedulePage';
import { bindActionCreators } from 'redux';
import * as scheduleActions from '../../actions/scheduleActions';

class SalePage extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        let {...rest} = this.props;
        rest.hides = this.context.hides;
        rest.eventActions = [
            {id: 'cancel', name: 'Cancel'},
            {id: 'edit', name: 'Edit'}
        ];
        // rest.eventActions = [
        //     {id: 'cancel', name: 'Cancel'},
        //     {id: 'reject', name: 'Reject'},
        //     {id: 'accept', name: 'Accept'},
        //     {id: 'edit', name: 'Edit'}
        // ];
        console.log('rest', rest);
        return <SchedulePage {...rest} />;
    }
}

SalePage.contextTypes = {
    hides: PropTypes.object,
    eventColors: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SalePage);
