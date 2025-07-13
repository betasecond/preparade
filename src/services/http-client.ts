import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

/**
 * 环境配置
 */
const API_ENVIRONMENTS = {
  development: 'http://localhost:8000/api',
  staging: 'https://staging-api.preparade.com/api',
  production: 'https://api.preparade.com/api'
};

/**
 * 当前环境
 * 注：在实际项目中，这通常从环境变量中获取
 */
const currentEnvironment = import.meta.env.MODE || 'development';

/**
 * API 基础 URL
 */
const BASE_URL = API_ENVIRONMENTS[currentEnvironment as keyof typeof API_ENVIRONMENTS];

/**
 * 请求超时时间 (ms)
 */
const TIMEOUT = 15000;

/**
 * 创建 Axios 实例
 */
const http: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * 请求拦截器
 * 在发送请求前可以做一些处理，例如添加认证头
 */
http.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('auth_token');
    
    // 如果存在 token，添加到请求头
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器
 * 在接收响应前可以做一些处理，例如错误处理和数据转换
 */
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 处理 HTTP 错误状态
      switch (error.response.status) {
        case 401:
          // 未授权 - 清除 token 并重定向到登录页
          console.error('未授权，请重新登录');
          localStorage.removeItem('auth_token');
          // 如果有路由可以添加重定向
          // router.push('/login');
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`未处理的错误状态: ${error.response.status}`);
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，请检查您的网络连接');
    } else {
      // 请求设置有问题
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * 封装 GET 请求
 * @param url 请求 URL
 * @param params URL 参数
 * @param config 请求配置
 */
export const get = <T>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.get(url, { params, ...config }) as unknown as Promise<T>;
};

/**
 * 封装 POST 请求
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 */
export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.post(url, data, config) as unknown as Promise<T>;
};

/**
 * 封装 PUT 请求
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 */
export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.put(url, data, config) as unknown as Promise<T>;
};

/**
 * 封装 DELETE 请求
 * @param url 请求 URL
 * @param config 请求配置
 */
export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return http.delete(url, config) as unknown as Promise<T>;
};

/**
 * 封装 PATCH 请求
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 */
export const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  return http.patch(url, data, config) as unknown as Promise<T>;
};

/**
 * 导出 axios 实例
 */
export default http;