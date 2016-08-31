import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import DatePicker from 'material-ui/DatePicker';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

class SemiDatePicker extends SemiInputComponent{
    componentDidMount() {
        const { defaultDate } = this.props;
        const value = this.props.getValue();
        if (typeof value === 'undefined' && typeof defaultDate !== 'undefined') {
            this.props.setValue(defaultDate);
        }
    }
    handleChange = (event, value) => {
        this.props.setValue(value);
        this.props.onChange&&this.props.onChange(value);
    };
    render() {
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
            showError, showRequired,
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
        if (this.props.showClearIcon && currentValue && currentValue.length !== 0 && !this.props.disabled) {
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear.bind(this)}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        let dateIcon = null;
        if (!(this.props.showDateIcon === false)) {
            dateIcon = (
                <IconButton className="btn-icon" disabled>
                    <DateRangeIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        return (
            <div>
                <DatePicker
                    {...rest}
                    textFieldStyle={{cursor: this.props.disabled ? 'not-allowed' : null}}
                    style={{width: width, display: 'inline-block'}}
                    errorText={this.props.getErrorMessage()}
                    onChange={this.handleChange}
                    value={currentValue}
                    />
                {clearIcon}
                {dateIcon}
            </div>
        );
    }
}

export default HOC(SemiDatePicker);