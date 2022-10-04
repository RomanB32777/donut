import axios from 'axios';

export const isProduction = process.env.REACT_APP_NODE_ENV && process.env.REACT_APP_NODE_ENV === 'production'

export const baseURL = `${isProduction ? 'https' : 'http'}://${window.location.hostname}` + (
   !isProduction ? `:${process.env.REACT_APP_BACKEND_PORT || 4000}` : ''
) 

const axiosClient = axios.create({
    baseURL: baseURL + '/'
});

export default axiosClient
