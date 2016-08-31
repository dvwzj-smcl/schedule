import React, { PropTypes } from 'react';
import {HOC} from 'formsy-react';
import SemiInputComponent from './SemiInputComponent';
import AutoComplete from 'material-ui/AutoComplete';
import ErrorMessage from '../../forms/ErrorMessage';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import validator from 'validator';

class SemiAutoComplete extends SemiInputComponent{
    state = {
        sources: []
    };
    controlledValue = (props = this.props) => {
        let value = (props.value || props.defaultValue || props.searchText || '');
        return value;
    };
    handleClear = () => {
        this.props.setValue('');
        this.props.onChange&&this.props.onChange('', null, event);
        this.refs.input.setState({searchText: ''});
    }
    handleNewRequest(chosenRequest, index){
        const {value} = chosenRequest;
        let searchText = value;
        if(this.props.typeahead) {
            let sources = typeof this.props.dataSource=='object' ? this.props.dataSource : this.state.sources;
            for (let i in sources) if (sources[i].value == value) searchText = sources[i].text;
        }
        this.props.setValue(searchText);
        this.props.onChange&&this.props.onChange(searchText, index, event);
    }
    handleUpdateInput(value,e){
        if(typeof this.props.dataSource == "string") {
            if(value) {
                let search = this.props.dataSourceSearch ? this.props.dataSourceSearch : 'search';
                /*
                let data = {};
                data[search] = value;
                */
                this.context.ajax.call('get', `${this.props.dataSource}?${search}=${value}`, null).then(res=>{
                    console.log('res', res);
                }).catch(error=>{
                    console.log('error', error);
                });
                /*
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
                */
            }else{
                this.setState({sources: []});
            }
        }else if(typeof this.props.dataSource == "object"){
            if(value) {
                this.setState({sources: this.props.dataSource});
            }else{
                this.setState({sources: []});
            }
        }

        let searchText = this.props.typeahead ? value : '';
        this.props.setValue(searchText);
        this.props.onChange&&this.props.onChange(searchText, index, event);
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

        let width = (this.props.fullWidth ? `calc(100% - ${minusWidth}px)` : `auto`);

        let sources = typeof this.props.dataSource=='object' ? this.props.dataSource : this.state.sources;

        return (
            <div>
                <AutoComplete
                    ref="input"
                    {...rest}
                    style={{width: width}}
                    errorText={this.props.getErrorMessage()}
                    dataSource={sources}
                    value={currentValue}
                    className={this.props.className || null}
                    onNewRequest={this.handleNewRequest.bind(this)}
                    filter={AutoComplete.caseInsensitiveFilter}
                    dataSourceConfig={{value: 'text', text: 'text'}}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    />
                {clearIcon}
            </div>
        );
    }
}

SemiAutoComplete.contextTypes = {
    router: PropTypes.object,
    helper: PropTypes.object,
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

export default HOC(SemiAutoComplete);