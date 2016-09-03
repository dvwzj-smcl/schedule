import React, {PropTypes, Component} from 'react';
import { connect } from 'react-redux';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {ActionDateRange, ActionHome, ActionEvent, ActionEventSeat, ActionPermContactCalendar, SocialPerson, ActionSettings, ActionDashboard, ActionAccessibility, ActionStore } from 'material-ui/svg-icons';
// shift+shift and svg-icons\index to search for the name
// see: https://www.materialui.co/icons, https://design.google.com/icons/

// menu here

const menus = [
    {
        text: "Dashboard",
        icon: <ActionHome />,
        to: "/"
    },
    {
        text: "Sale's Schedule",
        icon: <ActionEvent />,
        to: "/schedules/sale",
        permissions : ['request-schedules']
    },
    {
        text: "Organizer's Schedule",
        icon: <ActionEvent />,
        to: "/schedules/organizer",
        permissions : ['organize-schedules']
    },
    {
        text: "Schedule Summary",
        icon: <ActionDateRange />,
        to: "/schedules/summary",
        permissions : ['view-schedules']
    },
    {
        text: "Doctor's Slots",
        icon: <ActionDashboard />,
        to: "/slots",
        permissions : ['edit-slot']
    },
    {
        text: "Settings",
        icon: <ActionSettings />,
        to: "/settings/doctors",
        parentPath: '/settings',
        permissions : ['schedule-settings']
    },
    {
        text: "Customers",
        icon: <ActionAccessibility />,
        to: "/customers",
        permissions : ['edit-customers']
    },
    {
        text: "Users",
        icon: <SocialPerson />,
        to: "/users",
        permissions : ['edit-users']
    },
    {
        text: "Branches",
        icon: <ActionStore />,
        to: "/branches",
        permissions : ['edit-branches']
    },
    // {
    //     text: "FormDemo",
    //     icon: <ActionPermContactCalendar />,
    //     to: "/form"
    // },
    // {
    //     text: "DataTableDemo",
    //     icon: <ActionPermContactCalendar />,
    //     to: "/datatable"
    // }
];

const menuFilter = (required, permissions) => {
    // todo : filter here
    // console.log('menu', required, permissions);
    if(!required) return true;
    for(let item of required) {
        if(permissions.indexOf(item) !== -1) return true;
    }
    return false;
};

class MainMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.linkTo = this.linkTo.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
    }

    linkTo(pathname) {
        return this.context.router.push(pathname);
    }

    isActiveMenu(menuPath, parentPath) {
        // console.log('props.location.pathname', this.props.location.pathname, menuPath);
        let currentPath = this.props.location.pathname;
        if(menuPath == '/') return currentPath == menuPath;
        let path = parentPath || menuPath;
        return currentPath.indexOf(path) !== -1;
    }

    render() {
        let props = this.props;

        return (
            <Menu autoWidth={false}
                      style={{display: 'table', width: '100%', tableLayout: 'fixed'}}>
            {menus.filter(m => menuFilter(m.permissions, props.user.permissions)).map((menuItem, i)=> {
                return (
                    <MenuItem
                        className="nav-item"
                        key={i}
                        primaryText={props.app.sidebar.expanded ? menuItem.text : "\u00a0"}
                        leftIcon={menuItem.icon}
                        onTouchTap={this.linkTo.bind(null, menuItem.to)}
                        style={this.isActiveMenu(menuItem.to, menuItem.parentPath)?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}/>
                );
            })}
        </Menu>);
    }
}

const mapStateToProps = ({ app, user }) => ({
    app, user
});

// const mapDispatchToProps = dispatch => ({
// });

MainMenu.propTypes = {
    location: PropTypes.object.isRequired
};

MainMenu.contextTypes = {
    router: PropTypes.object
};


export default connect(mapStateToProps)(MainMenu);