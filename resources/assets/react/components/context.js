// todo: delete this file
// for decorator test

export default function context(contextTypes, context) {

    return function (DecoratedComponent) {
        return class {
            static childContextTypes = contextTypes;
            getChildContext() {
                return context;
            }
            render() {
                return (
                    <DecoratedComponent {...this.props} />
                );
            }
        }
    }
}