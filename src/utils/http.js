/**
 * HTTP请求工具类
 * 基于axios封装，提供统一的请求配置、拦截器和错误处理
 */

import axios from 'axios';
import {isSuccessCode, encryptHeaderKey, encryptRequestData, decryptResponseData} from "@/constants/api";

// 从环境变量获取API基础URL
const getBaseURL = () => {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    return process.env.VUE_APP_API_BASE_URL || 'http://localhost:8090';
  }
  
  // 生产环境
  if (process.env.NODE_ENV === 'production') {
    return process.env.VUE_APP_API_BASE_URL || 'https://eccServer.jasonlat.com';
  }
  
  // 测试环境
  return process.env.VUE_APP_API_BASE_URL || 'https://test.jasonlat.com';
};

// 创建axios实例
const httpClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 20000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// 请求拦截器
httpClient.interceptors.request.use(
  async (config) => {
    console.log('请求配置:', config)
    console.log('请求配置:', config.params)
    // 查看是否需要加密
    const isEncrypted = config.headers[encryptHeaderKey]
    if (isEncrypted) {
      console.log('检测到加密请求头，开始加密处理...')
      // 需要加密
      let requestData;
      // 获取请求方法
      const method = config.method?.toUpperCase();
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        // 这些方法的数据通常在 data 中（请求体）
        requestData = config.data;
      } else if (method === 'GET') {
        // GET 方法的参数通常在 params 中（查询字符串）
        requestData = config.params;
      }
      console.log(`[${method}] 原始请求数据:`, requestData);
      if (requestData) {
        try {
          // 异步加密数据
          const encryptedDataInfo = await encryptRequestData(requestData);
          console.log('数据加密成功:', encryptedDataInfo);
          config.data = encryptedDataInfo.encryptedData;
        } catch (error) {
          console.error('数据加密失败:', error);
          throw new Error(`请求数据加密失败: ${error.message}`);
        }
      }
    }


    // 在发送请求之前做些什么
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
    // 生成请求ID和时间戳
    const requestId = generateRequestId();
    const timestamp = Date.now();
    
    // 在请求头中添加时间戳和requestId
    config.headers['X-Timestamp'] = timestamp;
    config.headers['X-Request-ID'] = requestId;
    config.headers['X-Public-X'] = localStorage.getItem('userPublicKeyX');
    config.headers['X-Public-Y'] = localStorage.getItem('userPublicKeyY');
    
    // 添加时间戳防止缓存
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    // 添加认证token（如果存在）
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加客户端信息
    config.headers['X-Client-Version'] = process.env.VUE_APP_VERSION || '1.0.0';
    config.headers['X-Client-Platform'] = 'web';
    
    // 记录请求信息（包含时间戳和请求ID）
    console.log(`[HTTP Request] ${requestId} - ${timestamp} - ${config.method?.toUpperCase()} ${config.url}`);


    return config;
  },
  (error) => {
    // 对请求错误做些什么
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
httpClient.interceptors.response.use(
  async (response) => {
    // 2xx 范围内的状态码都会触发该函数
    console.log(`[HTTP Response] ${response.status} ${response.config.url}`);
    
    // 检查响应头是否需要解密
    const encryptStatus = response.headers['encryptstatusheader'] || response.headers['EncryptStatusHeader'];
    console.log('响应头 encryptStatusHeader:', encryptStatus);

    console.log(response)
    let responseData = response.data;
    console.log("原始数据：", responseData)
    // 如果响应头标识需要解密
    if (encryptStatus === 'encrypt-complete') {
      console.log('检测到加密响应，开始解密...');
      
      try {
        // 检查响应数据是否包含加密信息
        if (responseData && typeof responseData === 'object') {
          // 使用统一的解密方法
          responseData = await decryptResponseData(responseData);
        } else {
          console.warn('响应数据格式不正确，缺少加密数据字段');
        }
      } catch (decryptError) {
        console.error('解密响应数据失败:', decryptError);
        // 重新抛出错误，保持原有的错误处理逻辑
        throw decryptError;
      }
    }
    
    // 统一处理响应数据格式
    console.log('处理后的响应数据:', responseData);
    
    // 检查业务状态码
    if (responseData && typeof responseData === 'object') {
      // 如果响应包含success字段，检查业务逻辑是否成功
      if (responseData.hasOwnProperty('code') && !isSuccessCode(responseData.code) && responseData.code !== '200') {
        const error = new Error(responseData.info || responseData.message || '请求失败');
        error.code = responseData.code || 'BUSINESS_ERROR';
        error.data = responseData;
        throw error;
      }
    }
    
    return responseData;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数
    console.error('[HTTP Response Error]', error);
    
    // 网络错误处理
    if (!error.response) {
      // 网络连接错误
      const networkError = new Error('网络连接失败，请检查网络设置');
      networkError.code = 'NETWORK_ERROR';
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    
    // HTTP状态码错误处理
    const { status, data } = error.response;
    let errorMessage = '请求失败';
    let errorCode = 'HTTP_ERROR';
    
    switch (status) {
      case 400:
        errorMessage = data?.message || '请求参数错误';
        errorCode = 'BAD_REQUEST';
        break;
      case 401:
        errorMessage = '身份验证失败，请重新登录';
        errorCode = 'UNAUTHORIZED';
        // 清除本地token
        localStorage.removeItem('authToken');
        // 可以在这里触发登录页面跳转
        break;
      case 403:
        errorMessage = '没有权限访问该资源';
        errorCode = 'FORBIDDEN';
        break;
      case 404:
        errorMessage = '请求的资源不存在';
        errorCode = 'NOT_FOUND';
        break;
      case 408:
        errorMessage = '请求超时，请稍后重试';
        errorCode = 'TIMEOUT';
        break;
      case 429:
        errorMessage = '请求过于频繁，请稍后重试';
        errorCode = 'TOO_MANY_REQUESTS';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        errorCode = 'INTERNAL_SERVER_ERROR';
        break;
      case 502:
        errorMessage = '网关错误';
        errorCode = 'BAD_GATEWAY';
        break;
      case 503:
        errorMessage = '服务暂时不可用';
        errorCode = 'SERVICE_UNAVAILABLE';
        break;
      default:
        errorMessage = data?.message || `请求失败 (${status})`;
        errorCode = `HTTP_${status}`;
    }
    
    const customError = new Error(errorMessage);
    customError.code = errorCode;
    customError.status = status;
    customError.data = data;
    customError.originalError = error;
    
    return Promise.reject(customError);
  }
);

// 生成请求ID
function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36);
}

// 封装常用的HTTP方法
const http = {
  /**
   * GET请求
   * @param {string} url 请求URL
   * @param {object} params 查询参数
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  get(url, params = {}, config = {}) {
    return httpClient.get(url, {
      params,
      ...config
    });
  },
  
  /**
   * POST请求
   * @param {string} url 请求URL
   * @param {object} data 请求体数据
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  post(url, data = {}, config = {}) {
    return httpClient.post(url, data, config);
  },
  
  /**
   * PUT请求
   * @param {string} url 请求URL
   * @param {object} data 请求体数据
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  put(url, data = {}, config = {}) {
    return httpClient.put(url, data, config);
  },
  
  /**
   * DELETE请求
   * @param {string} url 请求URL
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  delete(url, config = {}) {
    return httpClient.delete(url, config);
  },
  
  /**
   * PATCH请求
   * @param {string} url 请求URL
   * @param {object} data 请求体数据
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  patch(url, data = {}, config = {}) {
    return httpClient.patch(url, data, config);
  },
  
  /**
   * 上传文件
   * @param {string} url 上传URL
   * @param {FormData} formData 文件数据
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  upload(url, formData, config = {}) {
    return httpClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    });
  },
  
  /**
   * 下载文件
   * @param {string} url 下载URL
   * @param {object} config 额外配置
   * @returns {Promise}
   */
  download(url, config = {}) {
    return httpClient.get(url, {
      responseType: 'blob',
      ...config
    });
  }
};

// 导出http实例和原始axios实例
export default http;
export { httpClient };

// 导出一些常用的工具方法
export const httpUtils = {
  /**
   * 设置认证token
   * @param {string} token 认证token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  },
  
  /**
   * 获取认证token
   * @returns {string|null}
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  },
  
  /**
   * 清除认证token
   */
  clearAuthToken() {
    localStorage.removeItem('authToken');
  },
  
  /**
   * 检查是否已认证
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getAuthToken();
  },
  
  /**
   * 获取当前API基础URL
   * @returns {string}
   */
  getBaseURL() {
    return httpClient.defaults.baseURL;
  },
  
  /**
   * 动态设置API基础URL
   * @param {string} baseURL 新的基础URL
   */
  setBaseURL(baseURL) {
    httpClient.defaults.baseURL = baseURL;
  }
};