import React, { Component, PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from '../../libs/FormsySelect';
import ErrorMessage from '../forms/ErrorMessage';
// import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

class SemiSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: 0,
            data: props.data || false
        };
        this.value = (props.multiple && !props.value) ? [] : props.value;
    }

    setData(data) {
        this.setState(data);
    }

    componentWillReceiveProps(nextProps){
        this.value = (nextProps.multiple && !nextProps.value) ? [] : nextProps.value;
    }

    render(){
        let {data, ...rest} = this.props;
        let items = data? [] : null;
        if(typeof data === 'object') { // object or array only
            for(let i in data) {
                let id = data[i].id ? parseInt(data[i].id) : parseInt(i);
                items.push(<MenuItem value={id} key={id} primaryText={data[i].name}/>);
            }
        }
        return (
            <FormsySelect ref="select" {...rest} value={this.value}
                validationErrors={{isArray: ErrorMessage.minLength}}
            >
                {items}
            </FormsySelect>
        );
    }
}

SemiSelect.propTypes = {
    data: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array
    ]),
    selectValue:PropTypes.number,
    name:PropTypes.string
};

SemiSelect.contextTypes = {
    router: PropTypes.object.isRequired
};

export default SemiSelect;



