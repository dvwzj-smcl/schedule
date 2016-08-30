import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import ErrorMessage from '../../forms/ErrorMessage';
import Toggle from 'material-ui/Toggle';

class SemiToggleInput extends SemiInputComponent{
    handleToggle(event, value){
        let nextValue = value;
        if(value==false&&this.props.required) nextValue = '';
        this.props.setValue(nextValue);
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
                {this.props.label ? (
                <div
                    style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    width: '100%',
                    height: '24px',
                    display: 'inline-block',
                    position: 'relative',
                    fontFamily: 'Roboto, sans-serif',
                    transition: 'height 200ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                    backgroundColor: 'transparent'
                }}>
                    <label
                        style={{
                            position: 'absolute',
                            lineHeight: '22px',
                            top: '38px',
                            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                            zIndex: 1,
                            cursor: 'text',
                            transform: 'perspective(1px) scale(0.75) translate3d(0px, -28px, 0px)',
                            transformOrigin: 'left top 0px',
                            pointerEvents: 'none',
                            color: 'rgba(0, 0, 0, 0.498039)',
                            WebkitUserSelect: 'none'
                    }}>
                        {this.props.label}
                    </label>
                </div>
                ) : null}
                <div style={{marginTop: 22}}>
                    <Toggle {...rest} label={currentValue?this.props.labelOn||'On':this.props.labelOff||'Off'} toggled={toggled} onToggle={this.handleToggle.bind(this)} style={{width}} />
                </div>
            </div>
        );
    }
}

export default HOC(SemiToggleInput);