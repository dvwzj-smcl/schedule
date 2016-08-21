import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';
import {List, ListItem} from 'material-ui/List';
import {ActionPermIdentity, ActionInfo} from 'material-ui/svg-icons';
import * as scheduleActions from '../../actions/scheduleActions';
import SemiForm from '../forms/SemiForm';
import ScheduleFilter from './ScheduleFilter';
import ScheduleEventList from './ScheduleEventList';
// import Paper from 'material-ui/Paper';
// import FlatButton from 'material-ui/FlatButton';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        // variables
        this.eventColors = {
            other: '#B1B1B1',
            approved: '#00AAA0',
            rejected: '#C22326',
            canceled: '#FDB632',
            pending: '#A8216B'
        };
        this.hides = {}
    }

    componentWillReceiveProps(nextProps) {
        this.setValuesState(nextProps.params);
        this.hides = this.parseHideParam(nextProps.params.hides);
    }

    componentWillMount() {
        this.setValuesState(this.props.params);
        this.hides = this.parseHideParam(this.props.params.hides);
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
    }

    getChildContext() {
        return {
            eventColors: this.eventColors,
            hides: this.hides,
            navigate: this.navigate
        };
    }

    parseHideParam = hides => {
        if(!hides) hides = '';
        return {
            other: hides.has('o'),
            approved: hides.has('a'),
            pending: hides.has('p'),
            rejected: hides.has('r'),
            canceled: hides.has('c')
        }
    };

    setValuesState = (params) => {
        let {doctor_id, date} = params;
        this.setState({
            values: {
                doctor_id: doctor_id ? parseInt(doctor_id) : 1,
                date: date ? new Date(date) : new Date()
                // date2: date ? new Date(date).toString() : new Date().toString(),
            }
        });
    };

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };

    onSubmit = (data) => {
        console.log('data', data);
        let date = data.date ? (typeof data.date === 'string') ? data.date : data.date.getISODate() : new Date();
        this.navigate({date, doctor_id: data.doctor_id})
    };

    navigate = (params) => {
        if(this.props.params.hides === undefined && params.hides === undefined) params.hides = ''; // fix hides undefined
        // console.log('this.props.params', this.props.params);
        params = Object.assign({
            role: 'sale', doctor_id: 1, date: (new Date()).getISODate(), hides: ''
        }, this.props.params, params);
        // console.log('param-2', params);
        this.context.router.push(`/schedules/${params.role}/${params.doctor_id}/${params.date}/${params.hides}`);
    };

    render() {
        console.log('render: search*', this.props.schedule);
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors} = props.schedule.data;

        let formTemplate = {
            data: {doctor_id: doctors},
            values: this.state.values,
            components: [
                [{type: 'select', name: 'doctor_id', label: 'Doctor*', required: true}],
                [{type: 'date', name: 'date', label: 'Date', required: true}]
            ]
        };

        return (
            <div>
                <PageHeading title="Schedule" description={formTemplate.values.date.toString()} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div className="semicon">
                                    <SemiForm submitLabel="GO" buttonRight compact onSubmit={this.onSubmit} formTemplate={formTemplate} />
                                </div>
                            </Panel>
                            <ScheduleFilter params={this.props.params} schedule={props.schedule}/>
                            {this.props.params.role == 'organizer' ? <ScheduleEventList user={props.user} params={this.props.params} schedule={props.schedule}/> : null}
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

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};
SchedulePage.childContextTypes = {
    eventColors: PropTypes.object,
    hides: PropTypes.object,
    navigate: PropTypes.func
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);