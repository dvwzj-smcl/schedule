import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import Validation from 'react-validation';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';
import {ListItem} from 'material-ui/List';
import AutoComplete from 'material-ui/AutoComplete';

function handleError(props){
    let rules = Validation.rules;
    let state = props.states[props.name];
    let error = props.errors[props.name];
    let value = props.value;
    if (props.states.hasOwnProperty(props.name)) {
        value = props.states[props.name].value;
    }
    if (React.isValidElement(error) || error && error.indexOf(':')!==-1) {
    }else{
        error = state && state.isUsed && state.isChanged && error;
    }
    if (error) {
        error = React.isValidElement(error) ? error : error.split && error.split(':')[0];
    }
    return (error && rules[error] && rules[error].hint(value)) || error;
}

class MultiSelect extends SelectField {
    render() {
        const {
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
            floatingLabelStyle,
            hintStyle,
            hintText,
            fullWidth,
            errorText,
            onFocus,
            onBlur,
            onChange,
            value,
            ...other
            } = this.props;

        let labels = [];
        for(let i in children) {
            if(value.indexOf(children[i].props.value) >= 0) {
                labels.push(children[i].props.primaryText);
            }
        }

        let myHintText = hintText;
        if(labels.length === 0) {
            //labels.push("None");
            myHintText = (!hintText && !floatingLabelText) ? ' ' : hintText;
        }

        return (
            <TextField
                style={style}
                floatingLabelText={floatingLabelText}
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
                    <div style={{position:"absolute", bottom: 12, left:0, width: "100%", overflow:"hidden" }}>{labels.join(", ")}</div>
                    <DropDownMenu
                        disabled={disabled}
                        style={{width:"100%"}}
                        autoWidth={autoWidth}
                        iconStyle={{right: 0}}
                        underlineStyle={{
                          borderTop: 'none'
                        }}
                        {...other}
                        >
                        {children.map(item => {
                            let checkbox = <Checkbox
                                checked={(value || []).indexOf(item.props.value) >= 0}
                                onCheck={(e,v) => {
			                		const index = value.indexOf(item.props.value);
                                    if(index < 0) {
                                        value.push(item.props.value);
                                        if(this.props.onChange) this.props.onChange(e, index, value);
                                    }else{
                                        value.splice(index, 1);
                                        if(this.props.onChange) this.props.onChange(e, index, value);
                                    }
			                	}} />;
                            return React.cloneElement(item, {
                                leftCheckbox: checkbox
                            });
                        })}
                    </DropDownMenu>
                </div>
            </TextField>
        );
    }
}

export class ValidationForm extends Validation.components.Form {
    getData(){
        return Object.keys(this.state.states).map((key)=> {
            let obj = {};
            obj[key] = this.state.states[key].value;
            return obj;
        }).reduce((a,b)=>Object.assign({},a,b));
    }
    _update(component, event, isChanged, isUsed, value) {
        this.state.states[component.props.name] = this.state.states[component.props.name] || {};
        let componentState = this.state.states[component.props.name];
        let checkbox = (component.props.type === 'checkbox' || component.props.type === 'radio');
        Object.assign(componentState, {
            value: value ? value : event.target.value,
            isChanged: isChanged || componentState.isChanged || event.type === 'change',
            isUsed: isUsed || checkbox || componentState.isUsed || event.type === 'blur',
            isChecked: !componentState.isChecked
        });
        this._validate();
    }
    _clone(children) {
        return React.Children.map(children, child => {
            if (typeof child !== 'object') {
                return child;
            }
            let props = {};
            let isValidationComponent = child.props.validations && child.props.validations.length;
            if (child.type === Validation.components.Button || child.type === SemiValidation.components.FlatButton || child.type === SemiValidation.components.RaisedButton || isValidationComponent) {
                props = Object.assign({}, this.state);

                if (isValidationComponent) {
                    this._extendProps(props);
                }
            }
            props.children = this._clone(child.props.children);
            return React.cloneElement(child, props);
        }, this);
    }
}
export class ValidationTextField extends Validation.components.Input {
    render(){
        let {
            _register,
            _update,
            _validate,
            validations,
            states,
            errors,
            errorClassName,
            containerClassName,
            ...rest} = this.props;
        return (
            <div className={this.props.containerClassName || null}>
                <TextField
                    ref='node'
                    type='text'
                    {...rest}
                    errorText={handleError(this.props)}
                    className={this.props.className || null}
                    defaultValue={this.props.defaultValue}
                    onChange={this.handleChange.bind(this)}
                    onBlur={this.handleBlur.bind(this)} />
            </div>
        );
    }
}

export class ValidationFlatButton extends Validation.components.Button {
    render(){
        let {errors, errorClassName, states, ...props} = this.props;
        let isDisabled = Object.keys(errors).length==0 ? false : true;
        return (
            <div className={this.props.containerClassName || null}>
                <FlatButton disabled={isDisabled} {...props} />
            </div>
        );
    }
}
export class ValidationRaisedButton extends Validation.components.Button {
    render(){
        let {errors, errorClassName, states, ...props} = this.props;
        let isDisabled = Object.keys(errors).length==0 ? false : true;
        return (
            <div className={this.props.containerClassName || null}>
                <RaisedButton disabled={isDisabled} {...props} />
            </div>
        );
    }
}
export class ValidationSelectField extends Validation.components.Select {
    handleChange(event, index, value){
        this.props._update(this, event, true, true, value);
        event.persist();
        this.props.onChange && this.props.onChange(event, index, value);
    }
    render() {
        let {
            _register,
            _update,
            _validate,
            validations,
            states,
            errors,
            errorClassName,
            containerClassName,
            options,
            ...rest} = this.props;
        let value = this.props.states.hasOwnProperty(this.props.name) ? this.props.states[this.props.name].value : (this.props.value ? this.props.value : (this.props.multiple ? [] : ""));
        return (
            <div className={this.props.containerClassName || null}>
                {this.props.multiple ?
                    <MultiSelect ref='node' {...rest} value={value} onChange={this.handleChange.bind(this)}  >
                        {options.map((option, index)=><ListItem key={index} value={option.id} primaryText={option.name} />)}
                    </MultiSelect>
                    :
                    <SelectField ref='node' {...rest} value={value} onChange={this.handleChange.bind(this)}>
                        {options.map((option, index)=><MenuItem key={index} value={option.id} primaryText={option.name}/>)}
                    </SelectField>
                }
            </div>
        );
    }
}
export class ValidationMultipleSelectField extends ValidationSelectField {
    render() {
        return (
            <ValidationSelectField {...this.props} multiple />
        )
    }
}
export class ValidationAutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sources: props.dataSource ? (typeof props.dataSource == "object" ? props.dataSource : []) : []
        };
        this.props._register(this);
        this.handleNewRequest = this.handleNewRequest.bind(this);
        this.handleUpdateInput = this.handleUpdateInput.bind(this);
    }
    ajax(method, url, data, success, error){
        //data = JSON.stringify(data);
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }
    handleNewRequest(chosenRequest, index){
        const {value} = chosenRequest;
        this.props._update(this, event, true, true, value);
        this.props.onChange && this.props.onChange(event, index, value);
    }
    handleUpdateInput(value,e){
        if(typeof this.props.dataSource == "string") {
            if(value) {
                let search = this.props.dataSourceSearch ? this.props.dataSourceSearch : 'search';
                let data = {};
                data[search] = value;
                this.ajax('get', this.props.dataSource, data, (res)=>{
                    let r = this.props.dataSourceResult;
                    let sources = (res[r]?res[r]:[]).map((item)=>{
                        let v = this.props.dataSourceMap.value ? this.props.dataSourceMap.value.split('.').reduce((a, b) => a[b], item) : (item.value ? item.value : item);
                        let t = this.props.dataSourceMap.text ? this.props.dataSourceMap.text.split('.').reduce((a, b) => a[b], item) : (item.text ? item.text : item);

                        return {
                            value: v,
                            text: t
                        }
                    });
                    this.setState({sources});
                });
            }else{
                this.setState({sources: typeof this.props.dataSource == "object" ? this.props.dataSource : []});
            }
        }else if(typeof this.props.dataSource == "object"){
            if(value) {
                this.setState({sources: this.props.dataSource});
            }else{
                this.setState({sources: []});
            }
        }
        if(!value) {
            this.props._update(this, event, true, true, null);
            this.props.onChange && this.props.onChange(event, index, null);
        }
    }
    render() {
        let {
            _register,
            _update,
            _validate,
            validations,
            states,
            errors,
            errorClassName,
            containerClassName,
            dataSource,
            ...rest} = this.props;
        return (
            <AutoComplete
                ref='node'
                {...rest}
                errorText={handleError(this.props)}
                dataSource={this.state.sources}
                className={this.props.className || null}
                defaultValue={this.props.defaultValue}
                onNewRequest={this.handleNewRequest}
                filter={AutoComplete.caseInsensitiveFilter}
                dataSourceConfig={{value: 'text', text: 'text'}}
                onUpdateInput={this.handleUpdateInput} />
        )
    }
}

const components = Object.assign({}, Validation.components, {
    Form: ValidationForm,
    TextField: ValidationTextField,
    RaisedButton: ValidationRaisedButton,
    SelectField: ValidationSelectField,
    MultipleSelectField: ValidationMultipleSelectField,
    AutoComplete: ValidationAutoComplete
});

const SemiValidation = Object.assign({}, Validation, {components});

export default SemiValidation;