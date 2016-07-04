import React, {Component} from 'react';

import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';


// Forms
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';

import ErrorMessage from './forms/ErrorMessage';

class CalendarPage extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            canSubmit: false
        };
    }
/*
    componentWillMount(){
        this.props.actions.page.updateTitle('Calendar');
        this.props.actions.page.updateDescription('Project Calendar');
    }
    */

    render(){
        return (
            <Grid fluid>
                <Row>
                    <Col md={9}>
                        <Panel title="Home">
                            <div className="con-pad">
                                This is panel widget. Title is optional.
                            </div>
                        </Panel>
                        <Row>
                            <Col md={6}>
                                <Panel title="Default">
                                    <div className="con-pad">
                                        <SemiForm>
                                            <SemiText
                                                name="username"
                                                validations="isWords"
                                                validationError={ErrorMessage.word}
                                                required
                                                hintText="What is your username?"
                                                floatingLabelText="Username"
                                                underlineShow={false}
                                            />
                                            <Divider />
                                            <SemiText
                                                name="password"
                                                type="password"
                                                validationError={ErrorMessage.required}
                                                required
                                                hintText="What is your password?"
                                                floatingLabelText="Password"
                                                underlineShow={false}
                                            />
                                            <Divider />
                                        </SemiForm>
                                    </div>
                                </Panel>
                            </Col>
                            <Col md={6}>
                                <Panel title="Customize with props">
                                    <div className="con-pad">
                                        <SemiForm hasReset submitLabel="Send to server">
                                            <SemiText
                                                name="username"
                                                validations="isWords"
                                                validationError={ErrorMessage.word}
                                                required
                                                hintText="What is your username?"
                                                floatingLabelText="Username"
                                                underlineShow={false}
                                            />
                                            <Divider />
                                            <FormsyDate
                                                name="date"
                                                required
                                                hintText="Landscape Inline Dialog"
                                                container="inline"
                                                mode="landscape"
                                                underlineShow={false}
                                            />
                                            <Divider />
                                        </SemiForm>
                                    </div>
                                </Panel>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={3}>
                        <Panel>
                            <List>
                                <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
                                <ListItem primaryText="Starred" leftIcon={<ActionGrade />} />
                                <ListItem primaryText="Sent mail" leftIcon={<ContentSend />} />
                                <ListItem primaryText="Drafts" leftIcon={<ContentDrafts />} />
                                <ListItem primaryText="Inbox" leftIcon={<ContentInbox />} />
                            </List>
                            <Divider />
                            <List>
                                <ListItem primaryText="All mail" rightIcon={<ActionInfo />} />
                                <ListItem primaryText="Trash" rightIcon={<ActionInfo />} />
                                <ListItem primaryText="Spam" rightIcon={<ActionInfo />} />
                                <ListItem primaryText="Follow up" rightIcon={<ActionInfo />} />
                            </List>
                        </Panel>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default  CalendarPage;
/*
export default connect((state)=>{
    return {
        page: state.page
    }
},(dispatch)=>{
    return {
        actions: {
            page: {
                updateTitle: bindActionCreators(updateTitle, dispatch),
                updateDescription: bindActionCreators(updateDescription, dispatch)
            }
        }
    }
})(CalendarPage);
*/