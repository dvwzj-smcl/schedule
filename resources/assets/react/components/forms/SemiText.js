import React, { PropTypes, Component } from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';

// verification on every change is slow, so debouncing helps
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

class SemiText extends Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    componentDidMount() {
        const { debounce = 200 } = this.props;
        this.setValidate = debounceFunc(this.refs.input.setValue, debounce);
    }

    componentWillReceiveProps() {
        const input = this.refs.input;
        input.setState({ value: input.getValue() || '' });
    }


    onChange() {
        if (this.props.onChange)
            this.props.onChange(event);
        this.setValidate(event.currentTarget.value);
    }

    setValue(event) {
        const input = this.refs.input;
        input.setState({ value: event });
    }

    render() {
        return <FormsyText ref="input" {...this.props} onChange={this.onChange} />;
    }
}

SemiText.propTypes = {
    onChange: PropTypes.func,
    debounce: PropTypes.number
};

export default SemiText;