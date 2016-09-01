import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import api from '../api';
import SemiDataTable from './widgets/SemiDataTable';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import IconButton from 'material-ui/IconButton';
import SemiModal from './widgets/SemiModal';

class CustomerPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            customer: null,
            events: null
        };
        this.showModal = this.showModal.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    showModal(customer){
        //this.context.modal
        //this.refs.modal.open();
        this.setState({customer});
        /*
        this.context.router.push({pathname: `/customers/${customer.id}`});
        this.refs.modal.open();
        */
        this.context.ajax.call("get", `schedules/customer-events/${customer.id}`, null).then((res)=>{
            this.setState({events: res.data.tbData});
            this.context.router.push({pathname: `/customers/${customer.id}`});
            this.refs.modal.open();
        }).catch((err)=>{
            console.log('err', err);
        });
    }
    handleModalClose(){
        this.setState({customer: null, events: null});
        //let {query} = this.props.location;
        //this.context.router.push({pathname: `customers`, query});
        this.context.router.go(-1);
    }

    render() {
        let {customer} = this.state;
        let mapKeys = {
            first_name: 'First Name',
            last_name: 'Last Name',
            hn: 'HN',
            phone: 'Phone',
            contact: 'Contact',
            boolean: 'Boolean (Test)'
        };
        let customerProfile = customer ? Object.keys(customer).map((i)=>{
            return {
                field: mapKeys[i],
                value: customer[i]
            }
        }).filter((row)=>row.field) : null;
        let modalTable = customer ? (
            <div>
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
                    dataSource={customerProfile} />
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
                                key: 'start'
                            },
                            {
                                title: 'End',
                                key: 'end'
                            }
                        ]
                    }}
                dataSource={this.state.events} />
            </div>
        ) : null;
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
                                                    custom: (row)=>{
                                                        return (
                                                            <IconButton onTouchTap={this.showModal.bind(null, row)}>
                                                                <ActionAssignment />
                                                            </IconButton>
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
                            <SemiModal ref="modal" onClose={this.handleModalClose}>
                                {modalTable}
                            </SemiModal>
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