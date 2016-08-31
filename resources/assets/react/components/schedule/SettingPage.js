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

    initialized = () => {
        return this.props.actions.init(false);
    };

    changeTab = (type) => {
        this.context.router.push(`/settings/${type}`);
    };

    render() {
        // console.log('render: setting page');
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let {doctors} = props.schedule.data;
        let params = props.params;
        let settingType = this.props.location.pathname.split('/')[2];
        return (
            <div>
                <PageHeading title="Settings" description="Set colors and durations" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col xs md={12}>
                            <Tabs value={settingType}>
                                <Tab label="Doctors" value="doctors" onActive={this.changeTab.bind(this, 'doctors')}>
                                    {settingType == 'doctors' ? this.props.children : null}
                                </Tab>
                                <Tab label="Categories" value="categories"  onActive={this.changeTab.bind(this, 'categories')}>
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

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SettingPage);