import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {fullWhite} from 'material-ui/styles/colors';
import {browserHistory} from 'react-router';

import {ContentAdd, ActionAutorenew, ActionDelete} from 'material-ui/svg-icons';

class SemiButton extends Component{
    constructor() {
        super();
        this.linkTo = this.linkTo.bind(this);
    }

    linkTo(){
        if(this.props.link) browserHistory.push(this.props.link);
    }

    render() {
        let props = this.props;
        let params = {};
        switch(props.semiType) {
            case 'add':
                params.icon = <ContentAdd color={fullWhite} />;
                params.backgroundColor = "#a4c639";
                params.labelColor=fullWhite;
                break;
            case 'refresh':
                params.icon = <ActionAutorenew />;
                break;
            case 'remove':
                params.icon = <ActionDelete />;
                break;
        }
        // if(props.link) params.onClick = this.linkTo();
        return (<RaisedButton labelPosition="before"
                             type="button"
                             className="button rightMargin"
                             onClick={this.linkTo}
                             {...params}
                             {...this.props} />);
    }
}

SemiButton.propTypes = {
    link: PropTypes.string
};

export default SemiButton;