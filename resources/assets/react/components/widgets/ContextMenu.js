/* eslint-disable import/default */
import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import {NavigationMoreVert} from 'material-ui/svg-icons';

const iconButtonElement = (
    <IconButton
        touch={true}
        tooltip="more"
        tooltipPosition="bottom-left"
    >
        <NavigationMoreVert color={grey400} />
    </IconButton>
);

class ContextMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    // exposed function
    open = (event, externalData, options) => {
        // original (event is form Material-UI's RaisedButton click)
        // This prevents ghost click.
        // event.preventDefault();
        // let target = event.currentTarget;
        let data = this.props.data;
        for(let i in data) data[i]._hide = false;
        if(options && options.hide) {
            for(let key of options.hide) {
                let found = false;
                for(let i in data) {
                    if(data[i].id == key) {
                        data[i]._hide = true;
                        found = true;
                        break;
                    }
                }
            }
        }

        let target = event;
        this.setState({
            open: true,
            externalData,
            anchorEl: target
        });
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    onItemTouchTap = (event, menuItem, ...rest) => {
        console.log('menuItem, ...rest', menuItem, rest);
        if(this.props.onSelect) {
            this.props.onSelect(menuItem.key, this.state.externalData);
        }
        this.setState({open: false});
    };

    render() {
        let {data, isIconMenu, ...rest} = this.props;
        let {hide} = this.state;
        let items = data? [] : null;
        if(typeof data === 'object') { // object or array only
            for(let i in data) {
                let id = data[i].id ? data[i].id : parseInt(i);
                items.push(<MenuItem value={id} key={id} primaryText={data[i].name} style={{display: data[i]._hide ? 'none' : 'block'}} />);
            }
        }
        if(isIconMenu) {
            return (
                <IconMenu
                    iconButtonElement={iconButtonElement}
                    onItemTouchTap={this.onItemTouchTap}
                    {...rest}
                >
                    {items}
                </IconMenu>
            );
        }
        return (
            <Popover
                open={this.state.open}
                anchorEl={this.state.anchorEl}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
                onRequestClose={this.handleRequestClose}
                {...rest}
            >
                <Menu onItemTouchTap={this.onItemTouchTap}>
                {items}
                </Menu>
            </Popover>
        );
    }
}

export default ContextMenu;


