import React, { Component, PropTypes } from 'react';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import ErrorMessage from '../forms/ErrorMessage';

class SemiDate extends Component {
    constructor() {
        super();
    }

    render(){
        let {...rest} = this.props;
        return (
            <FormsyDate
                {...rest}
            />
        );
    }
}

SemiDate.propTypes = {
};

export default SemiDate;



