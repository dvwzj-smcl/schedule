import {PropTypes, Component} from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import api from './index';
import $ from 'jquery';

/**
 * set multi-dimensional array by string
 *
 */
const setter = (obj, propString, value) => {
    if (!propString)
        return obj;

    let prop, ref = obj, props = propString.split('.');
    for (let i = 0, iLen = props.length - 1; i <= iLen; i++) {
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

/**
 * AJAX with access_token
 *
 */
export function ajax (method, url, data, success, error, access_token) {
    url = api.baseUrl(url);
    if (typeof method === "undefined") {
        method = 'post';
        data._method = 'POST';
    } else if(method === 'put') {
        method = 'post';
        data._method = 'PUT';
    }  else if(method === 'patch') {
        method = 'post';
        data._method = 'PATCH';
    } else if(method === 'delete') {
        method = 'post';
        data._method = 'DELETE';
    }
    data = JSON.stringify(data);

    $.ajax({method, url, data, dataType: 'json',
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

/**
 * AJAX GET multiple URLs
 *
 */
export function getAll(urls, successCallback, errorCallback, access_token) {
    let promises = [];
    for (let get of urls) {
        let promise = new Promise((resolve, reject) => {
            ajax('get', get.url, null, response => {
                resolve(response.data);
                // note: should be array instead of object
                // resolve(Object.assign({}, response.data));
            }, (error) => {
                reject(error);
            }, access_token);

        });
        promises.push(promise);
    }
    Promise.all(promises).then( responses => { // all success
        let data = {};
        for(let i in responses) {
            setter(data, urls[i].name, responses[i]);
        }
        // callback
        // console.log('Promise data: ',data);
        successCallback(data);
    }, error => { // not all success
        errorCallback(error);
    });
}

// For SemiForm only (Deprecated)
class ApiCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: false
        };
        this.post = this.post.bind(this);
        this.get = this.get.bind(this);
        this.getErrorCallback = this.getErrorCallback.bind(this);
    }
    
    componentDidMount() {
        // only call when user have access token
        if(!this.props.user.access_token) return;
        // call get immediately
        if(this.props.getUrls) {
            this.get(this.props.getUrls);
        }
    }

    get(urls) {
        // callback only success
        getAll(urls, this.props.getCallback, this.getErrorCallback, this.props.user.access_token);
    }

    post({url, method, data, submitCallback}) {
        ajax(method, url, data, response => {
            // console.log('success', response);
            if(submitCallback) submitCallback(response.data);
        }, error => {
            // console.log('api error:', error);
        }, this.props.user.access_token);
    }

    getErrorCallback(error) {
        // todo: something like reload or notify errors
        // see http://api.jquery.com/jQuery.ajax/#jqXHR
        // console.log('error', error);
    }

    render() {
        return (null);
    }
}

ApiCall.propTypes = {
    user: PropTypes.object,
    getUrls: PropTypes.array,
    getCallback: PropTypes.func,
    submit: PropTypes.object,
    submitForm: PropTypes.func
};

const mapStateToProps = ({ user }) => ({ user });
export default connect(mapStateToProps,null,null,{ withRef: true })(ApiCall);
