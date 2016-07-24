import api from '../api';

export default function callAPIMiddleware({ dispatch, getState }) {
    return next => action => {
        let {
            types,
            callAPI, // string or function(fetch)
            shouldCallAPI = () => true,
            payload = {}
        } = action;

        if (!types) {
            // Normal action: pass it on
            return next(action)
        }

        if (
            !Array.isArray(types) ||
            types.length !== 3 ||
            !types.every(type => typeof type === 'string')
        ) {
            throw new Error('Expected an array of three string types.')
        }

        // original : callAPI is a function
        if (!callAPI) {
            return;
        } else if (typeof callAPI === 'string') {
            callAPI = () => fetch(api.baseUrl('/schedules/init'),{
                method: 'get',
                headers: { Authorization: getState().user.access_token }
            });

        } else if (typeof callAPI !== 'function') {
            throw new Error('Expected fetch to be a function.')
        }
        
        if (!shouldCallAPI(getState())) {
            return
        }

        const [ requestType, successType, failureType ] = types;

        dispatch(Object.assign({}, payload, {
            type: requestType
        }));

        return callAPI().then(
            response => {
                response.json().then( json => {
                    // console.log('** json', json);
                    let data = json.data;
                    dispatch(Object.assign({}, payload, {
                        data,
                        type: successType
                    }))
                });
            },
            error => dispatch(Object.assign({}, payload, {
                error,
                type: failureType
            }))
        )
    }
}