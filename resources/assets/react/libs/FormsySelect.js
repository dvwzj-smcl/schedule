import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import SelectField from './SelectField';
import { setMuiComponentAndMaybeFocus } from 'formsy-material-ui/lib/utils';

const FormsySelect = React.createClass({

    propTypes: {
        children: PropTypes.node,
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func,
        validationError: PropTypes.string,
        validationErrors: PropTypes.object,
        validations: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        multiple: PropTypes.bool,
        data: PropTypes.object,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number])
    },

    mixins: [Formsy.Mixin],

    getInitialState() {
        let value = this.props.value;
        if(!value) {
            if(this.props.multiple) value = [];
        }
        return {
            hasChanged: false,
            data: this.props.data || false,
            value // for multiple only
        };
    },

    handleChange(event, index, _value) {
        let value = (this.props.multiple) ? this.state.value : _value;

        // console.log('value1', value, _value);

        // *** don't need this. the example confuse you
        // if(this.props.multiple) {
        //     const stateValueIndex = value.indexOf(_value);
        //     if (stateValueIndex === -1) {
        //         value.push(_value);
        //     } else {
        //         value.splice(stateValueIndex, 1);
        //     }
        // }

        this.setValue(value);

        // todo: multiple check
        this.setState({
            hasChanged: value !== ''
        });

        if (this.props.onChange) this.props.onChange(event, index, index);
    },

    setMuiComponentAndMaybeFocus: setMuiComponentAndMaybeFocus,

    render() {

        let { value } = this.props;
        // console.log('this.state', this.state, value);

        // todo: fixhere
        const { validations, // eslint-disable-line no-unused-vars
            validationError, // eslint-disable-line no-unused-vars
            validationErrors, // eslint-disable-line no-unused-vars
            ...rest } = this.props;

        value = this.state.hasChanged ? this.getValue() : value;

        // console.log('this.getErrorMessage()', this.getErrorMessage());

        return (
            <SelectField
                {...rest}
                errorText={this.getErrorMessage()}
                onChange={this.handleChange}
                ref={this.setMuiComponentAndMaybeFocus}
                value={value}
            >
                {this.props.children}
            </SelectField>
        );
    }
});

export default FormsySelect;