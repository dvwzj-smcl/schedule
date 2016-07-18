import moment from 'moment';
var startDate = moment().startOf('month');
var endDate = moment(startDate).endOf('month');
export default {
    user: {
        error: null,
        permissions: [],
        authenticating: true,
        // todo : remove these
        access_token: sessionStorage.getItem('access_token'),
        isAdmin: JSON.parse(sessionStorage.getItem('isAdmin')),
        isDoctor: JSON.parse(sessionStorage.getItem('isDoctor')),
        isOrganizer: JSON.parse(sessionStorage.getItem('isOrganizer')),
        isSale: JSON.parse(sessionStorage.getItem('isSale'))
        // access_token: 'hack' // change here
    },
    menu: {
        sidebar: {
            expanded: true
        }
    },
    calendar: {
        between: [
            startDate.format('YYYY-MM-DD'),
            endDate.format('YYYY-MM-DD')
        ],
        events: [],
        slots: [],
        doctors: [],
        categories: []
    }
};
