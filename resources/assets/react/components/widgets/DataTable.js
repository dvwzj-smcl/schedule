import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {ContentCreate,ActionDelete} from 'material-ui/svg-icons';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
    from 'material-ui/Table';

import ReactPaginate from 'react-paginate';


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
            perPage:1,
            offset:0,
            columns: [],
            order:[
                {
                    column:'id',
                    dir:'DESC'
                }
            ]
        };
        this.linkTo = this.linkTo.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    handlePageClick(data){
        let selected = data.selected;
        let offset = Math.ceil(selected * this.state.perPage);
        // console.log('[UserTypePage] (handlePageClick) ',selected,offset);
        this.setState({pageSelect: selected,offset: offset}, () => {
            this.props.getDataFunc(true,this.state.columns,this.state.order,this.state.offset,this.state.perPage);
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
            this.props.getDataFunc(true,this.state.columns,this.state.order,this.state.offset,this.state.perPage);
        });
    }


    componentWillReceiveProps(nextProps){
        // console.log('[DataTable] (componentWillReceiveProps) this.props',this.props.dataTable);
        // console.log('[DataTable] (componentWillReceiveProps) nextProps',nextProps.dataTable);
        this.setState({pageNum: Math.ceil( nextProps.dataTable.recordsFiltered / this.state.perPage )});
    }

    resetForm() {
        this.refs.form.reset();
    }

    render() {
        const {dataTable,dataColumn} = this.props ;
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



                            <TableRow style={{borderBottom : 'none'}} >
                                {dataColumn.map( (column, index) => (
                                    <TableHeaderColumn style={{width:column.width}}>{column.col} <br />
                                        <TextField
                                            type="text" name={column.col}
                                            hintText={'Search by'+column.col}
                                            onChange={this.onChange}
                                            fullWidth={true}
                                        />
                                    </TableHeaderColumn>
                                ))}

                                {dataTable.canEdit ?
                                    <TableHeaderColumn style={{width:'30%'}}>Status
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
                                        <TableRowColumn style={{width:column.width}} >{row[column.col]}</TableRowColumn>
                                    ))}
                                    {dataTable.canEdit ?
                                        <TableRowColumn style={{width:'30%'}}>{row.status}
                                            <IconButton tooltip="Edit" tooltipPosition="top-center" backgroundColor="#F00"  onClick={this.linkTo.bind(null,this.props.linkEditPath+row.id)}>
                                                <ContentCreate />
                                            </IconButton>
                                            <IconButton tooltip="Delete" tooltipPosition="top-center" onClick={this.props.deleteDataFunc.bind(null,row.id)}>
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

            </div>
        );
    }
}

DataTable.propTypes = {
    dataTable: PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]).isRequired,
    linkEditPath:PropTypes.string.isRequired,
    deleteDataFunc:PropTypes.func,
    getDataFunc:PropTypes.func,
    dataColumn:PropTypes.array
};

DataTable.contextTypes = {
    router: PropTypes.object.isRequired
};

const style = {
    dialogTitleError:{
        backgroundColor: '#C62828',
        color: '#FFFFFF'
    }
};
function mapStateToProps(state, ownProps){
    // console.log('[DataTable] (mapStateToProps) state',state,ownProps);

    return {
        routing: state.routing
    };
}

export default connect(
    mapStateToProps,null,null,{ withRef: true }
)(DataTable);



