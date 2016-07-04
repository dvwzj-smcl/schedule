import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';

// import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// Forms
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

import ErrorMessage from './forms/ErrorMessage';

class HomePage extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            value: 1
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, index, value) {
        this.setState({value});
        console.log('this.getState()', this.state);
    }

    render(){
        return (
            <Grid fluid>
                <Row>
                    <Col md={9}>
                        <Panel title="Home">
                            <div className="con-pad">
                                This is panel widget. Title is optional.
                                Test pull request.
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
                                            <FormsySelect name="select" value={this.state.value} onChange={this.handleChange}>
                                                <MenuItem value={1} primaryText="Never" />
                                                <MenuItem value={2} primaryText="Every Night" />
                                                <MenuItem value={3} primaryText="Weeknights" />
                                                <MenuItem value={4} primaryText="Weekends" />
                                                <MenuItem value={5} primaryText="Weekly" />
                                            </FormsySelect>
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


export default HomePage;
