import React, {PropTypes, Component} from 'react';
import Paper from 'material-ui/Paper';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import {NavigationMenu, ActionAccountBox, ActionPowerSettingsNew, NavigationMoreVert} from 'material-ui/svg-icons';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import MainMenu from './MainMenu';
import Confirm from './widgets/Confirm';
import Alert from './widgets/Alert';

// import GeminiScrollbar from 'react-gemini-scrollbar';

class Layout extends Component {
    constructor(props, context) {
        super(props, context);
        this.linkTo = this.linkTo.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.openConfirm = this.openConfirm.bind(this);
        this.openAlert = this.openAlert.bind(this);
        this.state = {
            showMainMenu: true
        }
    }

    linkTo(pathname) {
        return this.context.router.push(pathname);
    }

    toggleSidebar() {
        this.props.actions.sidebar.toggle();
    }

    logout() {
        this.context.router.push('/login');
        this.props.actions.user.logout();
    }

    getChildContext() {
        return { dialog: { confirm: this.openConfirm, alert: this.openAlert } }
    }

    openConfirm(...params) {
        console.log('openConfirm');
        this.refs.confirm.open(params);
    }

    openAlert(...params) {
        // console.log('description', title, description);
        this.refs.alert.open(params);
    }

    toggleMainMenu = () => {
        this.setState({showMainMenu: !this.state.showMainMenu});
    };

    render() {
        // console.log('render: layout', this.props.user);
        let showMainMenu = this.state.showMainMenu;
        return (
            <div id="layout" className={`${showMainMenu ? '' : 'no-menu'}`}>
                <Confirm ref="confirm" />
                <Alert ref="alert" />
                <Drawer open={showMainMenu} className={`menu-wrapper ${showMainMenu ? '' : 'minimize'}`}>
                    <Toolbar className="side-nav-bar"><ToolbarTitle text="Navigation"/></Toolbar>
                    <MainMenu location={this.props.location} />
                </Drawer>
                <Paper className="top-nav-wrap" zDepth={1}>
                    <Toolbar className="top-nav-bar">
                        <ToolbarGroup firstChild={true}>
                            <FlatButton className="icon-btn left-most" icon={<NavigationMenu />} onTouchTap={this.toggleMainMenu} />
                            <IconButton iconClassName="muidocs-icon-custom-github" />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text="Schedule"/>
                            <ToolbarSeparator />
                            <ToolbarTitle text={this.props.user.branch.name} style={{marginLeft: 32}} />
                            {/*<RaisedButton label="Something" primary={true}/>*/}
                            <IconMenu
                                iconButtonElement={<IconButton style={{width:56, height:56}}><NavigationMoreVert /></IconButton>}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                                <MenuItem
                                    primaryText="Profile"
                                    leftIcon={<ActionAccountBox />}
                                    onTouchTap={this.linkTo.bind(null, '/profile')}/>
                                <MenuItem
                                    primaryText="Sign out"
                                    leftIcon={<ActionPowerSettingsNew />}
                                    onTouchTap={this.logout}/>
                            </IconMenu>
                        </ToolbarGroup>
                    </Toolbar>
                </Paper>
                <div className={`main-wrap`}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Layout.propTypes = {
    user: PropTypes.object.isRequired,
    // actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    appBarTitle: PropTypes.string.isRequired,
    children: PropTypes.object.isRequired
};
Layout.contextTypes = {
    router: PropTypes.object
};
Layout.childContextTypes = {
    dialog: PropTypes.object
};

// const mapStateToProps = ({module}) => ({module});
// const mapDispatchToProps = (dispatch) => ({actions: {
//     sidebar: {
//         isExpanded: bindActionCreators(appActions.sidebarIsExpanded, dispatch),
//         toggle: bindActionCreators(appActions.sidebarToggle, dispatch)
//     },
//     user: {
//         login: bindActionCreators(userActions.login, dispatch),
//         logout: bindActionCreators(userActions.logout, dispatch),
//         isAuthenticated: bindActionCreators(userActions.isAuthenticated, dispatch)
//     }
// }});
//
// export default connect(mapStateToProps, mapDispatchToProps)(Layout);
export default Layout;