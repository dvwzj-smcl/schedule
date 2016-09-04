import api from '../api';

export default function semiAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        let {
            shouldCallAPI, // ( optional ) more condition in addition to loading flag
            checkAndLoad, // ( optional ) true|false|undefined
            requestData, // ( optional ) data to server
            moduleName, // ( required ) main module name
            onSuccess, // ( optional ) a function you want to execute after success
            callAPI, // URL string or custom fetch function
            method, // ( required ) default to 'get'
            type, // ( required ) just match action name
            map, // ( optional ) sub module name
            payload = {} // ( optional ) more data to reducer
        } = action;

        
        if (!(typeof type === 'string' && callAPI)) {
            // Normal action: pass it on
            return next(action)
        }

        let state = getState();
        let shouldCallApiFlag = true, loaded = false;

        // console.log('type', action.type);

        // should Call API ?
        if(map) {
            let maps = map.split('.');
            if(maps.length == 1){
                if(state[moduleName] && state[moduleName][maps[0]] && state[moduleName][maps[0]].loading) shouldCallApiFlag = false;
                if(state[moduleName] && state[moduleName][maps[0]] && state[moduleName][maps[0]].loaded) loaded = true;
            }
            // todo: another length (getter)
        } else {
            if(state[moduleName] && state[moduleName].loading) shouldCallApiFlag = false;
            if(state[moduleName] && state[moduleName].loaded) loaded = true;
        }
        if(shouldCallApiFlag === true && shouldCallAPI) {
            if (typeof shouldCallAPI !== 'function') {
                throw new Error('Expected shouldCallAPI to be a function.')
            }
            shouldCallApiFlag = shouldCallAPI(state, loaded);
        }


        // console.log('loaded', loaded, 'shouldCallApiFlag', shouldCallApiFlag);

        // If params === false it will get status instead of sending API call
        if(checkAndLoad === false) {
            return loaded;
        } else if (!shouldCallApiFlag) {
            return;
        }

        if (!getState().user.access_token) return;

        // original : callAPI is a function
        if (!callAPI) {
            return;
        } else if (typeof callAPI === 'string') {
            let url = callAPI;
            if(method && method !== 'get') {
                if(requestData) requestData._method = method;
                else requestData = {_method: method};
            }
            else method = 'get';
            let options = {
                method: method,
                headers: { 'Access-Token': getState().user.access_token }
            };
            if(requestData) options.body = JSON.stringify(requestData);
            callAPI = () => fetch(api.baseUrl(url), options);

        } else if (typeof callAPI !== 'function') {
            throw new Error('Expected fetch to be a function.')
        }

        // Set loading flag and send API call
        let newData = {type};
        if(map) setter(newData, map, {loading: true});
        else newData = {type, loading: true};
        dispatch(Object.assign({}, payload, newData));

        // console.log('***params', params, 'loaded', loaded, 'shouldCallApiFlag', shouldCallApiFlag);
        
        let promise = callAPI().then(
            response => {
                response.json().then( json => {
                    // console.log('** json', json);
                    let data = {};
                    if(map) setter(data, map, {data: json.data, loading: false, loaded: true});
                    else data = {data: json.data, loading: false, loaded: true};
                    // console.log('onSuccess', onSuccess);
                    if(typeof onSuccess === 'function') {
                        dispatch(onSuccess(data));
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
        
        if(checkAndLoad === true) {
            return loaded;
        } else {
            return promise;
        }
    }
}

/*
 * -- Deep set object --
 * parse string separated by '.'
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