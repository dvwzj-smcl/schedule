import jwt from 'jsonwebtoken';

function baseUrl(endpoint){ // change here
    // return 'http://localhost/schedule/api'+(endpoint.substr(0,1)=='/' ? endpoint : endpoint.substr(1));
    // return 'http://192.168.1.10/semi_server_pok/public/api'+(endpoint.substr(0,1)=='/' ? endpoint : endpoint.substr(1));
    // return 'http://192.168.1.10/schedule/public/api'+(endpoint.substr(0,1)=='/' ? endpoint : endpoint.substr(1));
    return 'http://localhost/semi_server_pok/public/api'+(endpoint.substr(0,1)=='/' ? endpoint : endpoint.substr(1));

}

const appKey = 'base64:Q6ERrj4q7NCiSD27kFQNrRkiJFS//jIHbcXHzF4+3qQ='; // pok
// const appKey = 'base64:lw65FxR9qSD137bNTvrQM6kOSG9dLNyyGx8JTdaO/OQ=';


function payload(payload){
    return jwt.sign({
        payload
    }, appKey);
}
function verify(encode){
    return jwt.verify(encode, appKey);
}
function sign(decode){
    return jwt.sign(decode, appKey);
}

const api = {
    sign,
    verify,
    baseUrl,
    payload,
    appKey
};

export default api;