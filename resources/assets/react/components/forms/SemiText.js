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
        // this.onChange = this.onChange.bind(this);
        // this.props.setValue = this.props.setValue.bind(this);
    }
    //
    // componentDidMount() {
    //     const { debounce = 200 } = this.props;
    //     this.setValidate = debounceFunc(this.props.setValue, debounce);
    // }
    //
    // componentWillReceiveProps() {
    //     const input = this.refs.input;
    //     input.setState({ value: input.getValue() || '' });
    // }
    //
    // onChange(event) {
    //     if (this.props.onChange)
    //         this.props.onChange(event);
    //     this.setValidate(event.currentTarget.value);
    // }
    //
    // setValue(value) {
    //     this.refs.input.setValue(value);
    // }



    componentWillMount() {
        this.props.setValue(this.controlledValue());
    }

    componentWillReceiveProps(nextProps) {
        const isValueChanging = nextProps.value !== this.props.value;
        if (isValueChanging || nextProps.defaultValue !== this.props.defaultValue) {
            const value = this.controlledValue(nextProps);
            if (isValueChanging || this.props.defaultValue === this.props.getValue()) {
                this.setState({ value });
                this.props.setValue(value);
            }
        }
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
        this.props.setValue(event.currentTarget.value);
        if (this.props.onBlur) this.props.onBlur(event);
    };

    handleChange = (event) => {
        this.setState({
            value: event.currentTarget.value,
        });
        if (this.props.onChange) this.props.onChange(event);
    };

    handleKeyDown = (event) => {
        if (keycode(event) === 'enter') this.props.setValue(event.currentTarget.value);
        if (this.props.onKeyDown) this.props.onKeyDown(event, event.currentTarget.value);
    };

    render() {
        // console.log('render: text');
        let {...rest} = this.props;
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
                onKeyDown={this.handleKeyDown}
                ref={this.setMuiComponentAndMaybeFocus}
                value={this.state.value}
                onChange={this.onChange}
            />
        );
    }
}

SemiText.propTypes = {
    onChange: PropTypes.func
};

export default HOC(SemiText);