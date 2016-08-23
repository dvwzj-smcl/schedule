import React, { Component, PropTypes } from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
    from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import $ from 'jquery';

import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

import UltimatePaginationMaterialUi from 'react-ultimate-pagination-material-ui';

const styles = {
    propContainer: {
        width: 200,
        overflow: 'hidden',
        margin: '20px auto 0'
    },
    propToggleHeader: {
        margin: '20px auto 10px'
    }
};

class SemiDataTable extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            page: 1,
            data: [],
            total: 0,
            editable: false,
            loading: false
        };
        this.loaded = false;
        this.handleChangePage = this.handleChangePage.bind(this);
        this.sort = this.sort.bind(this);
    }
    componentDidMount(){
        //var loading = setInterval(()=>{
            //console.log('loaded', this.loaded);
            //if(this.loaded) clearInterval(loading);
            this.handleChangePage(this.state.page);
        //}, 1000);
    }
    shouldComponentUpdate(nextProps, nextState){
        //console.log(nextState.page!==this.state.page, nextState.data!==this.state.data, nextState.total!==this.state.total, nextState.loading!==this.state.loading);
        //console.log(nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading);
        return nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading;
    }
    ajax(method, url, data, success, error){
        //data = JSON.stringify(data);
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }
    handleAjaxData(page, callback){
        let p = new Promise((resolve, reject)=>{
            this.setState({loading: true});
            let order = [];
            let columns = [];
            let propOrder = (this.props.settings.order||[]);
            let propColumns = (this.props.settings.columns||[]);
            for(let i in propOrder){
                order.push(propOrder[i]);
            }
            for(let i in propColumns){
                columns.push(propColumns[i]);
            }
            let params = {
                start: encodeURIComponent(JSON.stringify(page - 1)),
                length: encodeURIComponent(JSON.stringify(this.props.settings.limit || 10)),
                order: JSON.stringify(order),
                columns: JSON.stringify(columns)
            };
            this.ajax('get', this.props.dataSource, params, (res)=>{
                let r = this.props.dataSourceResult;
                resolve({
                    data: res[r] ? res[r][this.props.dataSourceMap.data ? this.props.dataSourceMap.data : 'data'] : [],
                    total: res[r] ? res[r][this.props.dataSourceMap.total ? this.props.dataSourceMap.total : 'total'] : 0,
                    canEdit: res[r] ? res[r].canEdit : false
                });
            },(err)=>{
                reject(err);
            });
        });
        p.then((result)=>{
            this.setState({page, data: result.data, total: result.total, editable: result.canEdit, loading: false, loaded: true});
        });
    }
    handleChangePage(page){
        if(this.state.dataType=='object') {
            this.setState({page});
        }else{
            /*
            this.setState({loading: true});
            this.handleAjaxData(page, (data, total)=>{
                this.setState({page, data, total, loading: false});
            });
            */
            this.handleAjaxData(page);
        }
    }
    sort(field){
        console.log(field);
    }
    render() {
        console.log('render', this.state);
        let {table,header,body,fields,limit} = this.props.settings;
        limit = limit || 10;
        const offset = (this.state.page-1)*limit;
        let data = this.state.data;
        let total = this.state.total;
        if(!fields || fields.length==0){
            fields = [];
            for(let i in data) for(let j in data[i]) if(fields.indexOf(j)==-1) fields.push(j);
        }
        let pages = [];
        let max_page = Math.ceil(total/limit);
        for(let i=1;i<=max_page;i++){
            pages.push(i);
        }
        let rows = data.map((row, index)=>{
            let obj = {};
            for(let i in fields){
                let key = fields[i];
                if(typeof key == "string") obj[key] = row[key];
                else if(typeof key == "object"){
                    if(key.key) obj[key.key] = row[key.key];
                    if(key.custom) obj[key.key] = key.custom(row,index,{editable: this.state.editable});
                    if(key.tooltip) fields[i].tooltip = key.tooltip;
                }
            }
            return obj;
        });
        if(typeof this.props.data=='object') {
            rows = rows.slice(offset,offset+limit);
        }
        return (
            <Paper>
                <Table
                    {...table} >
                    <TableHeader
                        {...header}
                        >
                        <TableRow>
                            <TableHeaderColumn colSpan={Object.keys(fields).length} tooltip="Super Header" style={{textAlign: 'center'}}>
                                Super Header
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            {fields.map((field, i)=> {
                                return (
                                    <TableHeaderColumn key={i} tooltip={field.tooltip||field.title}>
                                        <div onClick={this.sort.bind(null,field)}>
                                            {field.title}
                                        </div>
                                    </TableHeaderColumn>
                                )
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        {...body}
                        >
                        {rows.map( (row, index) => (
                            <TableRow key={index} selected={row.selected}>
                                {fields.map((field, i)=> {
                                    return (
                                        <TableRowColumn key={i}>{row[field.key]}</TableRowColumn>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{display: typeof this.props.pagination=='boolean' ? (this.props.pagination==true?'block':'none'):'none'}}>
                    <UltimatePaginationMaterialUi currentPage={this.state.page} totalPages={max_page} onChange={this.handleChangePage} />
                </div>
            </Paper>
        );
    }
}

SemiDataTable.propTypes = {};

export default SemiDataTable;