import axios from 'axios';

export const baseURL = `https://${window.location.hostname}` + (
    process.env.REACT_APP_NODE_ENV !== 'production' && `:${process.env.REACT_APP_BACKEND_PORT || 5000}`
) 

const axiosClient = axios.create({
    baseURL: baseURL + '/'
});

export default axiosClient
