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
import Divider from 'material-ui/Divider';

// import Paper from 'material-ui/Paper';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiForm from '../forms/SemiForm';
import Checkbox from 'material-ui/Checkbox';

class SearchPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.setValuesState(props.params);
        // variables
        this.eventColors = {
            other: '#B1B1B1',
            approved: '#7AE7BF',
            rejected: '#C22326',
            canceled: '#FDB632',
            pending: '#00AAA0'
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setValuesState(nextProps.params);
        this.hides = this.parseHideParam(nextProps.params.hides);
    }

    componentWillMount() {
        this.hides = this.parseHideParam(this.props.params.hides);
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
    }

    parseHideParam = hides => {
        if(!hides) hides = '';
        return {
            other: this.has(hides, 'o'),
            approved: this.has(hides, 'a'),
            pending: this.has(hides, 'p'),
            rejected: this.has(hides, 'r'),
            canceled: this.has(hides, 'c')
        }
    };

    has = (str, find) => {
        let result = str.indexOf(find);
        return result != -1;
    };

    getChildContext() {
        return {
            eventColors: this.eventColors,
            hides: this.hides
        };
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
        console.log('data', data);
        let date = data.date ? (typeof data.date === 'string') ? data.date : data.date.getISODate() : new Date();
        this.context.router.push(`/schedules/${data.doctor_id}/${date}`);
    };

    onHideChange = () => {
        let h = this.hides;
        let params = this.props.params;
        let hides = '';
        if(h.other) hides += 'o';
        if(h.approved) hides += 'a';
        if(h.pending) hides += 'p';
        if(h.rejected) hides += 'r';
        if(h.canceled) hides += 'c';
        console.log('***hides', hides);
        this.context.router.push(`/schedules/${params.doctor_id}/${params.date}/${hides}`);
    };

    onCheck = (obj, value) => {
        let name = obj.target.getAttribute('name');
        if(this.hides[name] !== value) {
            this.hides[name] = value;
            this.onHideChange();
        }
    };

    render() {
        console.log('render: search*', this.state.values);
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

        let colors = this.eventColors;
        let hides = this.hides;

        return (
            <div>
                <PageHeading title="Schedule" description={formTemplate.values.date.toString()} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div className="semicon">
                                    <SemiForm submitLabel="GO" hasReset buttonRight compact onSubmit={this.onSubmit} formTemplate={formTemplate}>
                                    </SemiForm>
                                </div>
                            </Panel>
                            <Panel title="Show" type="secondary">
                                <div className="semicon">
                                    <Checkbox name="other" label="Other" onCheck={this.onCheck} checked={!hides.other} iconStyle={{fill: colors['other']}} labelStyle={{color: colors['other']}} />
                                    <Divider style={{marginBottom: 8, marginTop: 8}} />
                                    <Checkbox name="approved" label="Approved" onCheck={this.onCheck} checked={!hides.approved} iconStyle={{fill: colors['approved']}} labelStyle={{color: colors['approved']}} />
                                    <Checkbox name="pending" label="Pending" onCheck={this.onCheck} checked={!hides.pending} iconStyle={{fill: colors['pending']}} labelStyle={{color: colors['pending']}} />
                                    <Checkbox name="rejected" label="Rejected" onCheck={this.onCheck} checked={!hides.rejected} iconStyle={{fill: colors['rejected']}} labelStyle={{color: colors['rejected']}} />
                                    <Checkbox name="canceled" label="Canceled" onCheck={this.onCheck} checked={!hides.canceled} iconStyle={{fill: colors['canceled']}} labelStyle={{color: colors['canceled']}} />
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
SearchPage.childContextTypes = {
    eventColors: PropTypes.object,
    hides: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);