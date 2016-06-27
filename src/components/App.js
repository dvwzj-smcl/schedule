import React, { PropTypes, Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ActionHomeIcon from 'material-ui/svg-icons/action/home';
import ActionEventIcon from 'material-ui/svg-icons/action/event';
import ActionEventSeatIcon from 'material-ui/svg-icons/action/event-seat';

import Layout from './Layout';

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
    render() {
        return (
            <MuiThemeProvider>
                <Layout appBarTitle="Schedule" sidebarMenu={menus} children={this.props.children} location={this.props.location} />
            </MuiThemeProvider>
        );
    }
};

App.propTypes = {};

export default App;