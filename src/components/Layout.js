import React, {PropTypes, Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ActionAccountBoxIcon from 'material-ui/svg-icons/action/account-box';
import ActionPowerSettingNewIcon from 'material-ui/svg-icons/action/power-settings-new';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import NavigationMoreVert from 'material-ui/svg-icons/navigation/more-vert';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Drawer from 'material-ui/Drawer';

import FontIcon from 'material-ui/FontIcon';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';

// import GeminiScrollbar from 'react-gemini-scrollbar';

class Layout extends Component {
    constructor(props, context) {
        super(props, context);

        this.linkTo = this.linkTo.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.state = { count: 100 }

    }

    linkTo(pathname) {
        return this.context.router.push(pathname);
    }

    toggleSidebar() {
        this.props.actions.sidebar.toggle();
    }

    logout() {
        this.props.actions.user.logout().then(()=> {
            this.context.router.replace('/');
        });
    }

    isActiveMenu(pathname) {
        return this.props.location.pathname == pathname;
    }

    handleChange(event, index, value) {

        // this.setState({value});
    };

    render() {
        return (
            <div>
                <Drawer open={true} className="menu-wrapper">
                    <Toolbar><ToolbarTitle text="Navigation"/></Toolbar>
                    <Menu>
                        {this.props.sidebarMenu.map((menu, i)=> {
                            return (
                                <MenuItem
                                    key={i}
                                    primaryText={this.props.menu.sidebar.expanded ? menu.text : "\u00a0"}
                                    leftIcon={this.props.menu.sidebar.expanded ? menu.icon : React.cloneElement(menu.icon,{
                                            style: { width: '100%', margin: '12px auto', left: 0 }
                                        })}
                                    onTouchTap={this.linkTo.bind(null, menu.to)}
                                    style={this.isActiveMenu(menu.to)?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}/>
                            );
                        })}
                    </Menu>
                </Drawer>
                <Paper>
                    <Toolbar className="main-toolbar">
                        <ToolbarGroup firstChild={true}>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <ToolbarTitle text="Schedule"/>
                            <ToolbarSeparator />
                            <RaisedButton label="Something" primary={true}/>
                            <IconMenu
                                iconButtonElement={<IconButton style={{width:'56px', height:'56px'}}><NavigationMoreVert /></IconButton>}
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                                <MenuItem
                                    primaryText="Profile"
                                    leftIcon={<ActionAccountBoxIcon />}
                                    onTouchTap={this.linkTo.bind(null, '/profile')}/>
                                <MenuItem
                                    primaryText="Sign out"
                                    leftIcon={<ActionPowerSettingNewIcon />}
                                    onTouchTap={this.logout}/>
                            </IconMenu>
                        </ToolbarGroup>
                    </Toolbar>
                </Paper>
                <div className="content-wrap">
                    <Grid fluid>
                        <Row>
                            <Col md={3}>
                                <RaisedButton label="Create Broadcast" primary={true}/>
                            </Col>
                            <Col md={9}>
                                <RaisedButton label="Create Broadcast" primary={true}/>
                            </Col>
                        </Row>
                    </Grid>
                    {this.props.children}
                </div>
            </div>
        );
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