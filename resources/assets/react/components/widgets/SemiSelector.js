import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

const debounceFunc = function(fn, delay) {
    let timer = null;
    return function () {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

class SemiSelector extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            value:0
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const { debounce = 200 } = this.props;
        this.setValidate = debounceFunc(this.refs.select.setValue, debounce);
    }

    // componentWillReceiveProps(nextProps, nextState){
    //     console.log('[SemiSelector] (componentWillReceiveProps) this props',this.props);
    //     console.log('[SemiSelector] (componentWillReceiveProps) nextState',nextState);
    //     console.log('[SemiSelector] (componentWillReceiveProps) nextProps',nextProps);
    //     const input = this.refs.select;
    //     input.setState({ value: input.getValue() || 0 });
    // }

    handleChange(event, index, value){
         // this.setState({value});
        // this.setValidate(event.currentTarget.value);
        // const input = this.refs.select;
        // input.setState({ value: value });
        console.log('handleChange',value);
        const input = this.refs.select;
        input.setState({ value: value  });
    }

    render(){
        let {dataSelector} = this.props;
        // console.log('dataSelector',dataSelector);
        // let items = [] ;
        // for(var key in dataSelector) {
        //     if(dataSelector.hasOwnProperty(key)) {
        //         items.push(<MenuItem value={dataSelector[key].id} key={key} primaryText={dataSelector[key].name} />);
        //
        //     }
        // }

        return (
                <FormsySelect  ref="select"  {...this.props}  onChange={this.handleChange} >
                    {dataSelector.map( (column, index) => (
                        <MenuItem value={column.id} key={index} primaryText={column.name} />
                    ))}
                </FormsySelect>
        );
    }
}

SemiSelector.propTypes = {
    dataSelector: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
    ]).isRequired,
    selectValue:React.PropTypes.number,
    name:React.PropTypes.string,
    debounce: PropTypes.number
};

SemiSelector.contextTypes = {
    router: PropTypes.object.isRequired
};


// const mapStateToProps = ({ user }) => ({ user });
function mapStateToProps(state, ownProps){
    return {
        routing: state.routing
    };
}

export default connect(
    mapStateToProps,null,null,{ withRef: true }
)(SemiSelector);



