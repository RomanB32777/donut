import axios from 'axios'
import { baseURL } from 'consts'

const axiosClient = axios.create({
	baseURL: baseURL + '/',
})

export default axiosClient
