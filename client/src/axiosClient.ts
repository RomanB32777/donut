import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `http://${window.location.hostname}:${process.env.REACT_APP_BACKEND_PORT || 5000}/` // http://localhost:8080/
    
});

export default axiosClient
