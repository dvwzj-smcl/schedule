import React, { PropTypes, Component } from 'react';
import {HOC} from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';
import ErrorMessage from '../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import VisibleOffIcon from 'material-ui/svg-icons/action/visibility-off';

class SemiText extends Component{
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.setValue(this.controlledValue());
    }

    controlledValue = (props = this.props) => {
        return props.value || props.defaultValue || '';
    };

    handleBlur = (event) => {
        this.props.setValue(event.currentTarget.value);
        if (this.props.onBlur) this.props.onBlur(event);
    };

    handleChange = (event) => {
        this.props.setValue(event.currentTarget.value);
        if (this.props.onChange) this.props.onChange(event);
    };

    // ---- For validate on press enter
    // handleKeyDown = (event) => {
    //     console.log('456', event.currentTarget.value, keycode(event));
    //     let value = event.currentTarget.value;
    //     if (keycode(event) === 'backspace' && value.length === 1) this.props.setValue(''); // trick
    //     if (keycode(event) === 'enter') this.props.setValue(value);
    //     if (this.props.onKeyDown) this.props.onKeyDown(event, value);
    // };

    // For example only. Formsy already has form.reset method. See SemiForm.resetForm
    reset = () => {
        this.props.setValue(this.controlledValue());
    };

    handleClear = () => {
        this.props.setValue('');
    };

    render() {
        // console.log('render: text', this.props.validations);
        let {

            // Remove Formsy's properties for safety(may not necessary)
            getErrorMessage, getErrorMessages, getValue, hasValue, isFormDisabled, isFormSubmitted, isPristine, setValue,
            isRequired, isValid, isValidValue, resetValue, showError, showRequired,

            // SemiForm's
            value, type, validations, validationErrors,

            ...rest} = this.props;
        
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
                <IconButton className="btn-icon" disabled>
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
                    // onFocus={onFocus}
                    // onKeyDown={this.handleKeyDown} // for validate on press enter
                    ref={this.setMuiComponentAndMaybeFocus}
                    value={currentValue}
                />
                {clearIcon}
                {passwordIcon}
            </div>
        );
    }
}

SemiText.propTypes = {
    onChange: PropTypes.func
};

export default HOC(SemiText);