import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Panel from './widgets/Panel';
import PageHeading from './widgets/PageHeading';

import {List, ListItem} from 'material-ui/List';
import {ActionPermIdentity, ActionInfo} from 'material-ui/svg-icons';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
// import {ContentInbox, ActionGrade, ContentSend, ContentDrafts, ActionInfo} from 'material-ui/svg-icons';


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
                        <Col xs md={3}>
                            <Panel>
                                <List>
                                    <Subheader>Doctors</Subheader>
                                    <ListItem
                                        leftAvatar={<Avatar icon={<ActionPermIdentity />} />}
                                        rightIcon={<ActionInfo />}
                                        primaryText="Doctor 1"
                                        secondaryText="Jan 9, 2014"
                                    />
                                    <ListItem
                                        leftAvatar={<Avatar icon={<ActionPermIdentity />} />}
                                        rightIcon={<ActionInfo />}
                                        primaryText="Doctor 1"
                                        secondaryText="Jan 9, 2014"
                                    />
                                    <ListItem
                                        leftAvatar={<Avatar icon={<ActionPermIdentity />} />}
                                        rightIcon={<ActionInfo />}
                                        primaryText="Doctor 1"
                                        secondaryText="Jan 9, 2014"
                                    />
                                    <ListItem
                                        leftAvatar={<Avatar icon={<ActionPermIdentity />} />}
                                        rightIcon={<ActionInfo />}
                                        primaryText="Doctor 1"
                                        secondaryText="Jan 9, 2014"
                                    />
                                </List>
                                <Divider/>
                                <List>
                                    <Subheader>Urgents</Subheader>
                                </List>
                            </Panel>
                        </Col>
                        <Col xs md={9}>
                            <Panel title="Home">
                                <div className="con-pad">
                                    Coming Soon!
                                </div>
                            </Panel>
                            <Row>
                                <Col xs md={6}>
                                    <Panel title="Default">
                                        <div className="con-pad">
                                        </div>
                                    </Panel>
                                </Col>
                                <Col xs md={6}>
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
