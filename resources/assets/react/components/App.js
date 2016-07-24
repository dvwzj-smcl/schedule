import React, { PropTypes, Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as userActions from '../actions/userActions';
import * as appActions from '../actions/appActions';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {ActionHome, ActionEvent, ActionEventSeat} from 'material-ui/svg-icons';
import Layout from './Layout';
import Loading from './widgets/Loading';

injectTapEventPlugin();

class App extends Component {

    componentWillMount(){

    }
    componentWillUpdate(){

    }
    render() {
        // console.log('render: app', this.props.user);
        return (
            <MuiThemeProvider >
                {(() => {
                    if(this.props.user.access_token) return <Layout appBarTitle="Schedule" children={this.props.children} location={this.props.location} />;
                    else if(this.props.user.authenticating) return this.props.children;
                    else return <Loading />;
                })()}
            </MuiThemeProvider>
        );
    }
}

// App.propTypes = {
//     children: PropTypes.element,
//     location: PropTypes.object,
//     actions: PropTypes.object,
//     user: PropTypes.object,
//     menu: PropTypes.object
// };
App.contextTypes = {
    router: PropTypes.object
};

const mapStateToProps = ({user}) => ({user});
const mapDispatchToProps = (dispatch) => ({actions: {
    // init: bindActionCreators(scheduleActions.initSchedule(), dispatch)
}});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);