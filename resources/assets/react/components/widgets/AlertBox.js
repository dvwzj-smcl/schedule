/* eslint-disable import/default */
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


class AlertBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose(){
        this.props.alertFunction() ;
    }

    render() {
        const actions = [
            <FlatButton
                label="Ok"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
        return (
            <MuiThemeProvider >
                <Dialog
                    titleStyle={style.dialogTitleError}
                    title="Alert!"
                    actions={actions}
                    modal={false}
                    open={this.props.openAlertBox}
                    onRequestClose={this.handleClose}
                    bodyStyle={{marginTop:'20px'}}
                    autoScrollBodyContent={true}
                    style={{zIndex :'990'}}
                >
                    {this.props.alertText}
                </Dialog>
            </MuiThemeProvider>
        );
    }
}

AlertBox.propTypes = {
    openAlertBox: PropTypes.bool.isRequired,
    alertText: PropTypes.string.isRequired,
    alertFunction: PropTypes.func.isRequired
};

AlertBox.contextTypes = {
    router: PropTypes.object.isRequired
};

const style = {
    dialogTitleError:{
        backgroundColor: '#C62828',
        color: '#FFFFFF'
    }
};

export default connect(
    (state)=>{
        return {
            routing: state.routing
        };
    }
)(AlertBox);


