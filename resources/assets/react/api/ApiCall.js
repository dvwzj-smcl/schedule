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

class ApiCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
        this.post = this.post.bind(this);
    }
    
    componentDidMount() {
        // only call when user have access token
        if(!this.props.user.access_token) return;
        if(this.props.get) {
            let promises = [];
            let urls = this.props.get;
            for (let get of urls) {
                let promise = new Promise((resolve, reject) => {
                    this.ajax('get', api.baseUrl(get.url), null, (response)=>{
                        resolve(response.data);
                        // should be array instead of object
                        // resolve(Object.assign({}, response.data));
                    }, error=>{
                        // todo : error handling later
                        console.log('api error:', get.url);
                    });

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

    post(data) {
        if(this.props.submit) {
            this.ajax('post', api.baseUrl(this.props.submit.url), data, (response)=>{
                console.log('success', response);
                if(this.props.submitCallback) this.props.submitCallback(response.data);
            }, error=>{
                console.log('api error:', this.props.submit.url);
            });
        }
    }

    render() {
        return (null);
    }
}

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps,null,null,{ withRef: true })(ApiCall);
