/**
 * Material UI multi select
 *
 * Use with:
 * <MultiSelect fullWidth={true} value={this.state.values} onChange={(e,v) => this.setState({values: v})}>
 * 		<ListItem primaryText={"Option 1"} value={1} />
 * 		<ListItem primaryText={"Option 2"} value={2} />
 * 		<ListItem primaryText={"Option 3"} value={3} />
 * 		<ListItem primaryText={"Option 4"} value={4} />
 * </MultiSelect>
 *
 * this.state.values is an array of the values which are currently selected.
 **/
import React from 'react';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import Checkbox from 'material-ui/Checkbox';

class MultiSelect extends SelectField {
    render() {
        const styles = this.getStyles();
        const {
            autoWidth,
            children,
            style,
            labelStyle,
            iconStyle,
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
            value
        } = this.props;

        let labels = [];
        for(let i in children) {
            if(value.indexOf(children[i].props.value) >= 0) {
                labels.push(children[i].props.primaryText);
            }
        }

        if(labels.length === 0) {
            labels.push("None");
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
                        labelStyle={this.mergeStyles(styles.label, labelStyle)}
                        iconStyle={this.mergeStyles(styles.icon, iconStyle)}
                        underlineStyle={styles.hideDropDownUnderline}
                        autoWidth={autoWidth}
                        {...other}
                    >
                        {children.map(item => {
                            let checkbox = <Checkbox
                                checked={(value || []).indexOf(item.props.value) >= 0}
                                onCheck={(e,v) => {
			                		const index = value.indexOf(item.props.value);
			                		if(v === true) {
			                			if(index < 0) {
			                				value.push(item.props.value);
			                				if(this.props.onChange) this.props.onChange(e, value);
			                			}
			                		} else {
			                			if(index >= 0) {
			                				value.splice(index, 1);
			                				if(this.props.onChange) this.props.onChange(e, value);
			                			}
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

export default MultiSelect;