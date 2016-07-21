import React, { Component, PropTypes } from 'react';
// import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

class SemiSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value: 0,
            data: props.data || false
        };
    }

    componentWillReceiveProps(nextProps, nextState){
        // console.log('[SemiSelector] (componentWillReceiveProps) this props',this.props);
        // console.log('[SemiSelector] (componentWillReceiveProps) nextState',nextState);
        // console.log('[SemiSelector] (componentWillReceiveProps) nextProps',nextProps);
        // if(typeof nextProps.selectValue !== "undefined"){
        //     console.log('set Value');
        //     // const input = this.refs.select;
        //     // input.setState({ value: nextProps.selectValue  });
        //     this.handleChange(null,null,1) ;
        // }


    }

    // not used
    setData(data) {
        this.setState({data});
    }

    render(){
        let {data} = this.props;
        console.log('render: select', data, this.props.value);
        let items = data? (
            data.map((column, index) => (
                <MenuItem value={column.id} key={index} primaryText={column.name} />
            ))
        ) : null;
        return (
                <FormsySelect ref="select" {...this.props} hintText="-- Please Select --" >
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



