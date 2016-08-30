import React, { PropTypes, Component } from 'react';

class SemiInputComponent extends Component{
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

    reset = () => {
        this.props.setValue(this.controlledValue());
    };

    handleClear = () => {
        this.props.setValue('');
    };

    render() {
        return (
            <div />
        );
    }
}

SemiInputComponent.propTypes = {
    onChange: PropTypes.func
};

export default SemiInputComponent;