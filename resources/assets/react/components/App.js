import React, { PropTypes, Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { connect } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { bindActionCreators } from 'redux';
import * as userActions from '../actions/userActions';

import Layout from './Layout';
import Loading from './widgets/Loading';
import {ajax, getAll} from '../api/ApiCall';

injectTapEventPlugin();

class App extends Component {

    getChildContext() {
        return {
            ajax: {
                call: (method, url, data) => {
                    return ajax(method, url, data, this.props.user.access_token);
                },
                getAll: (urls) => {
                    return getAll(urls, this.props.user.access_token);
                }
            }
        }
    }

    render() {
        // console.log('render: app', this.props.user);
        return (
            <MuiThemeProvider >
                {(() => {
                    if(this.props.user.access_token) return <Layout appBarTitle="Schedule" children={this.props.children} location={this.props.location} user={this.props.user} actions={this.props.actions} />;
                    else if(this.props.user.authenticating) return this.props.children;
                    else if(this.props.user.error) return this.props.children;
                    else return <Loading />;
                })()}
            </MuiThemeProvider>
        );
    }
}

Date.prototype.getISODate = function() {
    let month = this.getMonth()+1;
    if(month < 10) month = '0'+month;
    let day = this.getDate();
    if(day < 10) day = '0'+day;
    return this.getFullYear()+'-'+month+'-'+day;
};

App.propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    actions: PropTypes.object,
    user: PropTypes.object
};
App.childContextTypes = {
    ajax: PropTypes.object,
};

const mapStateToProps = ({user}) => ({user});
const mapDispatchToProps = (dispatch) => ({actions: {
    user: {
        login: bindActionCreators(userActions.login, dispatch),
        logout: bindActionCreators(userActions.logout, dispatch),
        isAuthenticated: bindActionCreators(userActions.isAuthenticated, dispatch)
    }
}});

export default connect(mapStateToProps, mapDispatchToProps)(App);