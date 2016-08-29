import React, { PropTypes, Component } from 'react';
import {HOC} from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import keycode from 'keycode';
import TextField from 'material-ui/TextField';
import ErrorMessage from '../forms/ErrorMessage';


class SemiText extends Component{
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.defaultValue || this.props.value || ''
        };
    }

    componentWillMount() {
        console.log('this.controlledValue(', this.controlledValue());
        this.props.setValue(this.controlledValue());
    }

    componentWillReceiveProps(nextProps) {
        // console.log('nextProps.value', this.props.getValue());
        // const isValueChanging = nextProps.value !== this.props.value;
        // if (isValueChanging || nextProps.defaultValue !== this.props.defaultValue) {
        //     const value = this.controlledValue(nextProps);
        //     if (isValueChanging || this.props.defaultValue === this.props.getValue()) {
        //         this.setState({ value });
        //         this.props.setValue(value);
        //     }
        // }
    }

    componentWillUpdate(nextProps, nextState) {
        // if (nextState._isPristine && // eslint-disable-line no-underscore-dangle
        //     nextState._isPristine !== this.state._isPristine) { // eslint-disable-line no-underscore-dangle
        //     // Calling state here is valid, as it cannot cause infinite recursion.
        //     const value = this.controlledValue(nextProps);
        //     this.props.setValue(value);
        //     this.setState({ value });
        // }
    }

    controlledValue = (props = this.props) => {
        return props.value || props.defaultValue || '';
    };

    handleBlur = (event) => {
        // this.props.setValue(event.currentTarget.value);
        if (this.props.onBlur) this.props.onBlur(event);
    };

    handleChange = (event) => {
        console.log('123', event.currentTarget.value);
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

    render() {
        // console.log('render: text', this.props.value);
        let {

            // Remove Formsy's properties for safety.
            getErrorMessage, getErrorMessages, getValue, hasValue, isFormDisabled, isFormSubmitted, isPristine, setValue, setValidation,
            isRequired, isValid, isValidValue, resetValue, showError, showRequired, validationError, validationErrors,

            // SemiForm's
            value, type,

            ...rest} = this.props;
        // console.log('rest', rest);

        let currentValue = this.props.getValue();

        return (
            <TextField
                ref="input"
                validationErrors={{
                    minLength: ErrorMessage.minLength,
                    maxLength: ErrorMessage.maxLength,
                    isEmail: ErrorMessage.email,
                    equalsField: ErrorMessage.equalsField
                }}

                {...rest}

                errorText={this.props.getErrorMessage()}
                onBlur={this.handleBlur}
                onChange={this.handleChange}
                // onFocus={onFocus}
                // onKeyDown={this.handleKeyDown} // for validate on press enter
                ref={this.setMuiComponentAndMaybeFocus}
                value={currentValue}
                // onChange={this.onChange}
            />
        );
    }
}

SemiText.propTypes = {
    onChange: PropTypes.func
};

export default HOC(SemiText);