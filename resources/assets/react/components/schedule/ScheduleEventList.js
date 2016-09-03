import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ActionPermIdentity, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Panel from '../widgets/Panel';


class ScheduleEventList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            list: [],
            initialized: false
        };
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillMount() {
        this.props.actions.getPendingEvents(true);
    }

    initialized = () => {
        return this.props.actions.getPendingEvents(false);
    };

    init = () => {
        // let props = this.props;
        // this.loading = true;
        // this.props.actions.getPendingEvents();
        // this.context.ajax.call('get', `schedules/organizer/${props.user.id}/events`).then( response => {
        //     console.log('response', response);
        //     let list = response.data.list;
        //     this.setState({initialized: true, list});
        // }).catch( error => {
        //     this.context.dialog.alert(error, 'Error loading organizer\'s events');
        //     this.loading = false;
        // });
    };

    goTo = (date, doctor_id) => {
        this.context.navigate({date, doctor_id});
    };

    render() {
        if (!this.initialized()) return <Loading />;
        let list = [];
        console.log('this.props.schedule.pendingEvents', this.props.schedule.pendingEvents);
        let pendingEvents = this.props.schedule.pendingEvents.data.list;
        for(let [id, doctor] of pendingEvents.entries()) {
            let items = [];
            let pendingCount = 0;
            for(let week_id in doctor.pending.items) {
                let count = doctor.pending.items[week_id];
                let date = new Date(week_id * 1000); // start of week
                let date2 = new Date((week_id * 1000) + (7 * 24 * 60 * 60 *1000)); // end of week
                let dateStr = (date).toDateString();
                let weekStr = `${date.getDate()} ${date.getShortMonthName()} - ${date2.getDate()} ${date2.getShortMonthName()} ${date.getFullYear()}`;
                items.push((
                    <ListItem
                        key={week_id}
                        primaryText={weekStr}
                        secondaryText={`pending ${count} item(s)`}
                        onTouchTap={this.goTo.bind(this, dateStr, doctor.id)}
                        leftIcon={<ActionInfo />}
                    />
                ));
                pendingCount += count;
            }
            list.push(
                <ListItem
                    key={id}
                    leftAvatar={<Avatar icon={<ActionPermIdentity />} />}
                    primaryText={doctor.name}
                    secondaryText={`${pendingCount} item(s)`}
                    primaryTogglesNestedList={true}
                    nestedItems={items}
                />
            )
        }
        return (
            <Panel>
                <List>
                    <Subheader>Doctors</Subheader>
                    {list}
                </List>
            </Panel>
        );
    }
}

ScheduleEventList.propTypes = {};
ScheduleEventList.contextTypes = {
    navigate: PropTypes.func,
    dialog: PropTypes.object,
    ajax: PropTypes.object
};

export default ScheduleEventList;