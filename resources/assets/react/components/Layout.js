import React, {PropTypes, Component} from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

import {NavigationMenu, ActionAccountBox, ActionPowerSettingsNew, NavigationMoreVert} from 'material-ui/svg-icons';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';

import PageHeading from './widgets/PageHeading';

// import GeminiScrollbar from 'react-gemini-scrollbar';

class Layout extends Component {
    constructor(props, context) {
        super(props, context);
        this.linkTo = this.linkTo.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
    }

    linkTo(pathname) {
        return this.context.router.push(pathname);
    }

    toggleSidebar() {
        this.props.actions.sidebar.toggle();
    }

    logout() {
        this.props.actions.user.logout();
    }

    isActiveMenu(pathname) {
        return this.props.location.pathname == pathname;
    }

    render() {
        return (this.props.user.access_token)? (
            <div>
                <Drawer open={true} className="menu-wrapper">
                    <Toolbar className="side-nav-bar"><ToolbarTitle text="Navigation"/></Toolbar>
                    <Menu autoWidth={false}
                        style={{display: 'table', width: '100%', tableLayout: 'fixed'}}>
                        {this.props.sidebarMenu.map((menu, i)=> {
                            return (
                                <MenuItem
                                    className="nav-item"
                                    key={i}
                                    primaryText={this.props.menu.sidebar.expanded ? menu.text : "\u00a0"}
                                    leftIcon={menu.icon}
                                    onTouchTap={this.linkTo.bind(null, menu.to)}
                                    style={this.isActiveMenu(menu.to)?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}/>
                            );
                        })}
                    </Menu>
                </Drawer>
                <Paper className="top-nav-wrap" zDepth={1}>
                    <Toolbar className="top-nav-bar">
                        <ToolbarGroup firstChild={true}>
                            <FlatButton className="icon-btn left-most" icon={<NavigationMenu />} />
                            <IconButton iconClassName="muidocs-icon-custom-github" />
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text="Schedule"/>
                            <ToolbarSeparator />
                            <RaisedButton label="Something" primary={true}/>
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

                <div>
                    {this.props.children}
                </div>
            </div>
        ) : this.props.children;
    }
}

Layout.propTypes = {
    user: PropTypes.object.isRequired,
    menu: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    appBarTitle: PropTypes.string.isRequired,
    sidebarMenu: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
            icon: PropTypes.element.isRequired,
            to: PropTypes.string.isRequired
        }).isRequired
    ),
    children: PropTypes.object.isRequired
};
Layout.contextTypes = {
    router: PropTypes.object
};


export default Layout;