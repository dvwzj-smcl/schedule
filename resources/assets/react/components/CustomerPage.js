import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import api from '../api';
import SemiDataTable from './widgets/SemiDataTable';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import ContentCreate from 'material-ui/svg-icons/content/create';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SemiModal from './widgets/SemiModal';
import {Form} from 'formsy-react';
import SemiTextField from './forms/components/SemiTextField';

let customerFields = {
    first_name: 'First Name',
    last_name: 'Last Name',
    hn: 'HN',
    phone: 'Phone',
    contact: 'Contact',
    boolean: 'Boolean (Test)'
};

class CustomerPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            customer: null,
            events: null,
            editable: null
        };
        this.infoCustomerModal = this.infoCustomerModal.bind(this);
        this.editCustomerModal = this.editCustomerModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);

        this.handleReloadPage = this.handleReloadPage.bind(this);
    }

    infoCustomerModal(customer_id){
        this.context.ajax.getAll([
            {
                name: 'customer',
                url: `schedules/customers/${customer_id}`
            },
            {
                name: 'events',
                url: `schedules/customers/${customer_id}/events`
            }
        ], null).then((res)=>{
            if(res.customer&&res.events){
                let customer = Object.keys(res.customer).map((i)=>{
                    return {
                        key: i,
                        field: customerFields[i],
                        value: res.customer[i]
                    }
                }).filter((row)=>row.field);
                let events = res.events.tbData;
                this.setState({customer, events, editable: null});
                //this.context.router.push({pathname: `/customers/${customer_id}`});
                this.refs.info.open();
            }
        }).catch((err)=>{console.log('err', err)});
    }

    editCustomerModal(customer_id){
        this.context.ajax.call("get", `schedules/customers/${customer_id}`, null).then((res)=>{
            this.setState({customer: null, events: null, editable: res.data.customer});
            this.refs.edit.open();
        }).catch((err)=>{console.log('err', err)});
    }

    handleEditSubmit(data, ajax, dialog){
        console.log('submit', data);
        // Using SemiModal's ajax is recommended
        return ajax.call('put', `schedules/customers/${data.id}`, data).then( response => {
            dialog.alert('Customer Updated', 'Success', 'success');
            this.refs.tb.handleReload();
            this.setState({customer: null, events: null, editable: null});
            return response; // pass response to SemiModal
        }).catch( error => {
            console.log('error', error);
            dialog.alert(error, 'Error');
            throw error; // pass error to SemiModal
        });
    }

    handleModalClose(){
        this.setState({customer: null, events: null, editable: null});
        //this.context.router.goBack();
    }

    handleReloadPage(){
        console.log('on reload: CustomerPage');
    }

    render() {
        let {customer, events, editable} = this.state;

        let infoCustomerModal = customer&&events&&!editable ? (
            <div>
                <Panel title="Customer Info">
                    <SemiDataTable
                        settings={{
                            table:{
                                selectable: false
                            },
                            header:{
                                displaySelectAll: false,
                                enableSelectAll: false,
                                adjustForCheckbox: false
                            },
                            body:{
                                displayRowCheckbox: false
                            },
                            fields:[
                                {
                                    title: 'Field',
                                    key: 'field',
                                    width: '20%'
                                },
                                {
                                    title: 'Value',
                                    key: 'value'
                                }
                            ]
                        }}
                        dataSource={customer} />
                </Panel>
                <Panel title="Appointment Info">
                    <SemiDataTable
                        settings={{
                            table:{
                                selectable: false
                            },
                            header:{
                                displaySelectAll: false,
                                enableSelectAll: false,
                                adjustForCheckbox: false
                            },
                            body:{
                                displayRowCheckbox: false
                            },
                            fields:[
                                {
                                    title: 'Start',
                                    key: 'start',
                                    width: '40%',
                                    custom(row){
                                        let start = new Date(row.start);
                                        let end = new Date(row.end);
                                        return <div>{`${start.getISODate()} (${start.getTimeAmPm()} - ${end.getTimeAmPm()})`}</div>;
                                    }
                                },
                                {
                                    title: 'Activity',
                                    key: 'Activity',
                                    width: '30%',
                                    custom(row){
                                        return <div>{row.sub_category.name}</div>;
                                    }
                                },
                                {
                                    title: 'Doctor',
                                    key: 'Doctor',
                                    width: '30%',
                                    custom(row){
                                        return <div>{row.slot.doctor.user.name}</div>;
                                    }
                                }
                                // {
                                //     title: 'Sale',
                                //     key: 'Sale',
                                //     custom(row){
                                //         return <div>{row.sale.name}</div>;
                                //     }
                                // }
                            ]
                        }}
                    dataSource={events} />
                </Panel>
            </div>
        ) : null;

        let editCustomerFormTemplate = editable ? {
            values: editable,
            components: [
                [{type: 'text', name: 'first_name', label: 'First Name', required: true}],
                [{type: 'text', name: 'last_name', label: 'Last Name', required: true}],
                [{type: 'numeric', name: 'hn', label: 'HN', required: true}],
                [{type: 'text', name: 'phone', label: 'Phone'}],
                [{type: 'text', name: 'contact', label: 'Contact'}],
                [{type: 'hidden', name: 'id'}]
            ]
        } : {};
        return (
            <div>
                <PageHeading title="Customer" description="Edit customer info and find customers' appointments" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={12}>
                            <Panel title="Customer">
                                <div className="con-pad">
                                    <SemiDataTable
                                        ref="tb"
                                        settings={{
                                            table:{
                                                selectable: false,
                                                multiSelectable: false
                                            },
                                            header:{
                                                displaySelectAll: false,
                                                enableSelectAll: false,
                                                adjustForCheckbox: false
                                            },
                                            body:{
                                                displayRowCheckbox: false
                                            },
                                            fields: [
                                                {
                                                    title: 'ID',
                                                    key: 'id',
                                                    sortable: true,
                                                    filterable: true,
                                                    width: '10%'
                                                },
                                                {
                                                    title: 'First Name',
                                                    key: 'first_name',
                                                    sortable: true,
                                                    filterable: true,
                                                },
                                                {
                                                    title: 'Last Name',
                                                    key: 'last_name',
                                                    sortable: true,
                                                    filterable: true,
                                                },
                                                {
                                                    title: 'Actions',
                                                    key: 'actions',
                                                    width: '10%',
                                                    custom: (row, index, dataSourceOptions,tableProps)=>{
                                                        return (
                                                            <div>
                                                                <IconButton onTouchTap={this.infoCustomerModal.bind(null, row.id)}>
                                                                    <ActionAssignment />
                                                                </IconButton>
                                                                <IconButton onTouchTap={this.editCustomerModal.bind(null, row.id)}>
                                                                    <ContentCreate />
                                                                </IconButton>
                                                            </div>
                                                        );
                                                    }
                                                }
                                            ],
                                            limit: 10
                                        }}
                                        pagination={true}
                                        dataSourceResult="data"
                                        dataSourceMap={{data: 'tbData', total: 'recordsTotal'}}
                                        dataSource="schedules/customers"
                                        />
                                </div>
                            </Panel>
                            <SemiModal ref="info" onClose={this.handleModalClose}>
                                {infoCustomerModal}
                            </SemiModal>
                            <SemiModal
                                ref="edit"
                                title="Customer Info"
                                onSubmit={this.handleEditSubmit}
                                onClose={this.handleModalClose}
                                formTemplate={editCustomerFormTemplate} />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

CustomerPage.propTypes = {};
CustomerPage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

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
)(CustomerPage);