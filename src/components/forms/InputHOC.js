import React, { PropTypes, Component } from 'react';

let InputHOC = InnerComponent => {

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

    class Enhance extends Component {
        constructor(props) {
            super(props);
            this.onChange = this.onChange.bind(this);
        }

        componentDidMount() {
            const {debounce = 200} = this.props;

            // console.log('this.refs3', InnerComponent);
            this.setValidate = debounceFunc(this.refs.input.setValue, debounce);
        }

        componentWillReceiveProps() {
            const input = this.refs.input;
            // console.log('this.refs1', input);
            input.setState({value: input.getValue() || ''});
        }

        onChange(event) {
            if (this.props.onChange)
                this.props.onChange(event);
            this.setValidate(event.currentTarget.value);
        }

        render() {
            // console.log('this.refs2', this.props);
            return (<InnerComponent
                ref="input"
                onChange={this.onChange}
                {...this.props}
                {...this.state} />);
        }
    }

    Enhance.propTypes = {
        onChange: PropTypes.func,
        debounce: PropTypes.number
    };

    return Enhance;
};

export default InputHOC;