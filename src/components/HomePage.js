import React, {Component} from 'react';
import {Grid, Row, Col} from 'react-flexbox-grid';
import Paper from 'material-ui/Paper';

class HomePage extends Component {
    constructor(props, context){
        super(props, context);
    }
    render(){
        return (
            <Paper>
                <Grid fluid>
                    <Row style={{height:400}}>
                        <Col md={3}>
                            Home
                        </Col>
                        <Col md={9}>
                            Home
                        </Col>
                    </Row>
                </Grid>
            </Paper>
        );
    }
}


export default HomePage;
