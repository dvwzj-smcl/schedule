import React, {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import api from './api';
import $ from 'jquery';

class WrappedApi extends Component {
    constructor(props, context) {
        super(props, context);
        this.callAjax = this.callAjax.bind(this);
        this.isActiveMenu = this.isActiveMenu.bind(this);
    }
    
    componentDidMount() {
        console.log('123456789', this.props.user);
    }

    callAjax() {
        console.log('123456789', 123456789);
    }

    render() {
        return (null);
    }
}

const mapStateToProps = ({ user }) => ({
    user
});

// const mapDispatchToProps = dispatch => ({
// });

// WrappedApi.propTypes = {
//     location: PropTypes.object.isRequired
// };
//
// WrappedApi.contextTypes = {
//     router: PropTypes.object
// };


export default connect(mapStateToProps)(WrappedApi);