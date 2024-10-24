import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
// import { useAppStore } from "@/stores/modules/app";

// const appStore = useAppStore();
// const hostname = appStore.getReqUrl;
const hostname = 'http://172.17.41.6';

// Define base URLs with ports
const baseURLDefault = `http://${hostname}:8180`;
const baseURLPngMap = `http://${hostname}:8185`;

// Create Axios instance with default baseURL (port 8180)
const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseURLDefault, // Default baseURL with port 8180
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // Check if the request is for '/api/agv/png-map'
    if (config.url && config.url.startsWith('/api/agv/png-map')) {
      config.baseURL = baseURLPngMap; // Override baseURL to use port 8185
    } else {
      config.baseURL = baseURLDefault; // Ensure default baseURL is used
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 处理响应数据
    if ([200, 201, 304].includes(response.status)) {
      return response.data;
    }
    return Promise.reject(response);
  },
  (error: AxiosError) => {
    // 处理响应错误
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 500:
            alert('服务器错误，请稍后再试');
          break;
        default:
            alert(data.message || '请求失败');
      }
    } else {
        alert('网络错误');
    }
    return Promise.reject(error);
  },
);

// 封装常用请求方法
const request = {
  get: (url: string, params?: any) => axiosInstance.get(url, { params }),
  post: (url: string, data?: any) => axiosInstance.post(url, data),
  put: (url: string, data?: any) => axiosInstance.put(url, data),
  delete: (url: string, params?: any) => axiosInstance.delete(url, { params }),
  _post: (url: string, params?: any, queryParams?: any) => {
    // 将查询参数拼接到 URL 后面
    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return axiosInstance.post(fullUrl, params);
  },
  _put: (url: string, params?: any, queryParams?: any) => {
    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : '';
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return axiosInstance.put(fullUrl, params);
  },
};

export default request;
