import React, {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import api from './index';
import $ from 'jquery';

// deep object setter
const setter = (obj, propString, value) => {
    if (!propString)
        return obj;

    let prop, ref = obj, props = propString.split('.');
    for (var i = 0, iLen = props.length - 1; i <= iLen; i++) {
        prop = props[i];
        if(i == iLen) {
            return ref[prop] = value;
        } else {
            if(ref[prop] == undefined) {
                ref[prop] = {};
            }
            ref = ref[prop];
        }
    }
    return obj;
};

export function ajax (method, url, data, success, error, access_token) {
    url = api.baseUrl(url);
    if(method === 'put') {
        method = 'post';
        data._method = 'PUT';
    } else if(method === 'delete') {
        method = 'post';
        data._method = 'DELETE';
    }
    data = JSON.stringify(data);
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

class ApiCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
        this.post = this.post.bind(this);
        this.get = this.get.bind(this);
    }
    
    componentDidMount() {
        // only call when user have access token
        if(!this.props.user.access_token) return;
        // call get immediately
        if(this.props.get) {
            this.get(this.props.get);
        }
    }

    // call get manually
    get(urls) {
        if(this.props.submit) {
            let promises = [];
            for (let get of urls) {
                let promise = new Promise((resolve, reject) => {
                    ajax('get', get.url, null, (response)=>{
                        resolve(response.data);
                        // should be array instead of object
                        // resolve(Object.assign({}, response.data));
                    }, error=>{
                        // todo : error handling later
                        console.log('api error:', get.url);
                    }, this.props.user.access_token);

                });
                promises.push(promise);
            }
            Promise.all(promises).then((responses)=> {
                let data = {};
                for(let i in responses) {
                    // data[urls[i].name] = responses[i];
                    setter(data, urls[i].name, responses[i]);
                }
                // callback
                console.log('Promise data :',data);
                this.props.getCallback(data);
            });
        }
    }

    // call post from props
    callPost(data) {
        if(this.props.submit) {
            this.post({
                url: this.props.submit.url,
                method: this.props.submit.method,
                submitCallback: this.props.submitCallback,
                data
            });
        }
    }

    // call post manually
    post({url, method, data, submitCallback}) {
        ajax(method, url, data, (response)=>{
            console.log('success', response);
            if(submitCallback) submitCallback(response.data);
        }, error=>{
            console.log('api error:', url);
        }, this.props.user.access_token);
    }

    render() {
        return (null);
    }
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps,null,null,{ withRef: true })(ApiCall);
