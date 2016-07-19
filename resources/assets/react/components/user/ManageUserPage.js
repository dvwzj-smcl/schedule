import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';


// material-ui


// import toastr from 'toastr';

// Forms
import SemiText from '../forms/SemiText';
import SemiForm from '../forms/SemiForm';
import ErrorMessage from '../forms/ErrorMessage';

// Formsy
import AlertBox from '../widgets/AlertBox';
import FormsyText from 'formsy-material-ui/lib/FormsyText';


class ManageUserPage extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            canSubmit: false,
            openLoginBox: false,
            openAlertBox: false,
            alertText: '',
            canLogin: false,
            user: Object.assign({}, props.user)
        };

        this.submitForm = this.submitForm.bind(this);


        this.handleAlertOpen = this.handleAlertOpen.bind(this);
        this.handleAlertClose = this.handleAlertClose.bind(this);

    }


    componentWillMount() {
        // console.log('[ManageUserPage] componentWillMount call?')
    }

    componentDidMount(){
        // console.log('[ManageUserPage] componentDidMount');
        if (typeof this.props.userId!="undefined"){
            this.getData();
        }
    }

    componentWillReceiveProps(nextProps){
        // console.log('[ManageUserPage] (componentWillReceiveProps) this.props',this.props.user);
        // console.log('[ManageUserPage] (componentWillReceiveProps) nextProps',nextProps.user);
        if(nextProps.user != this.props.user){
            this.setState({user: Object.assign({}, nextProps.user)});
        }


        this.setState({ startTime: nextProps.startTime });

    }

    shouldComponentUpdate(nextProps, nextState) {
        // console.log('[ManageUserPage] (shouldComponentUpdate)',nextProps,nextState);
        // console.log('[ManageUserPage] (shouldComponentUpdate) this.state ',this.state.user);
        // console.log('[ManageUserPage] (shouldComponentUpdate) nextState ',nextState.user);
        return this.state.user != nextState.user ;
    }

    updateCourseState(event){
        // console.log('[ManageUserPage] updateCourseState');
        const field = event.target.name;
        let user = this.state.user;
        user[field] = event.target.value;
        return this.setState({user: user});
    }

    submitForm(data) {
        this.handleCloseLoginBox();
        // console.log('[ManageUserPage] data', data);

        console.log(this.props.userId);

        let sfunction ;
        if (typeof this.props.userId!="undefined"){
            console.log('update');
            const {userId} = this.props;
            sfunction = this.props.actions.updateuser(userId,data) ;
        }else{
            console.log('save');
            sfunction = this.props.actions.saveuser(data) ;
        }

        sfunction.then((json)=>{
            console.log('[ManageUserPage] JSON DATA :',json);
            let result = json.user ;
            if (result.status == "error"){
                if(result.data.error=="Expired token"){
                    console.log('[ManageUserPage] in Expired token');
                    this.handleOpenLoginBox();
                }else{
                    this.setState({alertText: result.data.error});
                    this.handleAlertOpen();
                }
            }else{
                this.redirect();
            }
        });

    }

    redirect(){
        //toastr.success('Course saved');
        this.context.router.push('/user-types');
    }

    handleAlertOpen(){
        this.setState({openAlertBox: true});
    }

    handleAlertClose(){
        this.setState({openAlertBox: false});
    }


    getData(){
        const {userId} = this.props;
        console.log('userId ',userId);
        this.props.actions.loaduserById(userId).then((json)=>{
            let result = json.user ;
            console.log('Type Of result.data',typeof  result.data );
            if (result.status == "error"){
                this.setState({alertText: result.data.error});
                this.handleAlertOpen();
            }

            this.setState({user: Object.assign({}, result.data)});

            this.refs['name'].setValue(result.data.name) ;

        });
    }


    changeValue(event) {
        this.setState({user: Object.assign({}, event.currentTarget.value)});
    }

    render() {

        // console.log('[ManageUserPage] render openLoginBox ',this.state.openLoginBox);
        const {user} = this.state ;

        // console.log('[ManageUserPage] render',user);

        return (
            <Grid fluid>
                <AlertBox
                    openAlertBox={this.state.openAlertBox}
                    alertText={this.state.alertText}
                    alertFunction={this.handleAlertClose}
                />
                <Row>
                    <Col md={12}>
                        <Panel title="User Type">

                            <div className="con-pad">
                                <SemiForm
                                    hasReset
                                    hasBack
                                    onValidSubmit={this.submitForm}
                                >
                                 
                                    <SemiText
                                        name="name"
                                        value={user.name}

                                        ref="name"

                                        validations={{
                                            minLength: 3,
                                            maxLength: 50
                                          }}

                                        validationErrors={{
                                            minLength: ErrorMessage.minLength,
                                            maxLength: ErrorMessage.maxLength
                                          }}

                                        required
                                        hintText="What is user type name?"
                                        floatingLabelText="Name"
                                        underlineShow={true}
                                    />
                                    <br />
                                </SemiForm>
                            </div>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}
ManageUserPage.propTypes = {
    actions: PropTypes.object.isRequired,
    routing: PropTypes.object.isRequired,
    userId: PropTypes.string,
    user2: PropTypes.object
};
ManageUserPage.contextTypes = {
    router: PropTypes.object.isRequired
};


function mapStateToProps(state, ownProps){
    // const userId = ownProps.params.id; // from the path `/user-type/:id`

    // console.log('state :',state);

     let user = {id:'', name:''};



    // if(userId && typeof state.user != "undefined" ){
    //     // console.log('user not undefined');
    //     user = state.user ;
    // }

    // console.log('[ManageUserPage] (mapStateToProps) user',user);

    return {
        user2: user,
        routing: state.routing,
        userId: ownProps.params.id
    };
}

export default connect(
    mapStateToProps,
    (dispatch)=>{
        // console.log('[ManageUserPage] mapDispatchToProps');
        return {};
    }
)(ManageUserPage);


