import axios from 'axios';

export const baseURL = `http://${window.location.hostname}:${process.env.REACT_APP_BACKEND_PORT || 5000}`

const axiosClient = axios.create({
    baseURL: baseURL + '/'  // http://localhost:8080/
    
});

export default axiosClient
