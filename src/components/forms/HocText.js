//************
// Failed. Just use SemiText
//************

import React, { Component } from 'react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import InputHoc from './InputHOC';

class Text extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <FormsyText ref="input" {...this.props} />;
    }
}

// let Text = (props) => <FormsyText {...props} />; // Error Stateless cannot have ref

const HocText = InputHoc(Text);
export default HocText;
