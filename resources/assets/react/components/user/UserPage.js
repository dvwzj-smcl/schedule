
import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';

//widget
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';


import DataTable from '../widgets/DataTable';

import SemiDataTable from '../widgets/SemiDataTable';
import {TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';

import {ContentAdd,ContentCreate, ActionAutorenew,ActionDelete} from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import SemiButton from '../widgets/SemiButton';
import {fullWhite} from 'material-ui/styles/colors';

import api from '../../api';
// import IconButton from 'material-ui/IconButton';
// import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
//     from 'material-ui/Table';


// import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


// import ReactPaginate from 'react-paginate';


// Forms
// import SemiText from '../forms/SemiText';
// import SemiForm from '../forms/SemiForm';
// import ErrorMessage from '../forms/ErrorMessage';

// Formsy



class UserPage extends Component {
    constructor(props) {

        super(props);
        this.state = {
            dataTableColumn:[
                {
                    col:'id',
                    width:'10%'
                },
                {
                    col:'email',
                    width:'40%'
                },
                {
                    col:'role_name',
                    width:'40%'
                }
            ]
        };
        this.reloadPage = this.reloadPage.bind(this);
        this.editUser = this.editUser.bind(this);
    }

    componentWillMount(){
        // console.log('componentWillMount');
    }

    componentDidMount(){
    }

    componentWillReceiveProps(nextProps){
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true ;
    }

    reloadPage(){
    }

    editUser(user_id){
        this.context.router.push("/users"+'/'+user_id)
    }

    render() {

        console.log('this.state',this.state);
        // console.log('[UserPage] user :',user);
        return (
            <div>
                <PageHeading title="User" description="จัดการ User" />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={12}>
                            <Panel title="User Type">
                                <div className="con-pad">
                                    <div className="button-group">
                                        <SemiButton
                                            semiType="add"
                                            label="Add New"
                                            link="/users/create"
                                            />
                                        <SemiButton
                                            semiType="refresh"
                                            label="Reload"
                                            onClick={this.reloadPage}
                                            />
                                    </div>
                                </div>
                                <SemiDataTable
                                    ref="db"
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
                                                title: "ID",
                                                key: "id",
                                                sortable: true
                                            },
                                            {
                                                title: "Email",
                                                tooltip: "Email (tooltip)",
                                                key: "email"
                                            },
                                            {
                                                title: "Role",
                                                key: "role_name"
                                            },
                                            {
                                                title: "Actions",
                                                key: 'action',
                                                custom: (row,index,tbDataProps)=>{
                                                    return tbDataProps.editable ? (
                                                        <div>
                                                            <IconButton backgroundColor="#F00" onClick={this.editUser.bind(null, row.id)} >
                                                                <ContentCreate />
                                                            </IconButton>
                                                            <IconButton>
                                                                <ActionDelete />
                                                            </IconButton>
                                                        </div>
                                                    ) : null;
                                                }
                                            }
                                        ],
                                        order: [{"column":"id","dir":"DESC"}],
                                        limit: 4
                                    }}
                                    path="users"
                                    location={this.props.location}
                                    pagination={true}
                                    dataSourceResult="data"
                                    dataSourceMap={{data: "tbData", total: "recordsTotal"}}
                                    dataSource={api.baseUrl("users")}
                                    />
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
                {this.props.children}
            </div>
        );
    }
}
UserPage.propTypes = {
    user: PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ])
};
UserPage.contextTypes = {
    router: PropTypes.object.isRequired
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(
    mapStateToProps
)(UserPage);

