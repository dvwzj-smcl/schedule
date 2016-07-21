import React, {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import api from './index';
import $ from 'jquery';

class ApiCall extends Component {
    constructor(props) {
        super(props);
        this.callAjax = this.callAjax.bind(this);
        this.state = {
            data: false
        };
        // this.isActiveMenu = this.isActiveMenu.bind(this);
    }
    
    componentDidMount() {
        // only call when user have access token
        if(!this.props.user.access_token) return;

        if(this.props.get) {
            let promises = [];
            let urls = this.props.get;
            console.log('this.props.get', this.props.get);
            for (let get of urls) {
                let promise = new Promise((resolve, reject) => {
                    this.ajax('get', api.baseUrl(get.url), null, (response)=>{
                        resolve(response.data);
                        // should be array instead of object
                        // resolve(Object.assign({}, response.data));
                    }, error=>{
                        console.log('error', 1234);
                    });

                });
                promises.push(promise);
                // promises.push(this.ajax('get', api.baseUrl(get.url), null, (response)=>{
                //     data[get.name] = response.data;
                //     console.log('response', response, data[get.name]);
                //     // this.setState(state);
                // }, error=>{
                //     console.log('error', 1234);
                // }));
            }
            Promise.all(promises).then((responses)=> {
                let data = {};
                // cannot use for in because not iterable.
                for(let i in responses) {
                    data[urls[i].name] = responses[i];
                }
                // callback
                this.props.callback(data);
            });
        }
    }

    ajax(method, url, data, success, error) {
        data = JSON.stringify(data);
        let access_token = this.props.user.access_token;
        $.ajax({
            method,
            url,
            data,
            dataType: 'json',
            headers: {
                'Access-Token': access_token,
                'Content-Type': 'application/json'
            }
        }).done(response=>{
            if (response.status == "error"){
                // todo : show error
            }
            if(success) success(response);
        }).fail(message=>{
            if(error) error(message);
        });
    }

    callAjax() {
        console.log('123456789', 123456789);
    }

    render() {
        return (null);
    }
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps)(ApiCall);