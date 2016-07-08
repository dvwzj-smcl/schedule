export default {
    user: {
        error: null,
        access_token: sessionStorage.getItem('access_token')
        // access_token: 'hack' // change here
    },
    menu: {
        sidebar: {
            expanded: true
        }
    }
};
