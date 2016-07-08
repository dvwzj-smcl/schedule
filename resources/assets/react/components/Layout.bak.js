import React, { PropTypes, Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import ActionAccountBoxIcon from 'material-ui/svg-icons/action/account-box';
import ActionPowerSettingNewIcon from 'material-ui/svg-icons/action/power-settings-new';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

class Layout extends Component {
    constructor(props, context){
        super(props, context);

        this.linkTo = this.linkTo.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
    }
    linkTo(pathname){
        return this.context.router.push(pathname);
    }
    toggleSidebar(){
        this.props.actions.sidebar.toggle();
    }
    logout(){
        this.props.actions.user.logout().then(()=>{
            this.context.router.replace('/');
        });
    }
    isActiveMenu(pathname){
        return this.props.location.pathname==pathname;
    }
    render(){
        if(this.props.user.access_token) {
            return (
                <Grid>
                    <Row>
                        <Col md={this.props.menu.sidebar.expanded ? 3 : 1}>
                            <Paper>
                                <Menu
                                    autoWidth={false}
                                    style={{display: 'table', width: '100%', tableLayout: 'fixed'}}>
                                    {this.props.sidebarMenu.map((menu, i)=> {
                                        return (
                                            <MenuItem
                                                key={i}
                                                primaryText={this.props.menu.sidebar.expanded ? menu.text : "\u00a0"}
                                                leftIcon={this.props.menu.sidebar.expanded ? menu.icon : React.cloneElement(menu.icon,{
                                                style: {
                                                    width: '100%',
                                                    margin: '12px auto',
                                                    left: 0
                                                }
                                            })}
                                                onTouchTap={this.linkTo.bind(null, menu.to)}
                                                style={this.isActiveMenu(menu.to)?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}/>
                                        );
                                    })}
                                </Menu>
                            </Paper>
                        </Col>
                        <Col md={this.props.menu.sidebar.expanded ? 9 : 11}>
                            <Paper>
                                <AppBar
                                    title={<span style={{cursor: 'pointer'}} onTouchTap={this.linkTo.bind(null, '/')} >{this.props.appBarTitle}</span>}
                                    onLeftIconButtonTouchTap={this.toggleSidebar}
                                    showMenuIconButton={true}
                                    iconElementRight={
                                    <IconMenu
                                        iconButtonElement={
                                            <IconButton><NavigationExpandMoreIcon /></IconButton>
                                        }
                                        targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                        anchorOrigin={{horizontal: 'right', vertical: 'top'}} >
                                        <MenuItem
                                            primaryText="Profile"
                                            leftIcon={<ActionAccountBoxIcon />}
                                            onTouchTap={this.linkTo.bind(null, '/profile')} />
                                        <MenuItem
                                            primaryText="Sign out"
                                            leftIcon={<ActionPowerSettingNewIcon />}
                                            onTouchTap={this.logout} />
                                    </IconMenu>
                                }/>
                            </Paper>
                            {this.props.children}
                        </Col>
                    </Row>
                </Grid>
            );
        }else{
            return this.props.children;
        }
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