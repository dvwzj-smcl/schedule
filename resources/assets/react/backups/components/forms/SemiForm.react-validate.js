import React, {PropTypes, Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {Form} from 'formsy-react';
import ReactDOM from 'react-dom';
import Loading from '../../../components/widgets/Loading';
import SemiValidation from './SemiValidation';
import {Grid, Row, Col} from 'react-flexbox-grid';
import TextField from 'material-ui/TextField';

class SemiForm extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            canSubmit: false,
            ready: props.onLoad ? false : true, // for loading spinner

            // * gen
            values: props.formTemplate.values ? props.formTemplate.values : {},
            data: props.formTemplate.data ? props.formTemplate.data : {}
        };
        this.notifyFormError = this.notifyFormError.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.submit = this.submit.bind(this);
        this.ajax = this.ajax.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    // * gen
    componentWillReceiveProps(nextProps) {
        // this.refs.form.reset();
        this.setFormState(nextProps);
    }

    // * gen
    setFormState = (props) => {
        this.setState({
            values: props.formTemplate.values ? props.formTemplate.values : {},
            data: props.formTemplate.data ? props.formTemplate.data : {}
        });
    };

    enableButton = () => {
        // console.log('valid');
        if (this.state.canSubmit === true) return;
        // console.log('enable!');
        this.setState({
            canSubmit: true
        });
    };

    disableButton = () => {
        // console.log('invalid');
        if (this.state.canSubmit === false) return;
        // console.log('disable!');
        this.setState({
            canSubmit: false
        });
    };

    componentDidMount() {
        if (this.props.onLoad) {
            this.props.onLoad(this.context.ajax).then((/*data*/) => {
                this.setState({ready: true})
            });
        }
    }

    ajax(method, url, data) {
        // todo: add Loading... to submit button
        return this.context.ajax.call(method, url, data);
    }

    onLoad(urls) { // called only once when mount
        if (Array.isArray(urls)) {
            return this.context.ajax.getAll(urls);
        }
        return this.context.ajax.call('get', urls);
    }

    onSubmit(data, error, event) {
        // console.log('data, error', data, error);
        if (this.props.onSubmit) {
            let promise = this.props.onSubmit(data, this.context.ajax);
            if (promise) {
                return promise.then(response => {
                    // todo: submit loading here...
                }).catch(error => {
                    // I find it better not forcing alert on error.
                    // this.context.dialog.alert(error, 'Error!');
                });
            }
        }
    }

    notifyFormError(/*data*/) {
    }

    // for triggering submit button using ref
    submit() {
        ReactDOM.findDOMNode(this.refs.submitBtn).click();
    }

    resetForm() {
        this.refs.form.reset();
    }

    render() {
        // console.log('render: form', this.state.ready);
        let props = this.props;
        let {
            children, formTemplate, noSubmitButton, submitLabel,
            hasReset, noButton, buttonRight, compact, // attributes
            onSubmit, // attributes
            ...rest} = props;


        /**
         *
         * Form Generator Section ------------------
         *
         */

        let components = [];
        let no_required = true;
        if(formTemplate) {
            let values = this.state.values;
            let data = this.state.data;

            let validators = formTemplate.validators;
            if (validators) {
                // todo: validator & component
            }

            for (let rowId in formTemplate.components) {

                let row = formTemplate.components[rowId];
                let settings = {};
                // console.log('row', row);
                if(!Array.isArray(row)) {
                    settings = row.settings;
                    row = row.items;
                }

                // process row settings
                // console.log('settings', settings);
                if(settings && settings.hide) continue;

                let cols = [];

                // calculate col width
                let hiddenCount = 0;
                for (let itemId in row) {
                    let item = row[itemId];
                    if(row[itemId].type == 'hidden') hiddenCount++;
                }
                let md = Math.floor(12 / (row.length - hiddenCount)); // equally width for now
                for (let itemId in row) {

                    let item = row[itemId],
                        component = null,
                        {name} = item;
                    let value = item.type == 'string' ? item.value : values[name];

                    //console.log('**value', value, item);
                    let isComponent = typeof item.type === 'function' || item.props;
                    if(isComponent) {
                        // console.log('item', item);
                        component = item;
                    } else {
                        let defaultValues = {
                            required: false,
                            disabled: false,
                            fullWidth: true
                        };

                        let vs = item.validations,
                            validations = item.required ? ['required'] : ['optional'];
                        if (vs) {
                            for (let v of vs) {
                                validations.push(v);
                            }
                        }
                        if(validations.indexOf('required')>=0){
                            no_required = false;
                        }
                        let overrideValues = { // props with different names or need processing
                            floatingLabelText: item.label, // todo: * and optional
                            hintText: item.hint ? item.hint : '',
                            value,
                            validations
                        };

                        let {type, ...rest} = Object.assign(defaultValues, item, overrideValues);

                        switch (type) {
                            case 'string':
                                component = (
                                    <div className="form-string">{value}</div>
                                );
                                break;
                            case 'text':
                                component = (
                                    <SemiValidation.components.TextField
                                        {...rest}
                                    />
                                );
                                break;
                            case 'numeric':
                                component = (
                                    <SemiValidation.components.TextField
                                        {...rest} type="numeric"
                                        />
                                );
                                break;
                            case 'hidden':
                                component = (
                                    <div style={{display: 'none'}}>
                                        <SemiValidation.components.TextField
                                            {...rest} type="hidden"
                                        />
                                    </div>
                                );
                                break;
                            case 'password':
                                component = (
                                    <SemiValidation.components.TextField
                                        {...rest} type="password"
                                    />
                                );
                                break;
                            case 'select':
                                component = (
                                    <SemiValidation.components.SelectField
                                        options={data[name]}
                                        {...rest}
                                    />
                                );
                                break;
                            case 'multiselect':
                                component = (
                                    <SemiValidation.components.MultipleSelectField
                                        options={data[name]} floatingLabelFixed={true}
                                        {...rest}
                                    />
                                );
                                break;
                            case 'empty':
                                component = (null);
                                break;
                            case 'color':
                                component = (
                                    <SemiValidation.components.ColorPicker
                                        {...rest}
                                    />
                                );
                                break;
                            case 'date':
                                component = (
                                    <SemiValidation.components.DatePicker
                                        {...rest}
                                    />
                                );
                                break;
                            case 'checkbox':
                                component = (
                                    <SemiValidation.components.Checkbox
                                        {...rest}
                                        />
                                );
                                break;
                            case 'slider':
                                component = (
                                    <SemiValidation.components.Slider
                                        {...rest}
                                        />
                                );
                                break;
                            case 'toggle':
                                component = (
                                    <SemiValidation.components.Toggle
                                        {...rest}
                                        />
                                );
                                break;
                        }
                    }
                    cols.push(<Col key={itemId} xs md={md}>{component}</Col>);
                } // item
                let rowComponent = (<Row key={rowId}>{cols}</Row>);
                components.push(rowComponent);
            } // row
        }

        /**
         *
         * End Form Generator Section ------------------
         *
         */

        let resetBtn = hasReset && !noButton ? (
            <SemiValidation.components.RaisedButton
                label="Reset"
                type="button"
                style={{marginTop: 24, marginLeft: 16}}
                onClick={this.resetForm}
                />
        ) : null;

        let submitBtn = noSubmitButton || props.noButton ? null : (
            <SemiValidation.components.RaisedButton
                formNoValidate
                secondary={true}
                style={{marginTop: 24, marginLeft: buttonRight? 16:0}}
                type="submit"
                label={submitLabel || 'Submit'}
                disabled={no_required ? false : !this.state.canSubmit}
                />);

        let formClass = `${buttonRight ? 'btn-right' : ''} ${compact ? 'compact' : ''}`;

        let buttons = buttonRight ? (<div className="btn-wrap">{resetBtn}{submitBtn}</div>) : <div className="btn-wrap">{submitBtn}{resetBtn}</div>;

        let formItems = (this.state.ready) ?
            // (formTemplate) ? <FormGenerator formTemplate={formTemplate}/> : children : <Loading inline/>;
            (formTemplate) ? components : children : <Loading inline/>;

        // console.log('rest', rest);

        return (
            <SemiValidation.components.Form
                className={`semiForm ${formClass}`}
                onSubmit={this.onSubmit}
                onInvalid={this.disableButton}
                onValid={this.enableButton}
                ref="form"
                {...rest}
            >
                {formItems}
                {buttons}
                <button style={{display:'none'}} ref="submitBtn" type="submit">Submit</button>
            </SemiValidation.components.Form>);
    }
}

SemiForm.propTypes = {
    hasReset: PropTypes.bool,
    formTemplate: PropTypes.object,
    submitLabel: PropTypes.string,
    enableButton: PropTypes.func,
    disableButton: PropTypes.func,
    getUrls: PropTypes.array,
    getCallback: PropTypes.func,
    submitUrl: PropTypes.object,
    submitForm: PropTypes.func,
    submitCallback: PropTypes.func,
    resetForm: PropTypes.func,
    notifyFormError: PropTypes.func,
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    noSubmitButton: PropTypes.bool
};
SemiForm.contextTypes = {
    ajax: PropTypes.object,
    dialog: PropTypes.object
};

export default SemiForm;