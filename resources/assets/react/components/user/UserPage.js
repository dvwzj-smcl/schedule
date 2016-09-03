import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import SemiDataTable from '../widgets/SemiDataTable';
import {TableRowColumn} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import {ContentAdd,ContentCreate, ActionAutorenew,ActionDelete} from 'material-ui/svg-icons';
import SemiButton from '../widgets/SemiButton';
import api from '../../api';
class UserPage extends Component {
    constructor(props) {
        super(props);
    }

    getChildContext() {
        return { dataTable: this.refs.tb }
    }

    editUser = (user_id) =>{
        this.context.router.push("/users"+'/'+user_id)
    };

    deleteUser = (user_id) => {
        this.context.dialog.confirm('Are you sure?', 'Delete', (confirm)=> {
            if (confirm) {
                this.context.ajax.call('delete', `users/${user_id}`, null).then(response => {
                    this.context.dialog.alert('User deleted', 'Success', 'success');
                    this.refs.tb.handleReload();
                }).catch(error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }
        });
    };

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
                                    ref="tb"
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
                                                width: '10%',
                                                sortable: true
                                            },
                                            {
                                                title: "Username",
                                                key: "username"
                                            },
                                            {
                                                title: "Email",
                                                tooltip: "Email (tooltip)",
                                                key: "email"
                                            },
                                            {
                                                title: "Role",
                                                key: "role_name",
                                            },
                                            {
                                                title: "Branch",
                                                key: "branch_name",
                                            },
                                            {
                                                title: "Actions",
                                                key: 'action',
                                                width: '10%',
                                                custom: (row,index,tbDataProps)=>{
                                                    //console.log('tbDataProps', tbDataProps);
                                                    return (
                                                        <div>
                                                            <IconButton backgroundColor="#F00" onClick={this.editUser.bind(null, row.id)} >
                                                                <ContentCreate />
                                                            </IconButton>
                                                            <IconButton onClick={this.deleteUser.bind(null, row.id)}>
                                                                <ActionDelete />
                                                            </IconButton>
                                                        </div>
                                                    );
                                                }
                                            }
                                        ],
                                        order: [{"column":"id","dir":"DESC"}],
                                        limit: 10
                                    }}
                                    pagination={true}
                                    dataSourceResult="data"
                                    dataSourceMap={{data: "tbData", total: "recordsTotal"}}
                                    dataSource="users"
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
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};
UserPage.childContextTypes = {
    dataTable: PropTypes.object
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(
    mapStateToProps
)(UserPage);

