import axios from "axios";

const isProduction = process.env.REACT_APP_NODE_ENV === "production";

const baseURL =
  `${isProduction ? "https" : "http"}://${window.location.hostname}` +
  (!isProduction ? `:${process.env.REACT_APP_BACKEND_PORT || 4000}` : "");

const socketsBaseUrl = `http://${window.location.hostname}:4005`;

const axiosClient = axios.create({
  baseURL: baseURL + "/",
});

export { isProduction, baseURL, socketsBaseUrl };

export default axiosClient;
