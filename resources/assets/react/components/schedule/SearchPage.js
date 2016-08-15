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
import SemiSelect from '../forms/SemiSelect';
import SemiDate from '../forms/SemiDate';
import FormGenerator from '../forms/FormGenerator';
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import Calendar from '../widgets/Calendar';
import SemiModal from '../widgets/SemiModal';
import ContextMenu from '../widgets/ContextMenu';
import $ from 'jquery';

class SearchPage extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
    }

    initialized = () => {
        return this.props.schedule && this.props.schedule.init;
    };

    // helper
    toDate = (date) => {
        return new Date(date.format('YYYY-MM-DD H:mm:ss'));
    };

    render() {
        if(!this.initialized()) return <Loading />;
        let props = this.props;
        let data = props.schedule.data;
        console.log('props', props);

        return (
            <div>
                <PageHeading title="Schedule" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <SemiForm submitLabel="GO" buttonRight compact>
                                        <SemiSelect
                                            data={data.doctors}
                                            name="category"
                                            floatingLabelText="Doctor"
                                            fullWidth={true}
                                        />
                                        <SemiDate
                                            name="date"
                                            required
                                            floatingLabelText="Date"
                                            fullWidth={true}
                                        />
                                    </SemiForm>
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
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);