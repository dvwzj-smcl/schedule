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
            order: null,
            columns: null,
            editable: false
        };
        this.handleChangePage = this.handleChangePage.bind(this);
        this.sort = this.sort.bind(this);
        this.filter = this.filter.bind(this);
    }
    componentDidMount(){
        //var loading = setInterval(()=>{
            //console.log('loaded', this.loaded);
            //if(this.loaded) clearInterval(loading);
        let page = parseInt(this.props.location ? this.props.location.query.page || 1 : this.state.page);
        (this.props.pagination||this.props.settings.limit==false)&&this.handleChangePage(page);
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
    handleAjaxData(page, options){
        let p = new Promise((resolve, reject)=>{
            let order = [];
            let columns = [];
            let propOrder = (options&&options.order ? options.order : this.props.settings.order || []);
            let propColumns = (options&&options.columns ? options.columns : this.props.settings.columns||[]);
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
            let data = [];
            for(let i in params){
                if(i=='length'&&this.props.settings.limit==false){
                }else{
                    data.push(i + '=' + params[i])
                }
            }
            this.context.ajax.call('get', `${this.props.dataSource}?${data.join('&')}`, null).then(res=>{
                let r = this.props.dataSourceResult;
                let data = {
                    data: res[r] ? res[r][this.props.dataSourceMap&&this.props.dataSourceMap.data ? this.props.dataSourceMap.data : 'data'] : [],
                    total: res[r] ? res[r][this.props.dataSourceMap&&this.props.dataSourceMap.total ? this.props.dataSourceMap.total : 'total'] : 0,
                    canEdit: res[r] ? res[r].canEdit : false
                };
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
        p.then((result)=>{
            let pathname = this.props.pathname || this.props.location && this.props.location.pathname;
            let order = options && options.order ? options.order.map((field)=>[field.column, field.dir].join(':')).join(',') : null;
            let columns = options && options.columns ? options.columns.map((field)=>[field.data, field.search].join(':')).join(',') : null;
            this.setState({page, data: result.data, total: result.total, editable: result.canEdit, order, columns});
            let query = order ? {page, order} : {page};
            pathname && this.context.router.push({pathname, query});
        });
    }
    handleChangePage(page, options){
        if(typeof this.props.dataSource=='object') {
            let order = pathname&&options&&options.order ? options.order.map((field)=>[field.column,field.dir].join(':')).join(',') : null;
            let columns = pathname&&options&&options.columns ? options.columns.map((field)=>[field.data,field.search].join(':')).join(',') : null;
            this.setState({page, order, columns});
            let pathname = this.props.pathname || this.props.location&&this.props.location.pathname;
            pathname&&this.context.router.push({pathname, query:{page}});
        }else{
            let order = this.state.order ? this.state.order.split(',').map((field)=>{
                let f = field.split(':');
                return {
                    column: f[0],
                    dir: f[1]
                }
            }) : [];
            let columns = this.state.columns ? this.state.columns.split(',').map((field)=>{
                let f = field.split(':');
                return {
                    data: f[0],
                    search: f[1]
                }
            }) : [];

            for(let i in options&&options.order||[]){
                let index = order.map((o)=>o.column).indexOf(options.order[i].column);
                if(index!=-1){
                    let shouldResetDir = false;
                    if(order[index].dir=='desc') shouldResetDir=true;
                    order.splice(index, 1);
                    if(!shouldResetDir) {
                        order.unshift(options.order[i]);
                    }
                }else{
                    order.push(options.order[i]);
                }
            }

            for(let i in options&&options.columns||[]){
                if(columns.map((c)=>c.data).indexOf(options.columns[i].data)!=-1){
                    columns = columns.map((c)=>{
                        return c.data==options.columns[i].data ? Object.assign(c, options.columns[i]) : c;
                    });
                }else{
                    columns.push(options.columns[i]);
                }
            }

            options = {order, columns};

            this.handleAjaxData(page, options);
        }
    }
    sort(field){
        if(field.sortable) {
            let key = typeof field.key == 'object' ? field.key.map((k)=>k+':asc').join(',') : field.key+':asc';
            let re = new RegExp(key, 'gi');
            let order = this.props.location ? this.props.location.query.order : this.state.order;
            let dir = (order&&order.match(re) ? 'desc' : 'asc') || 'asc';
            let options = {
                order: typeof field.key == 'object' ? field.key.map((k)=>{return {column: k, dir}}) : [{column: field.key, dir}]
            };
            this.handleChangePage(1, options);
        }
    }
    filter(field, event, search) {
        let columns = typeof field.key == 'object' ? field.key.map((k)=> {
            return {data: k, search}
        }) : [{data: field.key, search}];
        let options = {columns};
        this.handleChangePage(1, options);
    }

    goToPage(page){
        this.handleChangePage(page);
    }
    render() {
        let order = this.state.order ? this.state.order.split(',').map((field)=>{
            let f = field.split(':');
            return {
                column: f[0],
                dir: f[1]
            }
        }) : null;
        // console.log('render', this.state);
        let {table,header,body,fields,limit} = this.props.settings;
        limit = limit==false ? false : limit || 10;
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
                        <TableRow style={{verticalAlign: 'top'}}>
                            {fields.map((field, i)=> {
                                let isOrder = order&&order.filter((o)=>o.column==field.key);
                                let sortable = isOrder&&isOrder.length>0;
                                return (
                                    <TableHeaderColumn key={i} /*tooltip={
                                    (field.tooltip||field.title)
                                    +
                                    (
                                    field.sortable ? ' (' + (sortable ? ('Sorted: ' + (order.dir.match(/asc/gi) ? 'ASC':'DESC')) : 'Sortable') +')' : ''
                                    )}*/ style={Object.assign({}, field.style, {width: field.width})}>
                                        <div onTouchTap={this.sort.bind(null,field)}>
                                            <FlatButton
                                                disabled={true}
                                                label={field.title}
                                                labelPosition="before"
                                                style={{cursor: field.sortable ? 'pointer' : 'default' }}
                                                icon={field.sortable ? (sortable ? (isOrder[0].dir.match(/asc/gi) ? <VerticalAlignTopIcon /> : <VerticalAlignBottomIcon /> ) : <SortIcon />) : null}
                                                />
                                        </div>
                                        {field.filterable ? (
                                            <div>
                                                <TextField id={`column-filter-${i}`} fullWidth={true} onChange={this.filter.bind(null, field)} />
                                            </div>
                                        ) : null}
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
                                        <TableRowColumn key={i} style={Object.assign({}, field.style, {width: field.width})}>{typeof row[field.key]=='boolean' ? row[field.key].toString() : row[field.key]}</TableRowColumn>
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
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};
export default SemiDataTable;