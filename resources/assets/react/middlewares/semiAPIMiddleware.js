import api from '../api';

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

export default function semiAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        let {
            moduleName,
            onSuccess,
            params,
            type,
            map,
            callAPI, // string or function(fetch)
            payload = {}
        } = action;
        
        if (!(typeof type === 'string' && callAPI)) {
            // Normal action: pass it on
            return next(action)
        }

        console.log('action', action);

        let state = getState();
        let shouldCallApi = true, loaded = false;

        // should Call API ?
        if(map) {
            let maps = map.split('.');
            if(maps.length == 1){
                console.log('state[moduleName][maps[0]]', moduleName);
                if(state[moduleName] && state[moduleName][maps[0]] && state[moduleName][maps[0]].loading) shouldCallApi = false;
                if(state[moduleName] && state[moduleName][maps[0]] && state[moduleName][maps[0]].loaded) loaded = true;
            }
            // todo: another length (getter)
        } else {
            if(state[moduleName] && state[moduleName].loading) shouldCallApi = false;
            if(state[moduleName] && state[moduleName].loaded) loaded = true;
        }

        // If params === false it will get status instead of sending API call
        if(params === false) {
            return loaded;
        } else if (!shouldCallApi) {
            return;
        }

        if (!getState().user.access_token) return;

        // original : callAPI is a function
        if (!callAPI) {
            return;
        } else if (typeof callAPI === 'string') {
            let url = callAPI;
            callAPI = () => fetch(api.baseUrl(url),{
                method: 'get',
                headers: { 'Access-Token': getState().user.access_token }
            });

        } else if (typeof callAPI !== 'function') {
            throw new Error('Expected fetch to be a function.')
        }

        
        let newData = {type};
        setter(newData, map, {loading: true});
        // console.log('asdf', newData);

        dispatch(Object.assign({}, payload, newData));
        
        let promise = callAPI().then(
            response => {
                response.json().then( json => {
                    // console.log('** json', json);
                    let data = {};
                    setter(data, map, {data: json.data, loading: false, loaded: true});
                    // console.log('data', data);
                    console.log('onSuccess', onSuccess);
                    if(typeof onSuccess === 'function') {
                        dispatch(onSuccess());
                    }
                    dispatch(Object.assign({}, payload, {
                        data,
                        type: type
                    }));
                });
            },
            error => {
                let data = {};
                setter(data, map, {error, loading: false, loaded: false});
                dispatch(Object.assign({}, payload, {
                    data,
                    type: type
                }));
            }
        );
        
        if(params === true) {
            return loaded;
        } else {
            return promise;
        }
    }
}