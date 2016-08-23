import moment from 'moment';
// var startDate = moment().startOf('month');
// var endDate = moment(startDate).endOf('month');
export default {
    user: {
        error: null,
        permissions: [],
        authenticating: true,
        access_token: sessionStorage.getItem('access_token')

        // todo : remove these
        // isAdmin: JSON.parse(sessionStorage.getItem('isAdmin')),
        // isDoctor: JSON.parse(sessionStorage.getItem('isDoctor')),
        // isOrganizer: JSON.parse(sessionStorage.getItem('isOrganizer')),
        // isSale: JSON.parse(sessionStorage.getItem('isSale'))
        // access_token: 'hack' // change here
    },
    app: {
        sidebar: {
            expanded: true
        }
    }
};
