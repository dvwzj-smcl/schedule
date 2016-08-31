import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import TextField from 'material-ui/TextField';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import VisibleOffIcon from 'material-ui/svg-icons/action/visibility-off';
import validator from 'validator';

class SemiTextField extends SemiInputComponent{
    handleChange = (event) => {
        let value = event.currentTarget.value;
        if(this.props.type && this.props.type.match(/numeric/gi) && value&&!validator.isNumeric(value)){
            value = this.props.getValue();
        }
        this.props.setValue(value);
        this.props.onChange&&this.props.onChange(event);
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

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;
        if (currentValue && currentValue.length !== 0 && !this.props.disabled) {
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear.bind(this)}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        let passwordIcon = null;
        if (type === 'password') {
            passwordIcon = (
                <IconButton className="btn-icon" disabled style={{display: this.props.type=='password' ? 'inline-block' : 'none'}}>
                    <VisibleOffIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        if (type&&type.match(/numeric/gi)) {
            validations['isNumeric'] = true;
            validationErrors['isNumeric'] = 'Accept only number!';
        }
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        return (
            <div>
                <TextField
                    {...rest}
                    type={type||'text'}
                    inputStyle={{cursor: this.props.disabled ? 'not-allowed' : null}}
                    style={{width: width}}
                    errorText={this.props.getErrorMessage()}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange.bind(this)}
                    value={currentValue}
                    />
                {clearIcon}
                {passwordIcon}
            </div>
        );
    }
}

export default HOC(SemiTextField);