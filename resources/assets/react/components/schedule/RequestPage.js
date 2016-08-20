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
    }


    render() {

        return (
            <div>
                <PageHeading title="Requests" description="Summary of appointment requests" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div className="semicon">

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