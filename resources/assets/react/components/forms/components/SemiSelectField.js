import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

class SemiSelectField extends SemiInputComponent{
    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue);
        let valueIsObject = typeof value=='object';
        let defaultValue = props.multiple ? (valueIsObject ? value : (value ? [value] : props.required ? '' : [])) : (valueIsObject ? value[0] : props.required ? '' : null);
        return defaultValue;
    };
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

            autoWidth,
            children,
            style,
            underlineDisabledStyle,
            underlineFocusStyle,
            underlineStyle,
            errorStyle,
            selectFieldRoot,
            disabled,
            floatingLabelText,
            floatingLabelFixed,
            floatingLabelStyle,
            hintStyle,
            hintText,
            fullWidth,
            errorText,
            onFocus,
            onBlur,
            onChange,

            value,
            options,
            multiple,
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
        let items = options ? [] : null;
        if(typeof options === 'object') { // object or array only
            for(let i in options) {
                let id = options[i].id ? parseInt(options[i].id) : parseInt(i);
                items.push(<ListItem value={id} key={id} primaryText={options[i].name}/>);
            }
        }
        let labels = [];

        if(children==undefined&&items) children = items;
        if(currentValue==undefined) currentValue = multiple ? [] : null;
        if(floatingLabelFixed==undefined) floatingLabelFixed = true;

        let valueIsObject = typeof currentValue=='object'&&currentValue!==null;

        if(valueIsObject) {
            for (let i in children) {
                if (currentValue.indexOf(children[i].props.value) >= 0) {
                    labels.push(children[i].props.primaryText);
                }
            }
        }else if(currentValue){
            labels = [currentValue];
        }
        let checkboxItems = children ? children.map((item, i) => {
            let checkbox = <Checkbox
                checked={(valueIsObject ? currentValue.indexOf(item.props.value) >= 0 : currentValue==item.props.value)}
                onCheck={(e,v) => {
                    if(multiple){
                        const index = currentValue.indexOf(item.props.value);
                        if(index < 0) {
                            currentValue.push(item.props.value);
                            this.props.onChange&&this.props.onChange(currentValue, index);
                        }else{
                            currentValue.splice(index, 1);
                            this.props.onChange&&this.props.onChange(currentValue, index);
                        }
                    }else{
                        currentValue = item.props.value;
                        this.refs.dropdown.handleRequestCloseMenu();
                        this.props.onChange&&this.props.onChange(currentValue, i);
                    }
                    this.props.setValue(currentValue);
			    }} />;
            return React.cloneElement(item, {
                leftCheckbox: checkbox
            });
        }) : null;

        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);
        let textFieldStyle = Object.assign({},style,{width});

        return (
            <div>
                <TextField
                    ref="input"
                    style={textFieldStyle}
                    floatingLabelText={floatingLabelText}
                    floatingLabelFixed={floatingLabelFixed}
                    floatingLabelStyle={floatingLabelStyle}
                    hintStyle={hintStyle}
                    hintText={(!hintText && !floatingLabelText) ? ' ' : hintText}
                    fullWidth={fullWidth}
                    errorText={errorText}
                    underlineStyle={underlineStyle}
                    errorStyle={errorStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    underlineDisabledStyle={underlineDisabledStyle}
                    underlineFocusStyle={underlineFocusStyle}
                    >
                    <div style={{width: "100%"}}>
                        <div style={{position:"absolute", bottom: floatingLabelFixed ? 26 : 12, left:0, width: "100%", overflow:"hidden" }}>{labels.join(", ")}</div>
                        <DropDownMenu
                            ref="dropdown"
                            disabled={disabled}
                            style={{width:"100%"}}
                            autoWidth={/*autoWidth*/false}
                            iconStyle={{right: 0}}
                            underlineStyle={{
                                borderTop: 'none'
                            }}
                            {...rest}
                            >
                            {checkboxItems}
                        </DropDownMenu>
                    </div>
                </TextField>
                {clearIcon}
            </div>
        );
    }
}

export default HOC(SemiSelectField);