import axios, {AxiosInstance} from 'axios';
import {AuthCode, USER_TOKEN} from "./constants";

const axiosInstance: AxiosInstance = axios.create({ baseURL: '/api' });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    const { data: resData } = res;
    const { data, success } = resData as ServerData;
    if (success === false) {
      return Promise.reject(resData)
    }
    return data;
  }, (error => {
    const { status } = error.response;
    const data = error.response.data as ServerData;
    if (status == 401) {
      if (data.code == AuthCode.INVALID_TOKEN) {
        localStorage.removeItem(USER_TOKEN)
        alert('登录过期，请重新登录');
        location.href = '/login';
      }
      if (data.code == AuthCode.MISS_TOKEN) {
        location.href = '/login';
      }
    }
    return Promise.reject(error);
  })
);

export default axiosInstance;