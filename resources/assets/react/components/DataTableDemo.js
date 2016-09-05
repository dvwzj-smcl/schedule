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
                                            /*
                                                table: // object, Table properties for <Table> (mui),
                                                header: // object, TableHeader properties for <TableHeader> (mui),
                                                body: // object, TableBody properties for <TableBody> mui,
                                                fields: [ // array, limited column(s) to show
                                                    {
                                                        title: // required, but can be empty string (''),
                                                        key: // row's key for show value,
                                                        sortable: // optional, use for order,
                                                        filterable: // optional, use for filter column(s) value
                                                    }
                                                ],
                                                actions: {
                                                    // key: props (can be boolean for reload , others with object or element)
                                                    keyName: { // optional with prepared <FlatButton>
                                                        label // optional, default=keyName
                                                        onClick // optional
                                                        style // optional
                                                    },
                                                    create: {onClick:()=>{}},
                                                    reload: true,
                                                    div: <div>Div Element</div>,
                                                    raiseBtn: <RaiseButton label="Raise" onClick={()=>{}} />,
                                                    emptyObj: {}
                                                }
                                                limit: // can be false for display all row(s), or (positive) decimal number
                                            */
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