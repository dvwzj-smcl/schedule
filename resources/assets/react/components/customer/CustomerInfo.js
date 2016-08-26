import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from '../widgets/Panel';
import PageHeading from '../widgets/PageHeading';
import api from '../../api';
import SemiDataTable from '../widgets/SemiDataTable';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import IconButton from 'material-ui/IconButton';
import SemiModal from '../widgets/SemiModal';

class CustomerInfo extends Component {
    constructor(props, context) {
        console.log('modal:constructor', context);
        super(props, context);
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    render() {
        return null;
    }
}

CustomerInfo.propTypes = {};
CustomerInfo.contextTypes = {
    dialog: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerInfo);