import jwt from 'jsonwebtoken';

function baseUrl(endpoint) {
    let endpointStr = endpoint ? (endpoint.substr(0, 1) == '/' ? endpoint : '/' + endpoint) : '';
    if (process.env.NODE_ENV == 'development') {
        return `http://localhost/schedule/public/api${endpointStr}`;
    }
    let host = window.location.host;
    if (host.indexOf('localhost') !== -1) {
        return `http://localhost/schedule/public/api${endpointStr}`;
    }
    return `/public/api${endpointStr}`;
}
const appKey = 'base64:GLqxLeosxabv4rH6FYsDISUT3yrqdWD3jZGbKiJsqhA=';

function payload(payload) {
    return jwt.sign({
        payload
    }, appKey);
    // return jwt.sign(data, appKey);
}
function verify(encode) {
    return jwt.verify(encode, appKey);
}

function sign(decode) {
    return jwt.sign(decode, appKey);
}

const api = {
    sign,
    verify,
    baseUrl,
    payload
};

export default api;