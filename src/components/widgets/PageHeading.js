import React, { PropTypes, Component } from 'react';

// fix formsy text for form update
class PageHeading extends Component{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps() {
    }

    shouldComponentUpdate(nextProps, nextState) {
    }

    onChange(event) {
        if (this.props.onChange)
            this.props.onChange(event);
        this.setValidate(event.currentTarget.value);
    }

    render() {
        return (
            <div className="page-heading">
                <h1 className="title">{this.props.title}</h1>
                <p className="description">{this.props.description}</p>
            </div>
        );
    }
}

PageHeading.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string
};

export default PageHeading;