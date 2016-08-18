import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
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
import Checkbox from 'material-ui/Checkbox';

class SearchPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.setValuesState(props.params);
    }

    componentWillReceiveProps(nextProps) {
        this.setValuesState(nextProps.params);
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
    }

    setValuesState = (params) => {
        let {doctor_id, date} = params;
        this.state = {
            values: {
                doctor_id: doctor_id ? parseInt(doctor_id) : 1,
                date: date ? new Date(date) : new Date()
                // date2: date ? new Date(date).toString() : new Date().toString(),
            }
        }
    };

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };

    onSubmit = (data) => {
        this.context.router.push(`/schedules/${data.doctor_id}/${data.date.getISODate()}`);
    };

    onCheck = (param, asdf) => {
        console.log('param', param,asdf);
    };

    render() {
        // console.log('render: search*', this.state.values);
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors} = props.schedule.data;

        let formTemplate = {
            data: {doctor_id: doctors},
            values: this.state.values,
            components: [
                [{type: 'select', name: 'doctor_id', label: 'Doctor*', required: true}],
                [{type: 'date', name: 'date', label: 'Date', required: true}]
                // [{type: 'text', name: 'date2', label: 'Date', required: true}]
            ]
        };

        return (
            <div>
                <PageHeading title="Schedule" description={formTemplate.values.date.toString()} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <SemiForm submitLabel="GO" buttonRight compact onSubmit={this.onSubmit} formTemplate={formTemplate}>
                                    </SemiForm>
                                </div>
                            </Panel>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <Checkbox
                                        onCheck={this.onCheck}
                                    />
                                </div>
                            </Panel>
                        </Col>
                        <Col md={9}>
                            {props.children}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SearchPage.propTypes = {};
SearchPage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    helper: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);