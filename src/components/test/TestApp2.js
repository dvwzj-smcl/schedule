import React, {PropTypes, Component} from 'react';
let ReactDOM = require('react-dom');

let Mixin = InnerComponent => class extends Component {
    constructor() {
        super();
        this.update = this.update.bind(this);
        this.state = {val: 0}
    }

    componentWillMount() {
        console.log('will mount');
    }

    componentDidMount() {
        console.log('mounted');
    }

    componentWillUpdate() {
    }

    update() {
        this.setState({val: this.state.val + 1})
    }

    render() {
        return <InnerComponent
            update={this.update}
            {...this.state}
            {...this.props} />
    }
};

const Button = (props) => <button onClick={props.update}>{props.txt} - {props.val}</button>;

const Label = (props) => <label onMouseMove={props.update}>{props.txt} - {props.val}</label>;

let ButtonMixed = Mixin(Button);
let LabelMixed = Mixin(Label);

class App extends Component {
    render() {
        return (
            <div>
                <ButtonMixed txt="Button" />
                <LabelMixed txt="Label" />
            </div>
        );
    }
}

export default App