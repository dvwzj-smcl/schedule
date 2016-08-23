import api from '../api';

/*
 -- Deep set object --
 Why don't just use Object.assign ?
 Because The structure and depth are unknown
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

export default function semiAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        let {
            shouldCallAPI,
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
        if(params === false) {
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
            callAPI = () => fetch(api.baseUrl(url),{
                method: 'get',
                headers: { 'Access-Token': getState().user.access_token }
            });

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