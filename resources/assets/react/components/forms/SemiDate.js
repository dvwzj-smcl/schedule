import React, { Component, PropTypes } from 'react';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import ErrorMessage from '../forms/ErrorMessage';

class SemiSelect extends Component {
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

SemiSelect.propTypes = {
    name:PropTypes.string
};

export default SemiSelect;



