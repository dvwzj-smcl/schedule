/* eslint-disable import/default */
import React, { Component } from 'react';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem'

class ContextMenu extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    // exposed function
    open = (event) => {
        // original (event is form Material-UI's RaisedButton click)
        // This prevents ghost click.
        // event.preventDefault();
        // let target = event.currentTarget;

        let target = event;
        this.setState({
            open: true,
            anchorEl: target
        });
    };

    handleRequestClose = () => {
        this.setState({open: false});
    };

    onItemTouchTap = (event, menuItem) => {
        if(this.props.onSelect) this.props.onSelect(menuItem.key);
        this.setState({open: false});
    };

    render() {
        let {data, ...rest} = this.props;
        let state = this.state;
        let items = data? [] : null;
        if(typeof data === 'object') { // object or array only
            for(let i in data) {
                let id = data[i].id ? data[i].id : parseInt(i);
                items.push(<MenuItem value={id} key={id} primaryText={data[i].name}/>);
            }
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


