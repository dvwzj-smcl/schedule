const helper = {
    toDate: (moment) => { // from Moment to Date
        return new Date(moment.format('YYYY-MM-DD H:mm:ss'));
    },
    isParamChanged: (params, nextParams) => { // from Moment to Date
        if(params.length !== nextParams) return true;
        for(let i in nextParams) {
            if(params[i] !== nextParams[i]) return true;
        }
        return false;
    },
    has : (str, find) => {
        let result = str.indexOf(find);
        return result != -1;
    }
};

export default helper;
