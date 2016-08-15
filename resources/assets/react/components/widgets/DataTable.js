import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {ContentCreate,ActionDelete} from 'material-ui/svg-icons';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
    from 'material-ui/Table';

import ReactPaginate from 'react-paginate';

import api from '../../api';
import $ from 'jquery';

class DataTable extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            height: '300px',
            canSubmit:false,
            pageNum:0,
            perPage:10,
            offset:0,
            columns: [],
            order:[
                {
                    column:'id',
                    dir:'DESC'
                }
            ],
            alertText: '',
            listTable: {
                tbData: [],
                canEdit: false,
                recordsFiltered: 0,
                recordsTotal: 0
            }
        };
        this.linkTo = this.linkTo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.resetForm = this.resetForm.bind(this);

        this.getData = this.getData.bind(this);
        this.deleteData = this.deleteData.bind(this);
    }

    handlePageClick(data){
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        // console.log('[UserTypePage] (handlePageClick) ',selected,offset);
        this.setState({pageSelect: selected,offset: offset}, () => {
            this.getData(true,this.state.columns,this.state.order,this.state.offset);
        });
    }

    linkTo(pathname) {
        return this.context.router.push(pathname);
    }

    onChange(event){
        let colName = event.currentTarget.name;
        let colVal = event.currentTarget.value;
        let pushData = true ;
        // let newArray = this.state.columns.slice();
        let newArray = this.state.columns;
        // console.log('[UserTypePage] (onChange) newArray b4',newArray);
        for (let a in newArray) {
            if (newArray[a]['data'] == colName) {
                newArray[a]['search'] = colVal ;
                pushData = false ;
            }

        }
        if(pushData) {
            console.log('push data');
            let newData = {
                data: colName,
                search: colVal
            };
            newArray.push(newData);


        }
        let textFieldName = colName ;
        // console.log('[UserTypePage] (onChange) textFieldName',textFieldName);
        this.setState({textFieldName : event.target.value,columns: newArray,pageSelect: 0,offset: 0}, () => {
            this.getData(true,this.state.columns,this.state.order,this.state.offset,this.state.perPage);
        });
    }


    componentWillReceiveProps(nextProps){
        // console.log('[DataTable] (componentWillReceiveProps) this.props',this.props.dataTable);
        // console.log('[DataTable] (componentWillReceiveProps) nextProps',nextProps.dataTable);
    }

    resetForm() {
        this.refs.form.reset();
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
    getData(search,columns,order,offset){
        
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


        this.ajax('get', api.baseUrl(this.props.dataUrl+'?columns='+encodeURIComponent(JSON.stringify(columns))+'&order='+encodeURIComponent(JSON.stringify(order))+'&start='+offset+'&length='+this.state.perPage ), null,
            (response)=>{
                if(response.status=="success"){
                    let state = Object.assign({}, this.state, {listTable: response.data});
                    this.setState(state);
                    this.setState({pageNum: Math.ceil( response.data.recordsFiltered / this.state.perPage )});
                }
            },
            error=>{}
        );

    }

    deleteData(id){
        this.context.dialog.confirm('Are you sure?', 'Warning!', (confirmData) => {
            console.log('confirmData', confirmData);
            this.ajax('DELETE', api.baseUrl(this.props.dataUrl+'/'+id ), null,
                (response)=>{
                    if(response.status=="success"){
                        console.log('Delete Redirect');
                        this.getData();
                    }
                },
                error=>{}
            );
        });

    }


    render() {
        const {dataColumn} = this.props ;
        let dataTable = this.state.listTable;
        // console.log('dataColumn:',dataColumn);
        // console.log('dataTable:',dataTable);
        return (
            <div >
                <form  ref="form">
                    <Table
                        fixedHeader={this.state.fixedHeader}
                        fixedFooter={this.state.fixedFooter}
                        selectable={this.state.selectable}
                        multiSelectable={this.state.multiSelectable}
                        headerStyle={{borderBottom : '1px solid #ccc'}}
                    >
                        <TableHeader
                            displaySelectAll={this.state.showCheckboxes}
                            adjustForCheckbox={this.state.showCheckboxes}
                            enableSelectAll={this.state.enableSelectAll}
                            style={{borderBottom : 'none'}}
                        >
                            <TableRow key="headerRow" style={{borderBottom : 'none'}} >
                                {dataColumn.map( (column, index) => (
                                    <TableHeaderColumn key={index} style={{width:column.width}}>{column.col} <br />
                                        <TextField
                                            type="text" name={column.col}
                                            hintText={'Search by '+column.col}
                                            onChange={this.onChange}
                                            fullWidth={true}
                                        />
                                    </TableHeaderColumn>
                                ))}

                                {dataTable.canEdit ?
                                    <TableHeaderColumn style={{width:'10%'}}>Status
                                    </TableHeaderColumn>
                                    :
                                    ""
                                }
                            </TableRow>

                        </TableHeader>
                        <TableBody
                            displayRowCheckbox={this.state.showCheckboxes}
                            deselectOnClickaway={this.state.deselectOnClickaway}
                            showRowHover={this.state.showRowHover}
                            stripedRows={this.state.stripedRows}
                        >
                            {dataTable.tbData.map( (row, index) => (
                                <TableRow key={index} selected={row.selected} >
                                    {dataColumn.map( (column, index) => (
                                        <TableRowColumn key={index} style={{width:column.width}} >{row[column.col]}</TableRowColumn>
                                    ))}
                                    {dataTable.canEdit ?
                                        <TableRowColumn style={{width:'10%'}}>{row.status}
                                            <IconButton tooltip="Edit" tooltipPosition="top-center" backgroundColor="#F00"  onClick={this.linkTo.bind(null,this.props.clientPath+'/'+row.id)}>
                                                <ContentCreate />
                                            </IconButton>
                                            <IconButton tooltip="Delete" tooltipPosition="top-center" onClick={this.deleteData.bind(null,row.id)}>
                                                <ActionDelete />
                                            </IconButton>
                                        </TableRowColumn>
                                        :
                                        ""
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter
                            adjustForCheckbox={this.state.showCheckboxes}
                        >
                            <TableRow>
                                <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                                </TableRowColumn>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </form>
                {this.state.pageNum>0 ?
                    <div className="pagination">
                        <ReactPaginate previousLabel={"previous"}
                                       nextLabel={"next"}
                                       breakLabel={"..."}
                                       pageNum={this.state.pageNum}
                                       marginPagesDisplayed={1}
                                       pageRangeDisplayed={3}
                                       clickCallback={this.handlePageClick}
                                       activeClassName="active"
                                       disabledClassName="disable"
                                       forceSelected={this.state.pageSelect}
                        />
                    </div>
                    : ""
                }
            </div>
        );
    }
}

DataTable.propTypes = {
    dataColumn:PropTypes.array,
    dataUrl:PropTypes.string.isRequired,
    clientPath:PropTypes.string
};

DataTable.contextTypes = {
    router: PropTypes.object.isRequired,
    dialog: PropTypes.object.isRequired
};

const style = {
    dialogTitleError:{
        backgroundColor: '#C62828',
        color: '#FFFFFF'
    }
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(
    mapStateToProps,null,null,{ withRef: true }
)(DataTable);



