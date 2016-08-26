import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import api from '../../api';
import SemiDataTable from '../widgets/SemiDataTable';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import IconButton from 'material-ui/IconButton';
import SemiModal from '../widgets/SemiModal';

class CustomerPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    showModal(customer){
        //this.context.modal
        //this.refs.modal.open();
        this.context.router.push({pathname: `customers/${customer.id}`});
    }

    render() {
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
                                                    style: {width: '10%'}
                                                },
                                                {
                                                    title: 'Name',
                                                    key: ['first_name','last_name'],
                                                    sortable: true,
                                                    custom: (row)=>{
                                                        return row.first_name+' '+row.last_name;
                                                    }
                                                },
                                                {
                                                    title: 'Actions',
                                                    key: 'actions',
                                                    style: {width: '10%'},
                                                    custom: (row)=>{
                                                        return (
                                                            <IconButton onTouchTap={this.showModal.bind(null, row)}>
                                                                <ActionAssignment />
                                                            </IconButton>
                                                        );
                                                    }
                                                }
                                            ]
                                        }}
                                        path="customers"
                                        location={this.props.location}
                                        pagination={true}
                                        limit={10}
                                        dataSourceResult="data"
                                        dataSourceMap={{data: 'tbData', total: 'recordsTotal'}}
                                        dataSource={api.baseUrl('schedules/customers')}
                                        />
                                </div>
                            </Panel>
                            {this.props.children}
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

CustomerPage.propTypes = {};
CustomerPage.contextTypes = {
    router: PropTypes.object.isRequired
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