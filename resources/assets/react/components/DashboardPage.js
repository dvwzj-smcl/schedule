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

const callActions = [
    {id: 'phoned', name: 'Phoned but not confirmed'},
    {id: 'messaged', name: 'Messaged but not confirmed'},
    {id: 'phoned done', name: 'Phoned & Comfirmed'},
    {id: 'messaged done', name: 'Messaged & Comfirmed'}
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

    onTaskActionSelect = (key) => {
        if(key == 'called') {
        } else if (key == 'messaged') {
        } else if (key == 'called-confirmed') {
        } else if (key == 'messaged-confirmed') {
        }
        this.context.dialog.confirm('Are you sure?', `${key.capitalize()} Appointment`, (confirm) => {
            if(confirm) {
                this.context.ajax.call('get', `schedules/events/${event_id}/confirm-status/${key}`, null).then( response => {
                    this.props.actions.getScheduleEventsStatus();
                }).catch( error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }
        });
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
        // Contact Task
        let callActions = [
            {id: 'called', name: 'Called but not confirmed'},
            {id: 'messaged', name: 'Messaged but not confirmed'},
            {id: 'called-confirmed', name: 'Called & Comfirmed'},
            {id: 'messaged-confirmed', name: 'Messaged & Comfirmed'}
        ];
        const rightIconMenu = <ContextMenu isIconMenu onSelect={this.onTaskActionSelect} data={callActions} />;
        let {user, notification} = this.props;

        let isTaskLoaded = this.props.actions.getScheduleTasks(false);
        let isEventStatusLoaded = this.props.actions.getScheduleEventsStatus(false);

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
                        eventsStatusLists[type].push((
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

        return (
            <div>
                <PageHeading title="Dashboard" description="Remaining tasks & status" />
                <Grid fluid className="content-wrap dashboard">
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
                    <Row>
                        <Col xs md={4}>
                            <Panel>
                                <Subheader>Pending</Subheader>
                                <Divider />
                                {!isEventStatusLoaded ? <Loading inline /> :
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
                                {!isEventStatusLoaded ? <Loading inline /> :
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
                                {!isEventStatusLoaded ? <Loading inline /> :
                                    <List className="scroll-list">
                                        {eventsStatusLists['canceled']}
                                    </List>
                                }
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

HomePage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, notification}) => ({user, notification});
const mapDispatchToProps = (dispatch) => ({actions: {
    getScheduleTasks: bindActionCreators(notificationActions.getScheduleTasks, dispatch),
    getScheduleEventsStatus: bindActionCreators(notificationActions.getScheduleEventsStatus, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
