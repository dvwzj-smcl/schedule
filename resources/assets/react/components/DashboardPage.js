import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';

import {List, ListItem} from 'material-ui/List';
import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';

// import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
// Forms
import SemiText from './forms/SemiText';
import SemiForm from './forms/SemiForm';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FormsySelect from 'formsy-material-ui/lib/FormsySelect';

import ErrorMessage from './forms/ErrorMessage';

class HomePage extends Component {
    constructor(props, context){
        super(props, context);
    }

    componentDidMount() {
    }


    render(){
        return (
            <div>
                <PageHeading title="Dashboard" description="welcome" />
                <Grid fluid className="content-wrap">
                    <Row>
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
                        <Col md={9}>
                            <Panel title="Home">
                                <div className="con-pad">
                                    Coming Soon!
                                </div>
                            </Panel>
                            <Row>
                                <Col md={6}>
                                    <Panel title="Default">
                                        <div className="con-pad">
                                        </div>
                                    </Panel>
                                </Col>
                                <Col md={6}>
                                    <Panel title="Customize with props">
                                        <div className="con-pad">
                                        </div>
                                    </Panel>
                                </Col>
                            </Row>
                        </Col>

                    </Row>
                </Grid>
            </div>
        );
    }
}


export default HomePage;
