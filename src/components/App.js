import React, { PropTypes, Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../actions/userActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionHomeIcon from 'material-ui/svg-icons/action/home';
import ActionEventIcon from 'material-ui/svg-icons/action/event';
import ActionEventSeatIcon from 'material-ui/svg-icons/action/event-seat';

import Layout from './Layout';
import LoginPage from './LoginPage';

injectTapEventPlugin();

const menus = [
    {
        text: "Home",
        icon: <ActionHomeIcon />,
        to: "/"
    },
    {
        text: "Calendar",
        icon: <ActionEventIcon />,
        to: "/calendar"
    },
    {
        text: "Event",
        icon: <ActionEventSeatIcon />,
        to: "/event"
    }
];



class App extends Component {
    componentWillMount(){
        if(!this.props.userState.profile){
            this.context.router.replace('/login');
        }
    }
    componentWillUpdate(){
    }
    render() {
        return (
            <MuiThemeProvider >
                {this.props.userState.profile?(
                    <Layout appBarTitle="Schedule" sidebarMenu={menus} children={this.props.children} location={this.props.location} />
                ):(
                    <LoginPage userActions={this.props.userActions} />
                )}
            </MuiThemeProvider>
        );
    }
};

App.propTypes = {};
App.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object
};

function mapStateToProps(state) {
    return {
        userState: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);