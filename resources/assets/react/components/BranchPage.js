import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';
import SemiDataTable from './widgets/SemiDataTable';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SemiModal from './widgets/SemiModal';
import SemiButton from './widgets/SemiButton';
import {Form} from 'formsy-react';
import {ContentAdd, ContentCreate, ActionAutorenew, ActionDelete} from 'material-ui/svg-icons';

// settings
const MODEL_NAME = 'Branch';
const URL = 'branches';

class BranchPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            values: {}
        };
    }

    // Execute every time the modal is open
    // Recommend using ajax here if there is a form because it will trigger form loading spinner.
    onLoad = (ajax) => {
        let id = this.object_id;
        let urls = [];
        if(id) { // edit
            urls.push({url:`${URL}/${id}/edit`, name: 'values'});
        }
        // must return a promise
        return ajax.getAll(urls).then( data => {
            if(data.values) this.setState(Object.assign({title: `Edit ${MODEL_NAME}`}, data));
            else this.setState(Object.assign({title: `Create ${MODEL_NAME}`, value: {}}, data));
            return data; // pass data to SemiForm for further processing
        });
    };

    onSubmit = (data, ajax, dialog) => {
        let id = data.id;
        let url = id ? `${URL}/${id}` : `${URL}`;
        let method = id ? 'put' : 'post';
        let SuccessMessage = id ? `${MODEL_NAME} updated` : `${MODEL_NAME} created`;


        console.log('method, url, data', method, url, data);

        // must return a promise
        return ajax.call(method, url, data).then( response => {
            dialog.alert(SuccessMessage, 'Success', 'success');
            this.refs.table.handleReload();
            return response;
        }).catch( error => {
            dialog.alert(error, 'Error');
            throw error;
        });
    };

    handleEdit = (id) =>{
        this.object_id = id;
        this.refs.modal.open();
    };

    handleDelete = (id) => {
        this.context.dialog.confirm('Are you sure?', `Delete ${MODEL_NAME}`, (confirm)=> {
            if (confirm) {
                this.context.ajax.call('delete', `${URL}/${id}`, null).then(response => {
                    this.context.dialog.alert(`${MODEL_NAME} deleted`, 'Success', 'success');
                    this.refs.table.handleReload();
                }).catch(error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }
        });
    };

    render() {
        let {values, title} = this.state;
        let formTemplate = {
            values: values || {},
            components: [
                [
                    {type: 'text', name: 'name', label: 'Name*', required: true},
                    {type: 'text', name: 'email', label: 'Email*', required: true, validations:'isEmail'}
                ],
                [
                    {type: 'text', name: 'phone', label: 'Phone*', required: true},
                    {type: 'text', name: 'fax', label: 'Fax'}
                ],
                [
                    {type: 'text', name: 'desc', label: 'Description'}
                ],
                [
                    {type: 'text', name: 'address', label: 'Address'},
                    {type: 'hidden', name: 'id'}
                ]
            ]
        };

        let modal = (
            <SemiModal
                ref="modal"
                title={title || ''}
                onLoad={this.onLoad} // execute every time the modal is open
                onSubmit={this.onSubmit}
                formTemplate={formTemplate}
            />
        );

        return (
            <div>
                {modal}
                <PageHeading title={`${MODEL_NAME}`} description={`Manage ${MODEL_NAME}`} />
                <Grid fluid className="content-wrap">
                    <Row>
                        <Col md={12}>
                            <Panel title={`${MODEL_NAME}`}>
                                <div className="con-pad">
                                    <div className="button-group">
                                        <SemiButton
                                            semiType="add"
                                            label="Add New"
                                            onTouchTap={()=>{
                                                this.setState({
                                                    value: {},
                                                    title: 'Create Branch'
                                                });
                                                this.object_id = null;
                                                this.refs.modal.open();
                                            }}
                                        />
                                        <SemiButton
                                            semiType="refresh"
                                            label="Reload"
                                            onTouchTap={()=>{
                                                this.refs.table.handleReload();
                                            }}
                                        />
                                    </div>
                                </div>
                                <SemiDataTable
                                    ref="table"
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
                                                width: '10%'
                                            },
                                            {
                                                title: "Name",
                                                key: "name"
                                            },
                                            {
                                                title: "Description",
                                                key: "desc"
                                            },
                                            {
                                                title: "Phone",
                                                key: "phone"
                                            },
                                            {
                                                title: "Actions",
                                                key: 'action',
                                                width: '10%',
                                                custom: (row,index,tbDataProps)=>{
                                                    return (
                                                        <div>
                                                            <IconButton backgroundColor="#F00" onClick={this.handleEdit.bind(null, row.id)} >
                                                                <ContentCreate />
                                                            </IconButton>
                                                            <IconButton onClick={this.handleDelete.bind(null, row.id)}>
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
                                    dataSource={`${URL}`}
                                />
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

BranchPage.propTypes = {};
BranchPage.contextTypes = {
    router: PropTypes.object.isRequired,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user}) => ({user});
export default connect(
    mapStateToProps
)(BranchPage);