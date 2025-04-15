import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.headers["Content-Type"] = "application/json";
axios.defaults.paramsSerializer = (params) =>
  qs.stringify(params, { arrayFormat: "repeat" });

export const setAuthToken = (token: string) => {
  if (token) {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers["Authorization"];
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default axios;
