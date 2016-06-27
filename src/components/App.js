import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as userActions from '../actions/userActions';
import { Grid, Row, Col } from 'react-flexbox-grid';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import { List, ListItem } from 'material-ui/List';
import HomeIcon from 'material-ui/svg-icons/action/home';
import ActionEventIcon from 'material-ui/svg-icons/action/event';
import ActionEventSeatIcon from 'material-ui/svg-icons/action/event-seat';

injectTapEventPlugin();

const defaultSettings = {
    menu: {
        style: {
            width: '100%',
            display: 'table'
        },
        selectedStyle: {
            backgroundColor: 'rgba(0,0,0,0.2)'
        }
    },
    navbar: {
        minMd: 9,
        maxMd: 11
    }
};

class App extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            navbar: {
                md: defaultSettings.navbar.minMd,
            }
        };
        this.linkTo = this.linkTo.bind(this);
        this.leftIconClickHandle = this.leftIconClickHandle.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
        this.isSidebarExpanded = this.isSidebarExpanded.bind(this);
    }
    componentDidMount(){
    }
    componentDidUpdate(){
    }
    isActiveMenu(pathname){
        return this.props.location.pathname==pathname;
    }
    isSidebarExpanded(){
        return this.state.navbar.md==defaultSettings.navbar.minMd;
    }
    linkTo(pathname){
        this.context.router.push(pathname);
    }
    leftIconClickHandle(){
        this.setState({
            navbar:{
                md: this.isSidebarExpanded() ? defaultSettings.navbar.maxMd : defaultSettings.navbar.minMd
            }
        });
    }
    render(){
        return (
            <MuiThemeProvider>
                <Grid>
                    <Row>
                        <Col md={12-this.state.navbar.md}>
                            <Paper>
                                <Menu
                                    autoWidth={false}
                                    style={defaultSettings.menu.style} >
                                    <MenuItem
                                        primaryText={this.isSidebarExpanded() ? "Home" : "\u00a0"}
                                        leftIcon={<HomeIcon />}
                                        onTouchTap={this.linkTo.bind(null, '/')}
                                        style={this.isActiveMenu('/') ? defaultSettings.menu.selectedStyle : null} />
                                    <MenuItem
                                        primaryText={this.isSidebarExpanded() ? "Calendar" : "\u00a0"}
                                        leftIcon={<ActionEventIcon />}
                                        onTouchTap={this.linkTo.bind(null, '/calendar')}
                                        style={this.isActiveMenu('/calendar') ? defaultSettings.menu.selectedStyle : null} />
                                    <MenuItem
                                        primaryText={this.isSidebarExpanded() ? "Event" : "\u00a0"}
                                        leftIcon={<ActionEventSeatIcon />}
                                        onTouchTap={this.linkTo.bind(null, '/event')}
                                        style={this.isActiveMenu('/event') ? defaultSettings.menu.selectedStyle : null} />
                                </Menu>
                            </Paper>
                        </Col>
                        <Col md={this.state.navbar.md}>
                            <AppBar
                                title="Schedule"
                                titleStyle={{cursor: 'pointer'}}
                                onLeftIconButtonTouchTap={this.leftIconClickHandle}
                                showMenuIconButton={false}
                                onTitleTouchTap={this.linkTo.bind(null, '/', this.props.routes[1].title)} />
                                <Paper style={{padding: '16px 24px'}}>
                                    {this.props.children}
                                </Paper>
                        </Col>
                    </Row>
                </Grid>
            </MuiThemeProvider>
        );
    }
};

App.propTypes = {
    children: PropTypes.element
};
App.contextTypes = {
    router: PropTypes.object
 }

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
