import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';

// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiForm from '../forms/SemiForm';

import {HardwareKeyboardArrowRight, HardwareKeyboardArrowLeft} from 'material-ui/svg-icons';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    onSubmit = (data, ajax) => {

    };

    render() {
        // console.log('render: sc page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let formTemplate = {
            data: {},
            values: {username: 'sale1', password: 'asdfasdf'},
            components: [
                [{type: 'text', name: 'username', label: 'Username', required: true, hint: 'your username or email'}],
                [{type: 'text', name: 'password', label: 'Password', required: true}]
            ]
        };
        return (
            <Panel title="Settings">
                <div className="semicon">
                    <SemiForm onSubmit={this.onSubmit} formTemplate={formTemplate} />
                </div>
            </Panel>
        );
    }
}

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);