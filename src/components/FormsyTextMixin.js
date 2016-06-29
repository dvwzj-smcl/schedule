import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

const FormsyTextMixin = React.createClass({
    propTypes: {
        type: PropTypes.string
    },
    mixins: [Formsy.Mixin],
    handleOnChange(event){
        this.setValue(event.currentTarget[this.props.type === 'checkbox' ? 'checked' : 'value']);
    },
    render(){
        const cloneProps = Object.assign({}, this.props);
        cloneProps.onChange = this.handleOnChange;
        cloneProps.value = this.getValue();
        cloneProps.checked = this.props.type === 'checkbox' && this.getValue() ? 'checked' : null;
        return React.cloneElement(<FormsyText {...cloneProps} />);
    }
});

FormsyTextMixin.propTypes = {};

export default FormsyTextMixin;