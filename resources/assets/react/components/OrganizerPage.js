import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';

import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import api from '../api';

import $ from 'jquery';
import 'jquery-ui/themes/base/draggable.css';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import moment from 'moment';
import 'fullcalendar';
import 'fullcalendar/dist/lang-all';

// Forms
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

import ErrorMessage from './forms/ErrorMessage';

class OrganizerPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            editing: false,
            removing: false,
            doctor: {
                changing: false,
                next: null
            },
            slot: {
                select: null,
                create: {
                    start: null,
                    end: null,
                    doctor_id: null,
                    category_id: null
                }
            },
            doctors: [],
            categories: []
        };
        this.changeDoctorOnCreateSlot = this.changeDoctorOnCreateSlot.bind(this);
        this.removeSelectedEvent = this.removeSelectedEvent.bind(this);
        this.discardChangeDoctor = this.discardChangeDoctor.bind(this);
        this.discardSave = this.discardSave.bind(this);
        this.discardRemoveSelectedEvent = this.discardRemoveSelectedEvent.bind(this);
        this.confirmRemoveSelectedEvent = this.confirmRemoveSelectedEvent.bind(this);
        this.save = this.save.bind(this);
    }

    componentDidMount() {
        let promises = [];
        promises.push(this.loadDoctors());
        promises.push(this.loadCategories());

        Promise.all(promises).then(()=>{
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: null
                },
                lang: 'en',
                timezone: 'Asia/Bangkok',
                defaultView: 'agendaWeek',
                height: 'auto',
                minTime: '06:00',
                maxTime: '21:00',
                allDaySlot: false,
                slotDuration: '00:30:00',
                editable: this.props.user.isOrganizer ? true : false,
                selectable: this.props.user.isOrganizer ? true : false,
                droppable: true,
                unselectAuto: true,
                slotEventOverlap: false,
                events: [],
                forceEventDuration: true,
                defaultTimedEventDuration: '02:00:00',
                viewRender: (view, element)=>{
                },
                select: (a, b, jsEvent, view)=>{
                    let start = a.format('YYYY-MM-DD H:mm:ss');
                    let end = b.format('YYYY-MM-DD H:mm:ss');
                    let create = Object.assign({}, this.state.slot.create, {start, end});
                    let slot = Object.assign({}, this.state.slot, {create});
                    let state = Object.assign({}, this.state, {slot});
                    this.setState(state);
                },
                unselect: (view, jsEvent)=>{
                    let slot = Object.assign({}, this.state.slot, {select:null});
                    let state = Object.assign({}, this.state, {slot});
                    this.setState(state);
                },
                drop: (date, jsEvent, ui, resourceObj)=>{
                    let state = Object.assign({}, this.state, {editing: true});
                    this.setState(state);
                },
                dayClick: ( date, jsEvent, view, resourceObj)=>{
                    let slot = Object.assign({}, this.state.slot, {select:null});
                    let state = Object.assign({}, this.state, {slot});
                    this.setState(state);
                },
                eventClick: (calEvent, jsEvent, view)=>{
                    let select = calEvent._id;
                    let slot = Object.assign({}, this.state.slot, {select});
                    let state = Object.assign({}, this.state, {slot});
                    this.setState(state);
                },
                eventDrop: ()=>{
                    let state = Object.assign({}, this.state, {editing: true});
                    this.setState(state);
                },
                eventResize: ()=>{
                    let state = Object.assign({}, this.state, {editing: true});
                    this.setState(state);
                }
            });
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.loading===false;
    }

    componentDidUpdate() {
        $('.draggable-category').each(function(){
            $(this).data('event', {
                category_id: $(this).data('id'),
                title: $.trim($(this).text()), // use the element's text as the event title
                stick: true // maintain when user navigates (see docs on the renderEvent method)
            });

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });
        });
        $('#calendar').fullCalendar('render');
        //$('#calendar').fullCalendar('removeEvents');
        //$('#calendar').fullCalendar('addEventSource', this.state.slots);

    }
    discardChangeDoctor(){
        let state = Object.assign({}, this.state, {doctor:{changing: false, next: null}});
        this.setState(state);
    }
    discardSave(){
        let create = Object.assign({}, this.state.slot.create, {doctor_id: this.state.doctor.next});
        let slot = Object.assign({}, this.state.slot, {create});
        let doctor = {changing: false, next: null};
        let state = Object.assign({}, this.state, {slot, doctor, editing: false});
        this.setState(state);
        $('#calendar').fullCalendar('removeEvents');
    }
    changeDoctorOnCreateSlot(event, index, doctor_id){
        let state = Object.assign({}, this.state, {doctor:{changing: true, next: doctor_id}});
        this.setState(state);
        if(!this.state.editing) {
            $('#calendar').fullCalendar('removeEvents');
            this.ajax('get', api.baseUrl('calendar/doctor/'+doctor_id+'/slot'), null, (response)=>{
                let create = Object.assign({}, this.state.slot.create, {doctor_id});
                let slot = Object.assign({}, this.state.slot, {create});
                let doctor = {changing: false, next: null};
                let state = Object.assign({}, this.state, {slot, doctor});
                this.setState(state);
                $('#calendar').fullCalendar('addEventSource', response.slots);
            }, error=>{});
        }

    }
    discardRemoveSelectedEvent(){
        let state = Object.assign({}, this.state, {removing: false});
        this.setState(state);
    }
    confirmRemoveSelectedEvent(){
        $('#calendar').fullCalendar('removeEvents', (event)=>{
            return event._id==this.state.slot.select;
        });
        let slot = Object.assign({}, this.state.slot, {select: null});
        let state = Object.assign({}, this.state, {slot, removing: false});
        this.setState(state);
    }
    removeSelectedEvent(){
        let state = Object.assign({}, this.state, {removing: true});
        this.setState(state);
    }

    ajax(method, url, data, success, error){
        data = JSON.stringify(data);
        let state = Object.assign({}, this.state, {loading: true});
        this.setState(state);
        let access_token = this.props.user.access_token;
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            setTimeout(()=>{
                let state = Object.assign({}, this.state, {loading: false});
                this.setState(state);
            }, 1000);
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }
    loadDoctors(){
        this.ajax('get', api.baseUrl('calendar/doctors'), null, (response)=>{
            let state = Object.assign({}, this.state, {userlist: response.doctors});
            this.setState(state);
        }, error=>{});

    }
    loadCategories(){
        this.ajax('get', api.baseUrl('calendar/categories'), null, (response)=>{
            let state = Object.assign({}, this.state, {categories: response.categories});
            this.setState(state);
        }, error=>{});

    }
    save(){
        //console.log('save!');
        let events = $('#calendar').fullCalendar('clientEvents').map((event)=>{
            return {
                sc_doctor_id: this.state.slot.create.doctor_id,
                sc_category_id: event.category_id,
                sc_organizer_id: this.props.user.isOrganizer.id,
                start: event.start.format('YYYY-MM-DD H:mm:ss'),
                end: event.end.format('YYYY-MM-DD H:mm:ss')
            };
        });
        this.ajax('post', api.baseUrl('calendar/slot'), events, (response)=>{
            //console.log(response);
        }, error=>{});
    }

    render() {
        return (
            <div>
                <PageHeading title="Organizer" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={9}>
                            <Panel title="Organizer">
                                <div className="con-pad">
                                    <div style={{textAlign: 'center', display: this.state.loading ? 'block': 'none'}}>
                                        <CircularProgress size={2} />
                                    </div>
                                    <div id="calendar" style={{ display: this.state.loading ? 'none': 'block'}}></div>
                                    <Dialog
                                        actions={[
                                            <FlatButton
                                                label="Cancel"
                                                primary={true}
                                                onTouchTap={this.discardChangeDoctor}
                                            />,
                                            <FlatButton
                                                label="Discard"
                                                primary={true}
                                                onTouchTap={this.discardSave}
                                            />
                                        ]}
                                        modal={false}
                                        open={this.state.editing&&this.state.doctor.changing}
                                        onRequestClose={this.discardChangeDoctor} >
                                        Unsaved, Do you want to discard this ?
                                    </Dialog>
                                    <Dialog
                                        actions={[
                                            <FlatButton
                                                label="Cancel"
                                                primary={true}
                                                onTouchTap={this.discardRemoveSelectedEvent}
                                            />,
                                            <FlatButton
                                                label="Remove"
                                                primary={true}
                                                onTouchTap={this.confirmRemoveSelectedEvent}
                                            />
                                        ]}
                                        modal={false}
                                        open={this.state.removing}
                                        onRequestClose={this.discardRemoveSelectedEvent} >
                                        Do you want to remove this ?
                                    </Dialog>
                                </div>
                            </Panel>
                        </Col>
                        <Col md={3}>
                            <Panel style={{ display: this.state.loading ? 'none': 'block'}}>
                                <div style={{padding: 12}}>
                                    <SelectField fullWidth={false} floatingLabelText="Doctors" value={this.state.slot.create.doctor_id} onChange={this.changeDoctorOnCreateSlot}>
                                        {this.state.doctors.map((doctor, i)=>{
                                            return(
                                                <MenuItem key={i} value={doctor.id} primaryText={doctor.user.name} />
                                            );
                                        })}
                                    </SelectField>
                                    <List style={{display: this.state.slot.create.doctor_id?'block':'none'}}>
                                        {this.state.categories.map((category, i)=>{
                                            return(
                                                <ListItem key={i} className="draggable-category" data-id={category.id} primaryText={category.name} leftIcon={<ActionEventSeat />} />
                                            );
                                        })}
                                    </List>
                                </div>
                            </Panel>
                            <Panel>
                                <List style={{display: this.state.editing?'block':'none'}}>
                                    <ListItem primaryText="Save" leftIcon={<ContentSave />} onClick={this.save} />
                                </List>
                            </Panel>
                            <Panel>
                                <List style={{display: this.state.slot.select?'block':'none'}}>
                                    <ListItem primaryText="Remove" leftIcon={<ActionDelete />} onClick={this.removeSelectedEvent} />
                                </List>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

OrganizerPage.propTypes = {};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizerPage);