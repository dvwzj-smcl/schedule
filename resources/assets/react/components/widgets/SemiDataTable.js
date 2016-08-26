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

import IconButton from 'material-ui/IconButton';
import VerticalAlignBottomIcon from 'material-ui/svg-icons/editor/vertical-align-bottom';
import VerticalAlignTopIcon from 'material-ui/svg-icons/editor/vertical-align-top';
import SortIcon from 'material-ui/svg-icons/content/sort';

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
        let page = parseInt(props.location ? props.location.query.page || 1 : 1);
        this.state = {
            page,
            data: [],
            total: 0,
            editable: false
        };
        this.loaded = false;
        this.handleChangePage = this.handleChangePage.bind(this);
        this.sort = this.sort.bind(this);
    }
    componentDidMount(){
        //var loading = setInterval(()=>{
            //console.log('loaded', this.loaded);
            //if(this.loaded) clearInterval(loading);
            let page = parseInt(this.props.location ? this.props.location.query.page || 1 : this.state.page);
            this.handleChangePage(page);
        //}, 1000);
    }
    componentDidUpdate(){
        //
    }
    //shouldComponentUpdate(nextProps, nextState){
        //console.log(nextState.page!==this.state.page, nextState.data!==this.state.data, nextState.total!==this.state.total, nextState.loading!==this.state.loading);
        //console.log(nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading);
        //return nextState.page!==this.state.page || nextState.data!==this.state.data || nextState.total!==this.state.total || nextState.loading!==this.state.loading;
    //}
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
    handleAjaxData(page, options){
        let p = new Promise((resolve, reject)=>{
            let order = [];
            let columns = [];
            let propOrder = (options ? options.order : this.props.settings.order || []);
            let propColumns = (options ? options.columns : this.props.settings.columns||[]);
            for(let i in propOrder){
                order.push(propOrder[i]);
            }
            for(let i in propColumns){
                columns.push(propColumns[i]);
            }
            let params = {
                start: encodeURIComponent(JSON.stringify((page-1)*(this.props.settings.limit || 10))),
                length: encodeURIComponent(JSON.stringify(this.props.settings.limit || 10)),
                order: JSON.stringify(order),
                columns: JSON.stringify(columns)
            };
            this.ajax('get', this.props.dataSource, params, (res)=>{
                let r = this.props.dataSourceResult;
                let data = {
                    data: res[r] ? res[r][this.props.dataSourceMap&&this.props.dataSourceMap.data ? this.props.dataSourceMap.data : 'data'] : [],
                    total: res[r] ? res[r][this.props.dataSourceMap&&this.props.dataSourceMap.total ? this.props.dataSourceMap.total : 'total'] : 0,
                    canEdit: res[r] ? res[r].canEdit : false
                };
                resolve(data);
            },(err)=>{
                reject(err);
            });
        });
        p.then((result)=>{
            this.setState({page, data: result.data, total: result.total, editable: result.canEdit});
            let order = options&&options.order ? options.order.map((field)=>[field.column,field.dir].join(':')).join(',') : null;
            let query = order ? {page, order} : {page};
            this.context.router.push({pathname: this.props.path || this.props.location&&this.props.location.pathname, query});
        });
    }
    handleChangePage(page, options){
        if(typeof this.props.dataSource=='object') {
            this.setState({page});
            this.context.router.push({pathname: this.props.path || this.props.location&&this.props.location.pathname, query:{page}});
        }else{
            /*
            this.setState({loading: true});
            this.handleAjaxData(page, (data, total)=>{
                this.setState({page, data, total, loading: false});
            });
            */
            let defaultOptions = {
                order: this.props.location&&this.props.location.query.order ? this.props.location.query.order.split(',').map((field)=>{
                    let f = field.split(':');
                    return {
                        column: f[0],
                        dir: f[1]
                    }
                }) : null
            };

            options = Object.assign(defaultOptions, options);

            this.handleAjaxData(page, options);
        }
        //console.log('call', );

    }
    sort(field){
        if(field.sortable) {
            let key = typeof field.key == 'object' ? field.key.map((k)=>k+':asc').join(',') : field.key+':asc';
            let re = new RegExp(key, 'gi');
            let dir = (this.props.location.query.order&&this.props.location.query.order.match(re) ? 'desc' : 'asc') || 'asc';
            //let order = [field.key, dir].join(':');
            //this.context.router.push({pathname: this.props.path || this.props.location.pathname, query:{page:1, order}});
            let options = {
                order: typeof field.key == 'object' ? field.key.map((k)=>{return {column: k, dir}}) : [{column: field.key, dir}]
            };
            this.handleChangePage(1, options);
        }
    }
    goToPage(page){
        this.handleChangePage(page);
    }
    render() {
        let order = this.props.location&&this.props.location.query.order ? (options=>{
            return {
                column: options.map((f)=>f.column),
                dir: options.map((f)=>f.dir).reduce((a,b)=>b)
            }
        })(
            this.props.location ? this.props.location.query.order.split(',').map((field)=>{
                let f = field.split(':');
                return {
                    column: f[0],
                    dir: f[1]
                }
            }) : []
        ) : null;
        // console.log('render', this.state);
        let {table,header,body,fields,limit} = this.props.settings;
        limit = limit || 10;
        const offset = limit==false ? 0 : (this.state.page-1)*limit;
        let data = typeof this.props.dataSource=='object' ? this.props.dataSource : this.state.data;
        let total = typeof this.props.dataSource=='object' ? this.props.dataSource.length : this.state.total;
        if(!fields || fields.length==0){
            fields = [];
            for(let i in data) for(let j in data[i]) if(fields.indexOf(j)==-1) fields.push(j);
        }
        let pages = [];
        let max_page = limit==false ? 1 : Math.ceil(total/limit);
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
        if(typeof this.props.dataSource=='object' && limit!=false) {
            rows = rows.slice(offset,offset+limit);
        }
        return (
            <Paper>
                <Table
                    {...table} >
                    <TableHeader
                        {...header}
                        >
                        {/*
                        <TableRow>
                            <TableHeaderColumn colSpan={Object.keys(fields).length} tooltip="Super Header" style={{textAlign: 'center'}}>
                                Super Header
                            </TableHeaderColumn>
                        </TableRow>
                        */}
                        <TableRow>
                            {fields.map((field, i)=> {
                                let sortable = JSON.stringify(order&&order.column)==JSON.stringify(field.key) || order&&order.column==field.key;
                                return (
                                    <TableHeaderColumn key={i} tooltip={
                                    (field.tooltip||field.title)
                                    +
                                    (
                                    field.sortable ? ' (' + (sortable ? ('Sorted: ' + (order.dir.match(/asc/gi) ? 'ASC':'DESC')) : 'Sortable') +')' : ''
                                    )} style={field.style}>
                                        <div onTouchTap={this.sort.bind(null,field)}>
                                            <FlatButton
                                                disabled={true}
                                                label={field.title}
                                                labelPosition="before"
                                                style={{cursor: field.sortable ? 'pointer' : 'default' }}
                                                icon={field.sortable ? (sortable ? (order.dir.match(/asc/gi) ? <VerticalAlignTopIcon /> : <VerticalAlignBottomIcon /> ) : <SortIcon />) : null}
                                                />
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
                                        <TableRowColumn key={i} style={field.style}>{row[field.key]}</TableRowColumn>
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
SemiDataTable.contextTypes = {
    router: PropTypes.object.isRequired
};
export default SemiDataTable;