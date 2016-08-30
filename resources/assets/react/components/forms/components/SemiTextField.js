import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import TextField from 'material-ui/TextField';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import VisibleOffIcon from 'material-ui/svg-icons/action/visibility-off';

class SemiTextField extends SemiInputComponent{
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
        if (currentValue && currentValue.length !== 0) {
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
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        return (
            <div>
                <TextField
                    {...rest}
                    style={{width: width}}
                    errorText={this.props.getErrorMessage()}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    value={currentValue}
                    />
                {clearIcon}
                {passwordIcon}
            </div>
        );
    }
}

export default HOC(SemiTextField);