import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from '../../libs/FormsySelect';
// import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

class SemiSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: 0,
            data: props.data || false
        };
        this.onChange = this.onChange.bind(this);
    }

    componentWillReceiveProps(nextProps, nextState){
    }

    // onChange = (event, index, value) => {
    //     console.log('***', this.props.multiple, event, index, value);
    //     if(this.props.multiple) {
    //         const stateValueIndex = this.state.value.indexOf(value);
    //         if (stateValueIndex === -1) {
    //             this.state.value.push(value);
    //         } else {
    //             this.state.value.splice(stateValueIndex, 1);
    //         }
    //     }
    // };

    // not used
    setData(data) {
        this.setState({data});
    }

    render(){
        let {data, ...rest} = this.props;
        // console.log('rest', rest);
        // console.log('render: select', data, this.props.value);
        let items = data? (
            data.map((column, index) => (
                <MenuItem value={column.id} key={index} primaryText={column.name} />
            ))
        ) : null;
        return (
                <FormsySelect ref="select" {...rest} onChange={this.onChange} hintText="-- Please Select --" >
                    {items}
                </FormsySelect>
        );
    }
}

SemiSelect.propTypes = {
    dataSelector: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]),
    selectValue:React.PropTypes.number,
    name:React.PropTypes.string
};

SemiSelect.contextTypes = {
    router: PropTypes.object.isRequired
};


// const mapStateToProps = ({ routing }) => ({ routing });
// export default connect(mapStateToProps,null,null,{ withRef: true })(SemiSelector);

export default SemiSelect;



