import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Slider from 'material-ui/Slider';
import Chip from 'material-ui/Chip';

class SemiSliderInput extends SemiInputComponent{
    handleSlide(event, value){
        let nextValue = value;
        if(value==0&&this.props.required) nextValue = '';
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
        if(currentValue=='') currentValue = 0;

        let showValue = this.props.showValue&&this.props.showValue==true;

        // --- Icon Buttons
        let clearIcon = null;
        let minusWidth = 0;
        if (currentValue !== 0 && !this.props.disabled) {
            clearIcon = (
                <IconButton className="btn-icon" style={{marginLeft: 0, display: 'inline-block', verticalAlign: 'middle'}} onTouchTap={this.handleClear.bind(this)}>
                    <ClearIcon/>
                </IconButton>
            );
            minusWidth += 36;
        }
        if(showValue) minusWidth += 72;

        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

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
                <div>
                    <Chip
                        style={{
                        display: showValue?'inline-block':'none',
                        width: 72,
                        verticalAlign: 'middle'
                    }}>
                        {currentValue}
                    </Chip>
                    <Slider {...rest} value={currentValue} onChange={this.handleSlide.bind(this)} style={{width: width, display: 'inline-block', height: 66, verticalAlign: 'middle'}} />
                    {clearIcon}
                </div>
            </div>
        );
    }
}

export default HOC(SemiSliderInput);