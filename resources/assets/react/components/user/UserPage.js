
import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';

//widget
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';


import DataTable from '../widgets/DataTable';

import {ContentAdd,ContentCreate, ActionAutorenew,ActionDelete} from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import SemiButton from '../widgets/SemiButton';
import {fullWhite} from 'material-ui/styles/colors';
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
            ],
          
        };
        this.reloadPage = this.reloadPage.bind(this);
    }

    componentWillMount(){
        // console.log('componentWillMount');
    }

    componentDidMount(){
        // console.log('componentDidMount');
        let access_token = this.props.user.access_token;
        if (typeof access_token !== "undefined" )
            this.refs['db'].getWrappedInstance().getData();
    }

    componentWillReceiveProps(nextProps){
    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('shouldComponentUpdate nextProps',nextProps);
        // let updateComponent = false;
        // // ถ้า ค่า prop ปัจจุบัน !== ค่า prop ก่อนหน้า ให้ อัพเดท
        // if ((this.props.user!==nextProps.user) || (this.state.canSubmit !== nextState.canSubmit) ){
        //     updateComponent = true ;
        // }
        // return updateComponent ;
        return true ;
    }

    reloadPage(){
        // console.log('[UserPage] (reloadPage)');
        this.refs['db'].getWrappedInstance().getData();
        this.refs['db'].getWrappedInstance().resetForm();
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
                                <DataTable
                                    ref="db"
                                    dataColumn={this.state.dataTableColumn}
                                    dataUrl={'/users'}
                                    clientPath={'/users'}
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

