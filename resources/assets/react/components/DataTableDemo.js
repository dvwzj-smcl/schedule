import React, { Component, PropTypes } from 'react';
import api from '../api';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import SemiDataTable from './widgets/SemiDataTable';

const data = [
    {
        name: 'John Smith',
        status: 'Employed',
        selected: true
    },
    {
        name: 'Randal White',
        status: 'Unemployed'
    },
    {
        name: 'Stephanie Sanders',
        status: 'Employed',
        selected: true
    },
    {
        name: 'Steve Brown',
        status: 'Employed'
    },
    {
        name: 'Joyce Whitten',
        status: 'Employed'
    },
    {
        name: 'Samuel Roberts',
        status: 'Employed'
    },
    {
        name: 'Adam Moore',
        status: 'Employed'
    }
];

class DataTableDemo extends Component {
    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return (
            <div>
                <PageHeading title="Request" description="description" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={9}>
                            <Panel title="SemiDataTable">
                                <div className="con-pad">
                                    <SemiDataTable
                                        settings={{
                                           table:{
                                                selectable: true,
                                                multiSelectable: false
                                            },
                                            header:{
                                                displaySelectAll: true,
                                                enableSelectAll: true,
                                                adjustForCheckbox: true
                                            },
                                            body:{
                                                displayRowCheckbox: true
                                            },
                                            fields:[
                                                {
                                                    title: "HN",
                                                    key: "hn",
                                                    sortable: true,
                                                    filterable: true,
                                                    width: '100px'
                                                },
                                                {
                                                    title: "First Name",
                                                    key: "first_name",
                                                    sortable: true,
                                                    filterable: true
                                                },
                                                {
                                                    title: "Last Name",
                                                    key: "last_name",
                                                    sortable: true,
                                                    filterable: true
                                                },
                                                {
                                                    title: "Bool",
                                                    key: "boolean"
                                                }
                                            ],
                                            limit: 10
                                        }}
                                        pagination={true}
                                        dataSourceResult="data"
                                        dataSourceMap={{data: 'tbData', total: 'recordsTotal'}}
                                        dataSource="schedules/customers" />
                                </div>
                            </Panel>
                        </Col>
                        <Col md={3}>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

DataTableDemo.propTypes = {};

export default DataTableDemo;