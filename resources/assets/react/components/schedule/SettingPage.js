import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import Loading from '../widgets/Loading';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';

// import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import * as scheduleActions from '../../actions/scheduleActions';

// Forms
import SemiForm from '../forms/SemiForm';
import DoctorSettingPage from './DoctorSettingPage';

class SettingPage extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidMount() {
        this.props.actions.init(true);
    }

    getChildContext() {
        return {
            navigate: this.navigate
        };
    }

    initialized = () => {
        return this.props.actions.init(false);
    };

    navigate = (params) => {
        // not quite useful
        params = Object.assign({
            type: 'doctors'
        }, this.props.params, params);
        this.context.router.push(`/settings/${params.type}${params.id ? '/'+params.id : ''}`);
    };

    render() {
        // console.log('render: search*', this.state.values);
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors} = props.schedule.data;
        let params = props.params;
        let settingType = 'doctors';
        // todo: dynamic
        console.log(props.schedule.data);
        return (
            <div>
                <PageHeading title="Settings" description="Set colors and durations" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col xs md={12}>
                            <Tabs>
                                <Tab label="Doctors" >
                                    {settingType == 'doctors' ? this.props.children : null}
                                </Tab>
                                <Tab label="Categories" >
                                    {settingType == 'categories' ? this.props.children : null}
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SettingPage.propTypes = {};
SettingPage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    helper: PropTypes.object,
    dialog: PropTypes.object,
    initialized: PropTypes.func
};
SettingPage.childContextTypes = {
    navigate: PropTypes.func
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);