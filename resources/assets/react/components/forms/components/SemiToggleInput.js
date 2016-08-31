import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import ErrorMessage from '../../forms/ErrorMessage';
import Toggle from 'material-ui/Toggle';

class SemiToggleInput extends SemiInputComponent{
    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue);
        let defaultValue = value ? value : false;
        return defaultValue;
    };
    handleToggle(event, value){
        // original
        // let nextValue = value;
        // if(value==false&&this.props.required) nextValue = '';
        // this.props.setValue(nextValue);
        // this.props.onChange&&this.props.onChange(value, event);

        // fix: required = true only (eg. accept term and condition)
        //let nextValue = !value;
        //let nextValue = value==false ? '' : true;

        this.props.setValue(value);
        this.props.onChange&&this.props.onChange(value, event);
    }
    render() {
        //console.log('render: SemiTextField', this.props.validations);
        let {
            getErrorMessage,
            getErrorMessages,
            getValue,
            hasValue,
            isFormDisabled,
            isFormSubmitted,
            isPristine,
            setValue,
            isRequired,
            isValid,
            isValidValue,
            resetValue,
            showError,
            showRequired,
            value,
            type,
            validations,
            validationErrors,
            ...rest
        } = this.props;

        let currentValue = this.props.getValue();

        let toggled = currentValue==true ? true : false;

        let width = (this.props.fullWidth ? `100%` : `auto`);

        return (
            <div>
                <div style={{marginTop: 22}}>
                    <Toggle {...rest} toggled={toggled} onToggle={this.handleToggle.bind(this)} style={{width}} />
                </div>
            </div>
        );
    }
}

export default HOC(SemiToggleInput);