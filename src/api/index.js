import jwt from 'jsonwebtoken';

function baseUrl(endpoint){
    return 'http://localhost/schedule/api'+(endpoint.substr(0,1)=='/' ? endpoint : endpoint.substr(1));
}

const appKey = 'base64:lw65FxR9qSD137bNTvrQM6kOSG9dLNyyGx8JTdaO/OQ=';

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
    payload
};

export default api;