import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

class ScheduleFilter extends Component {
    constructor(props, context) {
        super(props, context);
        // variables
        this.eventColors = context.eventColors;
    }

    onSubmit = (data) => {
        console.log('data', data);
        let date = data.date ? (typeof data.date === 'string') ? data.date : data.date.getISODate() : new Date();
        this.context.navigate({date, doctor_id: data.doctor_id})
    };
    
    onCheck = (obj, value) => {
        let name = obj.target.getAttribute('name');
        let h = this.context.hides, hides = '';
        h[name] = !h[name];
        if(h.other) hides += 'o';
        if(h.approved) hides += 'a';
        if(h.pending) hides += 'p';
        if(h.rejected) hides += 'r';
        if(h.canceled) hides += 'c';
        this.context.navigate({hides});
    };

    render() {
        if(!this.context.initialized()) return <Loading />;
        let colors = this.eventColors;
        let hides = this.context.hides;
        let isOrganizer = this.props.params.role == 'organizer';

        return (
            <Panel title="Show" type="secondary">
                <div className="semicon">
                    {isOrganizer ? null : (
                        <div>
                            <Checkbox name="other" label="Other" onCheck={this.onCheck} checked={!hides.other} iconStyle={{fill: colors['other']}} labelStyle={{color: colors['other']}} />
                            <Divider style={{marginBottom: 8, marginTop: 8}} />
                        </div>
                    )}
                    <Checkbox name="approved" label="Approved" onCheck={this.onCheck} checked={!hides.approved} iconStyle={{fill: colors['approved']}} labelStyle={{color: colors['approved']}} />
                    <Checkbox name="pending" label="Pending" onCheck={this.onCheck} checked={!hides.pending} iconStyle={{fill: colors['pending']}} labelStyle={{color: colors['pending']}} />
                    <Checkbox name="rejected" label="Rejected" onCheck={this.onCheck} checked={!hides.rejected} iconStyle={{fill: colors['rejected']}} labelStyle={{color: colors['rejected']}} />
                    <Checkbox name="canceled" label="Canceled" onCheck={this.onCheck} checked={!hides.canceled} iconStyle={{fill: colors['canceled']}} labelStyle={{color: colors['canceled']}} />
                </div>
            </Panel>
        );
    }
}

ScheduleFilter.propTypes = {};
ScheduleFilter.contextTypes = {
    eventColors: PropTypes.object,
    hides: PropTypes.object,
    navigate: PropTypes.func,
    initialized: PropTypes.func
};

export default ScheduleFilter;