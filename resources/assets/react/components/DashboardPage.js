import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../actions/notificationActions';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import Loading from './widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ActionInfoOutline, ActionFeedback, AvNotInterested, ContentAdd, MapsLocalPhone, ActionPermIdentity, ActionInfo, NavigationMenu, NavigationMoreVert} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import {blueGrey400, brown400, grey400, darkBlack, lightBlack, deepOrange500, teal700} from 'material-ui/styles/colors';
import MenuItem from 'material-ui/MenuItem';
import ContextMenu from './widgets/ContextMenu';
import MobileSheet  from './widgets/MobileSheet';
// import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';

const eventActions = [
    {id: 'goto calendar', name: 'Goto Calendar'}
];

const callActions = [
    {id: 'called', name: 'Called but not confirmed'},
    {id: 'messaged', name: 'Messaged but not confirmed'},
    {id: 'called-confirmed', name: 'Called & Comfirmed'},
    {id: 'messaged-confirmed', name: 'Messaged & Comfirmed'}
];

class HomePage extends Component {
    constructor(props, context){
        super(props, context);
        // this.props.actions.getTasks();
    }

    componentWillMount() {
        this.initialized();
    }

    componentDidMount() {
    }

    onTaskActionSelect = (data, key) => {
        let event_id = data.id;
        let message = '';
        let {first_name, last_name} = data.customer;
        if(key == 'called') {
            message = `You called ${first_name} ${last_name} but not confirmed`;
        } else if (key == 'messaged') {
            message = `You messaged ${first_name} ${last_name} but not confirmed`;
        } else if (key == 'called-confirmed') {
            message = `You called ${first_name} ${last_name} and confirmed`;
        } else if (key == 'messaged-confirmed') {
            message = `You messaged ${first_name} ${last_name} and confirmed`;
        }
        this.context.dialog.confirm(message, 'Confirm Action', (confirm) => {
            if(confirm) {
                this.context.ajax.call('get', `schedules/events/${event_id}/confirm-status/${key}`, null).then( response => {
                    this.props.actions.getScheduleTasks();
                }).catch( error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }
        });
    };

    onEventActionSelect = (data) => {
        let date = (new Date(data.start)).getISODate();
        let role = 'sale'; // todo
        let doctor_id = data.slot.sc_doctor_id;
        this.context.router.push(`/schedules/${role}/${doctor_id}/${date}`);
    };

    initialized = () => {
        /*
         false: Not send API Call. return isLoaded(boolean)
         true: Send API Call. return isLoaded(boolean)
         none: Send API Call. return Promise
          */
        let taskReady = this.props.actions.getScheduleTasks(true);
        let eventsStatusReady = this.props.actions.getScheduleEventsStatus(true);
        return taskReady && eventsStatusReady;
    };

    render(){
        // console.log('render: dash', this.props.notification);

        let {user, notification} = this.props;

        let isTaskLoaded = this.props.actions.getScheduleTasks(false);
        let isEventStatusLoaded = this.props.actions.getScheduleEventsStatus(false);
        let isSale = user&&user.roles&&user.roles.indexOf('sale') >= 0;
        let isOrganizer = user&&user.roles&&user.roles.indexOf('organizer') >= 0;

        let taskLists = [];
        let eventsStatusLists = [];

        if(notification && notification.scTasks) {
            let scTasks = notification.scTasks.data;
            if(scTasks) {
                let types = ['new', 'urgent'];
                for(let type of types) {
                    let tasks = scTasks[type];
                    taskLists[type] = [];
                    for(let i in tasks) {
                        let task = tasks[i];
                        let customer = task.customer;
                        let when = (new Date(task.start)).getDateTimeStr();
                        let subCategory = task.sub_category;
                        let leftAvatar = null;
                        if (task.called_at && task.messaged_at) {
                            leftAvatar = (<Avatar icon={<AvNotInterested />}/>);
                        } else if (task.called_at) {
                            leftAvatar = (<Avatar icon={<MapsLocalPhone />} backgroundColor={blueGrey400}/>);
                        } else if (task.messaged_at) {
                            leftAvatar = (<Avatar icon={<ActionFeedback /> } backgroundColor={brown400}/>);
                        } else {
                            leftAvatar = (<Avatar icon={<ContentAdd />} backgroundColor={deepOrange500}/>);
                        }
                        const rightIconMenu = <ContextMenu isIconMenu onSelect={this.onTaskActionSelect.bind(this, task)} data={callActions} />;
                        taskLists[type].push((
                            <div key={i}>
                                <ListItem
                                    leftAvatar={leftAvatar}
                                    rightIconButton={rightIconMenu}
                                    primaryText={`${customer.first_name} ${customer.last_name}`}
                                    secondaryText={
                                        <p>
                                          <span style={{color: darkBlack}}>{`${customer.phone}`}</span>, {`${customer.contact}`}<br/>
                                          <span style={{color: teal700}}>{`${subCategory.name}`}</span> {`${when}`}
                                        </p>
                                    }
                                    secondaryTextLines={2}
                                />
                                {(i != tasks.length - 1) ? <Divider inset={true}/> : null }
                            </div>
                        ));
                    }
                }
            }
        }
        if(notification && notification.scEventsStatus) {
            let scEventsStatus = notification.scEventsStatus.data;
            if(scEventsStatus) {
                let types = ['pending', 'rejected', 'canceled'];
                for(let type of types) {
                    let tasks = scEventsStatus[type];
                    eventsStatusLists[type] = [];
                    for(let i in tasks) {
                        let task = tasks[i];
                        let customer = task.customer;
                        let when = (new Date(task.start)).getDateTimeStr();
                        let subCategory = task.sub_category;
                        let leftAvatar = null;
                        if (task.called_at && task.messaged_at) {
                            leftAvatar = (<Avatar icon={<AvNotInterested />}/>);
                        } else if (task.called_at) {
                            leftAvatar = (<Avatar icon={<MapsLocalPhone />} backgroundColor={blueGrey400}/>);
                        } else if (task.messaged_at) {
                            leftAvatar = (<Avatar icon={<ActionFeedback /> } backgroundColor={brown400}/>);
                        } else {
                            leftAvatar = (<Avatar icon={<ContentAdd />} backgroundColor={deepOrange500}/>);
                        }
                        const rightIconMenu = <ContextMenu isIconMenu onSelect={this.onEventActionSelect.bind(this, task)} data={eventActions} />;
                        eventsStatusLists[type].push((
                            <div key={i}>
                                <ListItem
                                    leftAvatar={leftAvatar}
                                    rightIconButton={rightIconMenu}
                                    primaryText={`${subCategory.name}`}
                                    secondaryText={
                                        <p>
                                          <span style={{color: teal700, marginRight:16}}>{`${task.slot.doctor.user.name}`}</span>
                                          <span style={{color: darkBlack}}>{`${when}`}</span>
                                        </p>
                                    }
                                    secondaryTextLines={2}
                                />
                                {(i != tasks.length - 1) ? <Divider inset={true}/> : null }
                            </div>
                        ));
                    }
                }
            }
        }

        return (
            <div>
                <PageHeading title="Dashboard" description="Remaining tasks & status" />
                <Grid fluid className="content-wrap dashboard">
                    {!isSale ? null :
                        <Row>
                            <Col xs md={6}>
                                <Panel>
                                    <Subheader>To Confirm: This Week</Subheader>
                                    <Divider />
                                    {!isTaskLoaded ? <Loading inline /> :
                                        <List className="scroll-list">
                                            {taskLists['new']}
                                        </List>
                                    }
                                </Panel>
                            </Col>
                            <Col xs md={6}>
                                <Panel>
                                    <Subheader>To Confirm: Urgent</Subheader>
                                    <Divider />
                                    {!isTaskLoaded ? <Loading inline /> :
                                        <List className="scroll-list">
                                            {taskLists['urgent']}
                                        </List>
                                    }
                                </Panel>
                            </Col>
                        </Row>
                    }
                    {!(isSale || isOrganizer) ? null :
                        <Row>
                            <Col xs md={4}>
                                <Panel>
                                    <Subheader>Pending</Subheader>
                                    <Divider />
                                    {!isEventStatusLoaded ? <Loading inline/> :
                                        <List className="scroll-list">
                                            {eventsStatusLists['pending']}
                                        </List>
                                    }
                                </Panel>
                            </Col>
                            <Col xs md={4}>
                                <Panel>
                                    <Subheader>Rejected</Subheader>
                                    <Divider />
                                    {!isEventStatusLoaded ? <Loading inline/> :
                                        <List className="scroll-list">
                                            {eventsStatusLists['rejected']}
                                        </List>
                                    }
                                </Panel>
                            </Col>
                            <Col xs md={4}>
                                <Panel>
                                    <Subheader>Canceled</Subheader>
                                    <Divider />
                                    {!isEventStatusLoaded ? <Loading inline/> :
                                        <List className="scroll-list">
                                            {eventsStatusLists['canceled']}
                                        </List>
                                    }
                                </Panel>
                            </Col>
                        </Row>
                    }
                </Grid>
            </div>
        );
    }
}

HomePage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    location: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, notification}) => ({user, notification});
const mapDispatchToProps = (dispatch) => ({actions: {
    getScheduleTasks: bindActionCreators(notificationActions.getScheduleTasks, dispatch),
    getScheduleEventsStatus: bindActionCreators(notificationActions.getScheduleEventsStatus, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
