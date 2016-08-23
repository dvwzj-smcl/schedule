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

    componentWillMount() {
        this.props.actions.init(true);
    }

    initialized = () => {
        return this.props.actions.init(false);
    };
    
    onChange = (id) => {
        this.context.navigate({id});
    };

    render() {
        // console.log('render: sc page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let doctor_id = props.params.id ? parseInt(props.params.id) : 0;
        console.log('doctor_id', doctor_id);
        let formTemplate = {
            data: {doctor_id: data.doctors},
            values: {doctor_id},
            components: [
                [{type: 'select', name: 'doctor_id', label: 'Doctor*', onChange: this.onChange}]
            ]
        };
        return (
            <Row>
                <Col md={3}>
                    <Panel>
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={formTemplate} />
                        </div>
                    </Panel>
                </Col>
            </Row>
        );
    }
}

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    navigate: PropTypes.func,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);