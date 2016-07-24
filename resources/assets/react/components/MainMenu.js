import React, {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {ActionHome, ActionEvent, ActionEventSeat, ActionPermContactCalendar, SocialPerson} from 'material-ui/svg-icons';

// menu here

const menus = [
    {
        text: "Home",
        icon: <ActionHome />,
        to: "/"
    },
    {
        text: "Schedule",
        icon: <ActionEvent />,
        to: "/schedules",
        permissions : ['organize-schedules']
    },
    {
        text: "Organize",
        icon: <ActionPermContactCalendar />,
        to: "/organizer",
        permissions : ['organize-schedules']
    },
    {
        text: "Users",
        icon: <SocialPerson />,
        to: "/users"
    }
];

const menuFilter = (menu, permissions) => {
    // todo : filter here
    // console.log('menu', menu, permissions);
    return true;
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

    isActiveMenu(pathname) {
        return this.props.location.pathname == pathname;
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
                        style={this.isActiveMenu(menuItem.to)?{backgroundColor: 'rgba(0,0,0,0.2)'}:null}/>
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