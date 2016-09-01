import React, { PropTypes } from 'react';
import Formsy, {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import PaletteIcon from 'material-ui/svg-icons/image/palette';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { SwatchesPicker } from 'react-color';
import validator from 'validator';

Formsy.addValidationRule('isHexColor', function (values, value) {
    return value&&validator.isHexColor(value);
});

class SemiColorPicker extends SemiInputComponent{
    constructor(props) {
        super(props);
        this.state = {color:null,openModal:false};
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChangeInput(event,value){
        this.props.onChange && this.props.onChange(value, event);
        this.props.setValue(value);
    }
    handleColorChange(color){
        this.setState({color: color.hex});
    }
    handleOpen(){
        this.setState({
            color: this.props.getValue(),
            openModal: true
        });
    }
    handleClose(){
        this.setState({openModal: false});
    }
    handleSubmit(){
        let value = this.state.color;
        this.setState({
            color: null,
            openModal: false
        });
        this.props.setValue(value);
        this.props.onChange && this.props.onChange(value, event);
        this.refs.input.value = value;
    }
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

        let isHexColorValidationExists = false;
        for(let validation in validations){
            if(validation.match(/ishexcolor/gi)) isHexColorValidationExists = true;
        }
        if(!isHexColorValidationExists){
            validations['isHexColor'] = true;
            validationErrors['isHexColor'] = 'Invalid hex color code!';
        }

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
        let colorIcon = null;
        if (!(this.props.showColorIcon === false)) {
            colorIcon = (
                <IconButton className="btn-icon" onTouchTap={this.handleOpen}>
                    <PaletteIcon />
                </IconButton>
            );
            minusWidth += 36;
        }
        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
                />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                disabled={this.state.color ? false : true}
                onTouchTap={this.handleSubmit}
                />,
        ];

        return (
            <div>
                <TextField
                    ref="input"
                    {...rest}
                    inputStyle={{cursor: this.props.disabled ? 'not-allowed' : null}}
                    style={{width: width, display: 'inline-block'}}
                    errorText={this.props.getErrorMessage()}
                    onChange={this.handleChange}
                    value={currentValue} />
                {clearIcon}
                {colorIcon}
                <Dialog title="Color Picker"
                        actions={actions}
                        modal={false}
                        open={this.state.openModal}
                        onRequestClose={this.handleClose}>
                    <TextField id="colorPicker" style={{width: '320px'}} disabled value={this.state.color ? this.state.color: ''} />
                    <Paper style={{width: '320px', height: '30px', marginBottom: '30px', backgroundColor: this.state.color ? this.state.color: '#fff'}} zDepth={2}></Paper>
                    <SwatchesPicker onChange={this.handleColorChange} />
                </Dialog>
            </div>
        );
    }
}

export default HOC(SemiColorPicker);