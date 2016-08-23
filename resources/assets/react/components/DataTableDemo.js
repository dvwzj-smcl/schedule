import React, { Component, PropTypes } from 'react';
import api from '../api';
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
                <SemiDataTable settings={{
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
                            title: "Name",
                            key: "name",
                            custom: (row,index)=>row.user.name
                        },
                        {
                            title: "Email",
                            tooltip: "Email (tooltip)",
                            key: "email",
                            custom: (row,index)=>row.user.email
                        }
                    ],
                    limit: 1
                }}
                pagination={true}
                dataSourceResult="doctors"
                dataSource={api.baseUrl("calendar/doctors")} />
            </div>
        );
    }
}

DataTableDemo.propTypes = {};

export default DataTableDemo;