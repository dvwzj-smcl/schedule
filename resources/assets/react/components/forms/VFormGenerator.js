import React, { PropTypes, Component } from 'react';
import SemiValidation from './SemiValidation';

import {Grid, Row, Col} from 'react-flexbox-grid';

class FormGenerator extends Component {
    constructor(props) {
        super(props);
        this.setFormState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setFormState(nextProps);
    }

    setFormState = (props) => {
        this.state = {
            values: props.formTemplate.values ? props.formTemplate.values : {},
            data: props.formTemplate.data ? props.formTemplate.data : {}
        }
    };

    render() {
        let formTemplate = this.props.formTemplate;
        let components = [];
        let values = this.state.values;
        let data = this.state.data;
        // todo: validator & component
        for(let rowId in formTemplate.components) {

            let row = formTemplate.components[rowId];
            let cols = [];
            let md = Math.floor(12/row.length); // equally width for now
            for(let itemId in row) {

                let item = row[itemId];
                let component = null;
                // let {type, validations, ...rest} = item;
                // Object.assign(rest, {
                //     fullWidth: true
                // });

                let {name} = item;
                let value = values[name]; // todo

                let defaultValues = {
                    required: false,
                    disabled: false,
                    fullWidth: true
                };

                let validations = ['optional'];

                let overrideValues = { // props with different names or need processing
                    floatingLabelText: item.label, // todo: * and optional
                    hintText: item.hint ? item.hint : '',
                    value,
                    validations
                };

                let {type, ...rest} = Object.assign(defaultValues, item, overrideValues);

                console.log('rest', rest);


                // let rest = {
                //     name,
                //     floatingLabelText: item.label,
                //     value: value,
                //     required: item.required,
                //     defaultValue: item.defaultValue,
                //     disabled: item.disabled || false,
                //     fullWidth: true,
                //     floatingLabelFixed: item.floatingLabelFixed || false
                // };

                switch(type) {
                    case 'text':
                        component = (
                            <SemiValidation.components.TextField
                                {...rest}
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
                    case 'date':
                        component = (
                            <SemiValidation.components.DatePicker
                                {...rest}
                            />
                        );
                        break;
                }
                cols.push(<Col key={itemId} xs md={md}>{component}</Col>);
            } // item
            let rowComponent = (<Row key={rowId}>{cols}</Row>);
            components.push(rowComponent);

        } // row
        return (
            <div>
                {components}
            </div>
        )
    }
}

FormGenerator.propTypes = {
    template: PropTypes.object,
    values: PropTypes.object,
    data: PropTypes.object
};

export default FormGenerator;