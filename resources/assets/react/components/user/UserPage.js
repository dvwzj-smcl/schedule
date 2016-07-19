
import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {browserHistory} from 'react-router';
import {Grid, Row, Col} from 'react-flexbox-grid';

//widget
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';

import AlertBox from '../widgets/AlertBox';
import DataTable from '../widgets/DataTable';

import {ContentAdd,ContentCreate, ActionAutorenew,ActionDelete} from 'material-ui/svg-icons';
import RaisedButton from 'material-ui/RaisedButton';
import SemiButton from '../semi/SemiButton';
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

import api from '../../api';
import $ from 'jquery';

class UserPage extends Component {
    constructor(props) {
        // console.log('789789', 789789);
        super(props);
        this.state = {
            dataTableColumn:[
                {
                    col:'id',
                    width:'10%'
                },
                {
                    col:'email',
                    width:'60%'
                }
            ],
            openAlertBox: false,
            alertText: '',
            listTable: {
                    tbData: [],
                    canEdit: false,
                    recordsFiltered: 0,
                    recordsTotal: 0
                }
        };

        this.reloadPage = this.reloadPage.bind(this);
        this.getData = this.getData.bind(this);

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);


        this.deleteData = this.deleteData.bind(this);

        this.handlePageClick = this.handlePageClick.bind(this);

        // this.onChange = this.onChange.bind(this);
    }

    componentWillMount(){
        // console.log('componentWillMount');
    }

    componentDidMount(){
        // console.log('componentDidMount');
        this.getData();
    }

    componentWillReceiveProps(nextProps){
        // console.log('[UserPage] (componentWillReceiveProps) this.props',this.props.user);
        // console.log('[UserPage] (componentWillReceiveProps) nextProps',nextProps.user);
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

    deleteData(id){
        // console.log('[UserPage] deleteData');
        this.ajax('DELETE', api.baseUrl('/usertype/'+id ), null,
            (response)=>{
                if(response.status=="success"){
                    console.log('Delete Redirect');
                    this.getData();
                }
            },
            error=>{}
        );
    }

    reloadPage(){
        // console.log('[UserPage] (reloadPage)');

        this.getData();
        this.refs['db'].getWrappedInstance().resetForm();
        // this.refs['db'].connect.refs.resetForm() ;
    }

    getData(search,columns,order,offset,perPage){
        // console.log('[UserPage] (getData) state',this.state);


        // console.log('getData',columns,order,offset,perPage);


        if (typeof search === "undefined" ){
            search=false;
        }
        if (typeof columns === "undefined" ){
            columns = [];
        }
        if (typeof order === "undefined" ){
            order = [
                {
                    column:'id',
                    dir:'DESC'
                }
            ];
        }
        if (typeof offset === "undefined" ){
            offset = 0 ;
        }
        if (typeof perPage === "undefined" ){
            perPage = 2;
        }


        // let data = {
        //     columns : encodeURIComponent(JSON.stringify(columns)),
        //     order : encodeURIComponent(JSON.stringify(order)),
        //     start : offset,
        //     length : perPage
        // };

        this.ajax('get', api.baseUrl('/user?columns='+encodeURIComponent(JSON.stringify(columns))+'&order='+encodeURIComponent(JSON.stringify(order))+'&start='+offset+'&length='+perPage ), null,
            (response)=>{
               if(response.status=="success"){
                       let state = Object.assign({}, this.state, {listTable: response.data});
                   this.setState(state);
               }
            },
            error=>{}
        );

    }

    handleOpen(){
        console.log('open Box');
        this.setState({openAlertBox: true});
    }

    handleClose(){
        this.setState({openAlertBox: false});
    }

    handlePageClick(data){
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        // console.log('[UserPage] (handlePageClick) ',selected,offset);
        this.setState({pageSelect: selected,offset: offset}, () => {
            this.getData(true);
        });
    }

    ajax(method, url, data, success, error){
        data = JSON.stringify(data);
        let state = Object.assign({}, this.state, {loading: true});
        this.setState(state);
        let access_token = this.props.user.access_token;
        // console.log('access_token',access_token);
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
            if (response.status == "error"){
                this.setState({alertText: response.data.error});
                this.handleOpen();
            }
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }


    render() {

        // console.log('this.state',this.state);
        // console.log('[UserPage] user :',user);
        return (
            <div>
                <AlertBox
                    openAlertBox={this.state.openAlertBox}
                    alertText={this.state.alertText}
                    alertFunction={this.handleClose}
                />
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
                                    dataTable={this.state.listTable}
                                    linkEditPath={'user-type/'}
                                    getDataFunc={this.getData}
                                    deleteDataFunc={this.deleteData}
                                    dataColumn={this.state.dataTableColumn}
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

