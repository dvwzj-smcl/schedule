import React, {Component, PropTypes} from 'react';
import DatePicker from 'material-ui/DatePicker';
import DateRangeIcon from '../../../../../../node_modules/material-ui/svg-icons/action/date-range';
import IconButton from '../../../../../../node_modules/material-ui/IconButton/IconButton';
import ClearIcon from '../../../../../../node_modules/material-ui/svg-icons/content/clear';
import {HOC} from 'formsy-react';

class SemiDate extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        const {defaultDate} = this.props;
        const value = this.props.getValue();
        if (typeof value === 'undefined' && typeof defaultDate !== 'undefined') {
            this.props.setValue(defaultDate);
        }
    }

    handleChange = (event, value) => {
        this.props.setValue(value);
        if (this.props.onChange) this.props.onChange(event, value);
    };

    handleClear = () => {
        this.props.setValue('');
    };

    render() {
        let {
            // Remove Formsy's properties for safety(may not necessary)
            getErrorMessage, getErrorMessages, getValue, hasValue, isFormDisabled, isFormSubmitted, isPristine, setValue,
            isRequired, isValid, isValidValue, resetValue, showError, showRequired,

            // SemiForm's
            value, type, validations, validationErrors,

            ...rest
        } = this.props;

        let currentValue = this.props.getValue();

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;
        if (this.props.showClearIcon && currentValue && currentValue.length !== 0) { // default to not show
            clearIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleClear.bind(this)}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        let dateIcon = null;
        if (this.props.showDateIcon !== false) {
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

SemiDate.propTypes = {
    defaultDate: PropTypes.object,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    validationError: PropTypes.string,
    validationErrors: PropTypes.object,
    validations: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value: PropTypes.object
};

export default HOC(SemiDate);



