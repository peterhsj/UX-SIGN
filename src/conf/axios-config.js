import axios from 'axios';
import { handleRequest, handleRequestError } from '@/conf/axios-request-interceptor';
import { handleResponse, handleResponseError } from '@/conf/axios-response-interceptor';

// const service = axios.create({
// AXIOS 預設值註冊 --------------------------------------------------
/** AXIOS BASE URL */
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API,
/** Request 預設 timeout 時間(毫秒) */
axios.defaults.timeout = import.meta.env.VITE_APP_AXIOS_DEFAULT_TIMEOUT * 1000
// });

// AXIOS 攔截器註冊 --------------------------------------------------
/** 註冊 HTTP Request Interceptor */
axios.interceptors.request.use(handleRequest, handleRequestError);
/** 註冊 HTTP Response Interceptor */
axios.interceptors.response.use(handleResponse, handleResponseError)

// export default service;