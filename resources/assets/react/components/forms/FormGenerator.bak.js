import React, { PropTypes, Component } from 'react';

import SemiSelect from './SemiSelect';
import SemiDate from './SemiDate';
import SemiText from './SemiText';

import {Grid, Row, Col} from 'react-flexbox-grid';

class FormGenerator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: props.formTemplate.values ? props.formTemplate.values : {},
            data: props.formTemplate.data ? props.formTemplate.data : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setFormState(nextProps);
    }

    setFormState = (props) => {
        this.setState({
            values: props.formTemplate.values ? props.formTemplate.values : {},
            data: props.formTemplate.data ? props.formTemplate.data : {}
        });
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
                let rest = {
                    name,
                    floatingLabelText: item.label,
                    value: value,
                    required: item.required,
                    defaultValue: item.defaultValue,
                    disabled: item.disabled || false,
                    fullWidth: true
                };
                switch(item.type) {
                    case 'password':
                    case 'text':
                        component = (
                            <SemiText
                                {...rest}
                            />
                        );
                        break;
                    case 'select':
                        component = (
                            <SemiSelect
                                data={data[name]}
                                {...rest}
                            />
                        );
                        break;
                    case 'date':
                        component = (
                            <SemiDate
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