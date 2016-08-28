import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import Loading from '../widgets/Loading';
import {List, ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import {ContentCreate, ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo, ActionCancel, ActionDelete} from 'material-ui/svg-icons';
import {ActionHome, ActionEvent, ActionEventSeat, ContentSave} from 'material-ui/svg-icons';
import * as scheduleActions from '../../actions/scheduleActions';
import SemiForm from '../forms/SemiForm';
import SemiDataTable from '../widgets/SemiDataTable';
import SemiButton from '../widgets/SemiButton';
import SemiModal from '../widgets/SemiModal';
import TextField from 'material-ui/TextField';


class CategorySettingPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            subcategory: {values: {}}
        }
    }

    componentWillMount() {
        this.props.actions.init(true);
    }

    initialized = () => {
        return this.props.actions.init(false);
    };

    navigate = (params) => {
        // not quite useful
        params = Object.assign({
            category_id: ''
        }, this.props.params, params);
        this.context.router.push(`/settings/categories${params.category_id ? '/'+params.category_id : ''}`);
    };

    // ----- On Changes

    onCategoryChange = (category_id) => {
        this.navigate({category_id});
    };

    saveColor = (data) => {
        this.context.ajax.call('put', `schedules/categories/${this.props.params.category_id}`, data).then(response => {
            this.props.actions.init();
        }).catch(error => {
            this.context.dialog.alert(error, 'Error');
        });
    };

    saveSubcategory = (data) => {
        console.log('save', data);
    };

    editSubcategory = (values) => {
        this.setState({subcategory:{values}});
        this.refs.subcategoryModal.open();
    };

    createCubcategory = () => {
        this.refs.subcategoryModal.open();
    };

    deleteSubcategory = (data) => {
        this.context.dialog.confirm('Are you sure?', 'Delete', (confirm)=> {
            if (confirm) {
                this.context.ajax.call('delete', `schedules/subcategories/${data.id}`, null).then(response => {
                    this.props.actions.init();
                }).catch(error => {
                    this.context.dialog.alert(error, 'Error');
                });
            }
        });
    };

    render() {
        console.log('render: cat setting page', this.state);
        if(!this.initialized()) return <Loading />;

        let props = this.props;
        let data = props.schedule.data;
        let state = this.state;
        let {doctor_id, category_id} = props.params;

        // --- Select

        category_id = category_id ? parseInt(category_id) : 0;
        let selectForm = {
            data: {doctor_id: data.doctors, category_id: data.categories},
            values: {category_id},
            components: [[{type: 'select', name: 'category_id', label: 'Doctor*', onChange: this.onCategoryChange}]]
        };

        // --- Category Settings

        let categorySettingForm = null;
        if (category_id) {
            let color = data.categories[category_id].color;
            categorySettingForm = {
                values: {color},
                components: [
                    [{type: 'color', name: 'color', label: 'Colors*', floatingLabelFixed: true, validations:['required']}]
                ]
            };
        }

        // --- Subcategory Settings

        let subcategoriesObj =  category_id ? data.categories[category_id].sub_categories : {};
        let dataSource = [];
        for(let i in subcategoriesObj) {
            let item = subcategoriesObj[i];
            dataSource.push(item);
        }

        // --- Subcategory Modal

        let subcategoryForm = null;
        if (category_id) {
            let color = data.categories[category_id].color;
            subcategoryForm = {
                data: {branch_id: data.branches, roles: data.roles},
                values: this.state.subcategory.values,
                components: [
                    [
                        {type: 'text', name: 'name', label: 'Name*', required: true},
                        {type: 'text', name: 'duration', label: 'Duration*', required: true}
                    ]
                ]
            };
        }

        return (
            <Row>
                <Col md={3}>
                    <Panel title="Select" type="secondary">
                        <div className="semicon">
                            <SemiForm noButton compact formTemplate={selectForm} />
                        </div>
                    </Panel>
                </Col>
                {!category_id ? null : (
                    <Col md={9}>
                        <SemiModal ref="subcategoryModal" formTemplate={subcategoryForm} onSubmit={this.saveSubcategory} submitLabel="Save"/>
                        <Row>
                            <Col md={4}>
                                <Panel title="Category" type="secondary">
                                    <div className="semicon">
                                        <SemiForm buttonRight formTemplate={categorySettingForm} onSubmit={this.saveColor} submitLabel="Save"/>
                                    </div>
                                </Panel>
                            </Col>
                            <Col md={8}>
                                <Panel title="Subcategories" type="secondary">
                                    <div className="semicon">
                                        <div className="button-group">
                                            <SemiButton
                                                semiType="add"
                                                label="Add New"
                                                onTouchTap={this.createCubcategory}
                                            />
                                        </div>
                                        <SemiDataTable
                                            settings={{
                                                table:{
                                                    selectable: false,
                                                    multiSelectable: false
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
                                                        title: "Name",
                                                        key: "name"
                                                    },
                                                    {
                                                        title: "Duration",
                                                        key: "duration",
                                                        custom: (row, index, tbProps)=>{
                                                            return (
                                                                <TextField name="durations[]" value={row.duration} readonly underlineShow={false} />
                                                            );
                                                        }
                                                    },
                                                    {
                                                        title: "Actions",
                                                        key: 'action',
                                                        custom: (row,index,tbDataProps)=>{
                                                        console.log('row,index,tbDataProps',row,index,tbDataProps);
                                                            return (
                                                                <div>
                                                                    <IconButton backgroundColor="#F00" onClick={this.editSubcategory.bind(this, row)} >
                                                                        <ContentCreate />
                                                                    </IconButton>
                                                                    <IconButton onClick={this.deleteSubcategory.bind(this, row)}>
                                                                        <ActionDelete />
                                                                    </IconButton>
                                                                </div>
                                                            );
                                                        }
                                                    }
                                                ],
                                                limit: false
                                            }}
                                            dataSource={dataSource} />
                                    </div>
                                </Panel>
                            </Col>
                        </Row>
                    </Col>
                )}
            </Row>
        );
    }
}

CategorySettingPage.propTypes = {};
CategorySettingPage.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

const mapStateToProps = ({user, schedule}) => ({user, schedule});
const mapDispatchToProps = (dispatch) => ({actions: {
    init: bindActionCreators(scheduleActions.initSchedule, dispatch)
}});
export default connect(mapStateToProps, mapDispatchToProps)(CategorySettingPage);