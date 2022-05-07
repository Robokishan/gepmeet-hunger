import axios, { AxiosRequestConfig } from "axios";

// declare module "axios" {
//   export interface AxiosRequestConfig {
//     showToast?: boolean;
//   }
// }

const DEV_SERVER = "http://localhost:8080/";
const axiosClient = axios.create();

const parseErrorCode = (error) => {
  return Promise.reject(error.response ?? error);
};

// Request parsing interceptor
const axiosRequestInterceptor = (
  config: AxiosRequestConfig
): AxiosRequestConfig => {
  config.baseURL = DEV_SERVER;
  return config;
};

// Request parsing interceptor
axiosClient.interceptors.request.use(axiosRequestInterceptor, (error) => {
  console.error("[REQUEST_ERROR]", error);
  return Promise.reject(error);
});

// Response parsing interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return parseErrorCode(error);
  }
);
export default axiosClient;
