import React, { PropTypes, Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../actions/userActions';
import * as menuActions from '../actions/menuActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {ActionHome, ActionEvent, ActionEventSeat} from 'material-ui/svg-icons';
import Layout from './Layout';

injectTapEventPlugin();

const menus = [
    {
        text: "Home",
        icon: <ActionHome />,
        to: "/"
    },
    {
        text: "Calendar",
        icon: <ActionEvent />,
        to: "/calendar"
    },
    {
        text: "Event",
        icon: <ActionEventSeat />,
        to: "/event"
    }
];

class App extends Component {

    componentWillMount(){

    }
    componentWillUpdate(){

    }
    render() {
        return (
            <MuiThemeProvider >
                <Layout appBarTitle="Schedule" page={this.props.page} user={this.props.user} menu={this.props.menu} actions={this.props.actions} sidebarMenu={menus} children={this.props.children} location={this.props.location} />
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    actions: PropTypes.object,
    user: PropTypes.object,
    menu: PropTypes.object,
    page: PropTypes.object
};
App.contextTypes = {
    router: PropTypes.object
};

function mapStateToProps(state) {
    return {
        user: state.user,
        menu: state.menu,
        page: state.page
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions:{
            sidebar: {
                isExpanded: bindActionCreators(menuActions.sidebarIsExpanded, dispatch),
                toggle: bindActionCreators(menuActions.sidebarToggle, dispatch)
            },
            user: {
                login: bindActionCreators(userActions.login, dispatch),
                logout: bindActionCreators(userActions.logout, dispatch),
                isAuthenticated: bindActionCreators(userActions.isAuthenticated, dispatch)
            }
        }
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);