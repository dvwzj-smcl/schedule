import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import Loading from './widgets/Loading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
// import Paper from 'material-ui/Paper';
// import Divider from 'material-ui/Divider';
// import FlatButton from 'material-ui/FlatButton';

import * as scheduleActions from '../actions/scheduleActions';

// Forms
import SemiSelect from './forms/SemiSelect';
import SemiDate from './forms/SemiDate';
import SemiForm from './forms/SemiForm';
import Calendar from './widgets/Calendar';
import SemiModal from './widgets/SemiModal';

class SchedulePage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            addModal: 0
        };

        // variables
        this.initCalendar = false;
        this.data = {
            catId: 0,
            slotId: 0
        };

        this.initialized = this.initialized.bind(this);
        this.loadSlots = this.loadSlots.bind(this);
        this.onSelectSubcategory = this.onSelectSubcategory.bind(this);
        this.onClose = this.onClose.bind(this);

        this.eventClick = this.eventClick.bind(this);
        this.dayClick = this.dayClick.bind(this);
    }
    
    loadSlots(doctor_id) {
        this.context.ajax.get(`schedules/doctors/${doctor_id}/slot`, null, (response)=>{
            let me = this;
            let slots = response.data.slots;
            // avoid refs.calendar undefined
            var interval = setInterval(function(){
                if(me.refs.calendar && me.initialized()) {
                    // initialize
                    // create lookup tables
                    me.lookup = me.props.schedule.data.lookup;
                    // let cats = me.props.schedule.data.categories;
                    // for(let i in cats) {
                    //     me.lookup.categories[cats[i].id] = parseInt(i);
                    // }
                    // initialize slots
                    let colors = me.lookup.colors;
                    for(let i in slots) {
                        let slot = slots[i];
                        let doctor_id = slot.sc_doctor_id;
                        let cat_id = slot.sc_category_id;
                        slot.index = i; // array index
                        // if(slot.is_full) slot.rendering = 'background';
                        slot.rendering = 'background';
                        slot.color = colors[doctor_id][cat_id];
                    }
                    console.log('slots', slots);
                    me.refs.calendar.addEventSource(slots);
                    clearInterval(interval);
                }
            }, 500);
        }, error=>{});
    }

    initialized() {
        return this.props.schedule && this.props.schedule.init;
    }

    componentWillReceiveProps(nextProps) {
    }

    componentDidUpdate() {
    }

    componentDidMount() {
        if(!this.initialized()) {
            this.props.actions.init();
        }
        this.loadSlots(1);
    }

    // --- Modal Functions

    onSelectSubcategory(data) {
        console.log('data from addModal', data);
        this.refs.addModal.ajax('post', `schedules/slots/${data.slot_id}/add_event`, data, response => {
            console.log('response', response);
        }, error => {});
        this.refs.addModal.close();
    }

    onClose() {
        // console.log('close addModal');
    }

    // --- Calendar Functions

    eventClick(calEvent) {
        let category_id = this.lookup.categories[calEvent.sc_category_id];
        this.setState({addModal: category_id});
        // console.log('calEvent', calEvent);
        let slot_id = calEvent.id;
        this.refs.addModal.open({category_id, slot_id});
        this.refs.addModal.open({category_id, slot_id});
    }

    dayClick(date, jsEvent, view, resourceObj) {
        console.log('dayClick', date);
    }

    render() {
        let props = this.props;
        let data = props.schedule.data;
        // console.log('render: sc page', this.props.schedule);
        if(!this.initialized()) return <Loading />;
        return (
            <div>
                <SemiModal submitForm={this.onSelectSubcategory} onClose={this.onClose} ref="addModal">
                    <SemiSelect
                        data={data.categories[this.state.addModal].sub_categories}
                        name="subcat"
                        required
                        floatingLabelText={'subcategory'}
                        fullWidth={true}
                    />
                </SemiModal>
                <PageHeading title="Schedule" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={3}>
                            <Panel title="Goto" type="secondary">
                                <div style={{padding: 12}}>
                                    <SemiForm submitLabel="GO" buttonRight compact>
                                        <SemiSelect
                                            data={data.categories}
                                            name="category"
                                            floatingLabelText="category"
                                            fullWidth={true}
                                        />
                                        <SemiDate
                                            name="date"
                                            required
                                            floatingLabelText="date"
                                            fullWidth={true}
                                        />
                                    </SemiForm>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={9}>
                            <Panel title="Schedule">
                                <div className="con-pad">
                                    <Calendar droppable={false} editable={false} ref="calendar"
                                              eventClick={this.eventClick}
                                              dayClick={this.dayClick}
                                    />
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

SchedulePage.propTypes = {};
SchedulePage.contextTypes = {
    ajax: PropTypes.object
};

const mapStateToProps = ({schedule}) => ({schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(SchedulePage);