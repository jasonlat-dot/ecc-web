/**
 * 用户认证相关API服务
 * 提供与用户登录、注册、认证相关的API调用
 * 
 * @description 用户认证API服务模块，包含登录、注册、密码重置等功能
 * @author ECC Team
 * @version 1.0.0
 */

import { httpClient } from '@/utils/http';

import {encryptHeader, getUserToken, isSuccessCode, removeUserToken, setUserToken} from '@/constants/api';


/**
 * 用户API服务类
 * 
 * @class UserApiService
 * @description 提供用户认证相关的API接口封装
 */
class UserApiService {
  /**
   * 用户登录接口
   * 
   * @method login
   * @param {Object} data - 登录数据
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 登录响应结果
   * @throws {Object} 登录失败时抛出错误信息
   */



  async login(data, options = {}) {
    console.log("denglu=",data)
    try {

      const response = await httpClient.post(
          '/auth/login', data, {
            headers: {
              'X-Request-Encrypted': 'true'
            }
          })

      console.log(response)
      return {
        success: true,
        data: response.data,
        token: response.data.token,
        user: {
          email: response.data.email,
          avatarUrl: response.data.avatarUrl
        },
        message: response.message || '登录成功'
      };
    } catch (error) {
      console.error('用户登录失败:', error);
      throw {
        success: false,
        error: error.message || '登录失败',
        code: error.code || 'LOGIN_ERROR',
        status: error.response?.status
      };
    }
  }
  
  /**
   * 用户注册接口
   * 
   * @method register
   * @param {Object} registerData - 注册数据
   * @param {string} registerData.encryptedData - 加密后的注册数据
   * @param {string} registerData.signature - 数字签名
   * @param {Object} registerData.tempPublicKey - 临时公钥
   * @param {Object} registerData.metadata - 元数据信息
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 注册响应结果
   * @throws {Object} 注册失败时抛出错误信息
   */
  async register(registerData, options = {}) {
    try {
      // 已经在发送请求之前就加密了，不要添加加密请求头了
      const response = await httpClient.post('/auth/register',registerData);
      return {
        success: true,
        data: response.data,
        message: response.message || '注册成功'
      };
    } catch (error) {
      console.error('用户注册失败:', error);
      throw {
        success: false,
        error: error.message || '注册失败',
        code: error.code || 'REGISTER_ERROR',
        status: error.response?.status
      };
    }
  }
  
  /**
   * 用户登出接口
   * 
   * @method logout
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 登出响应结果
   * @throws {Object} 登出失败时抛出错误信息
   */
  async logout(options = {}) {
    try {
      const response = await httpClient.post('/api/auth/logout', {
        timestamp: new Date().toISOString(),
        ...options
      });
      
      // 清除本地存储的认证信息
      removeUserToken()
      localStorage.removeItem('userInfo');
      httpClient.setAuthToken(null);
      
      return {
        success: true,
        message: response.message || '登出成功'
      };
    } catch (error) {
      console.error('用户登出失败:', error);
      throw {
        success: false,
        error: error.message || '登出失败',
        code: error.code || 'LOGOUT_ERROR'
      };
    }
  }
  
  /**
   * 刷新认证令牌
   * 
   * @method refreshToken
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 刷新令牌响应结果
   * @throws {Object} 刷新失败时抛出错误信息
   */
  async refreshToken(options = {}) {
    try {
      const response = await httpClient.post('/api/auth/refresh', {
        timestamp: new Date().toISOString(),
        ...options
      });
      
      // 更新认证令牌
      if (response.token) {
        httpClient.setAuthToken(response.token);
        setUserToken(response.token)
      }
      
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn,
        message: response.message || '令牌刷新成功'
      };
    } catch (error) {
      console.error('刷新令牌失败:', error);
      throw {
        success: false,
        error: error.message || '令牌刷新失败',
        code: error.code || 'REFRESH_TOKEN_ERROR'
      };
    }
  }
  
  /**
   * 获取用户信息
   * 
   * @method getUserInfo
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 用户信息响应结果
   * @throws {Object} 获取失败时抛出错误信息
   */
  async getUserInfo(options = {}) {
    try {
      const response = await httpClient.get('/api/user/profile', options);
      
      return {
        success: true,
        user: response.data,
        message: response.message || '获取用户信息成功'
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw {
        success: false,
        error: error.message || '获取用户信息失败',
        code: error.code || 'GET_USER_INFO_ERROR'
      };
    }
  }
  
  /**
   * 修改密码
   * 
   * @method changePassword
   * @param {Object} passwordData - 密码修改数据
   * @param {string} passwordData.encryptedData - 加密后的密码数据
   * @param {string} passwordData.signature - 数字签名
   * @param {Object} passwordData.tempPublicKey - 临时公钥
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 修改密码响应结果
   * @throws {Object} 修改失败时抛出错误信息
   */
  async changePassword(passwordData, options = {}) {
    try {
      const response = await httpClient.post('/api/user/change-password', {
        encryptedData: passwordData.encryptedData,
        signature: passwordData.signature,
        tempPublicKey: passwordData.tempPublicKey,
        metadata: {
          timestamp: new Date().toISOString(),
          clientVersion: process.env.VUE_APP_VERSION || '1.0.0'
        },
        ...options
      });
      
      return {
        success: true,
        message: response.message || '密码修改成功'
      };
    } catch (error) {
      console.error('修改密码失败:', error);
      throw {
        success: false,
        error: error.message || '修改密码失败',
        code: error.code || 'CHANGE_PASSWORD_ERROR'
      };
    }
  }
  
  /**
   * 重置密码（忘记密码）
   * 
   * @method resetPassword
   * @param {Object} resetData - 重置密码数据
   * @param {string} resetData.email - 用户邮箱
   * @param {string} resetData.resetToken - 重置令牌
   * @param {string} resetData.encryptedData - 加密后的新密码数据
   * @param {string} resetData.signature - 数字签名
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 重置密码响应结果
   * @throws {Object} 重置失败时抛出错误信息
   */
  async resetPassword(resetData, options = {}) {
    try {
      const response = await httpClient.post('/api/auth/reset-password', {
        email: resetData.email,
        resetToken: resetData.resetToken,
        encryptedData: resetData.encryptedData,
        signature: resetData.signature,
        metadata: {
          timestamp: new Date().toISOString(),
          clientVersion: process.env.VUE_APP_VERSION || '1.0.0'
        },
        ...options
      });
      
      return {
        success: true,
        message: response.message || '密码重置成功'
      };
    } catch (error) {
      console.error('重置密码失败:', error);
      throw {
        success: false,
        error: error.message || '重置密码失败',
        code: error.code || 'RESET_PASSWORD_ERROR'
      };
    }
  }
  
  /**
   * 发送密码重置邮件
   * 
   * @method sendResetEmail
   * @param {string} email - 用户邮箱
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 发送邮件响应结果
   * @throws {Object} 发送失败时抛出错误信息
   */
  async sendResetEmail(email, options = {}) {
    try {
      const response = await httpClient.post('/api/auth/send-reset-email', {
        email,
        timestamp: new Date().toISOString(),
        ...options
      });
      
      return {
        success: true,
        message: response.message || '重置邮件发送成功'
      };
    } catch (error) {
      console.error('发送重置邮件失败:', error);
      throw {
        success: false,
        error: error.message || '发送重置邮件失败',
        code: error.code || 'SEND_RESET_EMAIL_ERROR'
      };
    }
  }
  
  /**
   * 检查token是否存在且有效
   * 
   * @method checkTokenValidity
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} token验证结果
   * @throws {Object} 验证失败时抛出错误信息
   */
  async checkTokenValidity(options = {}) {
    try {
      // 从localStorage获取token
      const token = getUserToken()
      console.log("token = ", token)
      if (!token) {
        return {
          success: false,
          error: 'Token不存在',
          code: 'TOKEN_NOT_FOUND'
        };
      }
      const response = await httpClient.post("/auth/verifyToken", {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (isSuccessCode(response.code) && response.data) {
        return {
          success: true,
          data: {
            token
          },
          message: 'Token有效'
        };
      }
      return {
        success: false,
        error: 'Token已过期',
        code: 'TOKEN_VALIDATION_FAILED'
      };

    } catch (error) {
      console.error('Token验证失败:', error);
      throw {
        success: false,
        error: error.message || 'Token验证失败',
        code: error.code || 'TOKEN_VALIDATION_ERROR'
      };
    }
  }
  
  /**
   * 验证用户登录状态
   * 
   * @method validateLoginStatus
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 登录状态验证结果
   * @throws {Object} 验证失败时抛出错误信息
   */
  async validateLoginStatus(options = {}) {
    try {
      // 首先检查token有效性
      const tokenCheck = await this.checkTokenValidity();
      
      if (!tokenCheck.success) {
        return {
          success: false,
          isLoggedIn: false,
          error: tokenCheck.error,
          code: tokenCheck.code
        };
      } else {
        return {
          success: true,
          isLoggedIn: true,
        }
      }
    } catch (error) {
      console.error('登录状态验证失败:', error);
      throw {
        success: false,
        isLoggedIn: false,
        error: error.message || '登录状态验证失败',
        code: error.code || 'LOGIN_STATUS_VALIDATION_ERROR'
      };
    }
  }
  
  /**
   * 获取验证码接口
   * 
   * @method getVerificationCode
   * @param {string} email - 邮箱地址
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 获取验证码响应结果
   * @throws {Object} 获取失败时抛出错误信息
   */
  async getVerificationCode(email, options = {}) {
    try {
      const response = await httpClient.get('/auth/code', {
        params: {
          email
        },
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      return {
        success: true,
        data: response.data,
        message: response.message || '验证码获取成功'
      };
    } catch (error) {
      console.error('获取验证码失败:', error);
      throw {
        success: false,
        error: error.message || '获取验证码失败',
        code: error.code || 'GET_VERIFICATION_CODE_ERROR',
        status: error.response?.status || 500
      };
    }
  }
}

/**
 * 用户API服务实例
 * 
 * @const {UserApiService} userApiService
 * @description 用户API服务的单例实例
 */
const userApiService = new UserApiService();

/**
 * 默认导出用户API服务实例
 */
export default userApiService;

/**
 * 导出用户API服务类
 */
export { UserApiService };

/**
 * 用户API快捷方法对象
 * 
 * @const {Object} userApi
 * @description 提供用户API的快捷调用方法
 */
export const userApi = {
  /**
   * 用户登录
   * @param {Object} loginData - 登录数据
   * @returns {Promise<Object>} 登录结果
   */
  login: (loginData) => userApiService.login(loginData),
  
  /**
   * 用户注册
   * @param {Object} registerData - 注册数据
   * @returns {Promise<Object>} 注册结果
   */
  register: (registerData) => userApiService.register(registerData),
  
  /**
   * 用户登出
   * @returns {Promise<Object>} 登出结果
   */
  logout: () => userApiService.logout(),
  
  /**
   * 刷新令牌
   * @returns {Promise<Object>} 刷新结果
   */
  refreshToken: () => userApiService.refreshToken(),
  
  /**
   * 获取用户信息
   * @returns {Promise<Object>} 用户信息
   */
  getUserInfo: () => userApiService.getUserInfo(),
  
  /**
   * 修改密码
   * @param {Object} passwordData - 密码数据
   * @returns {Promise<Object>} 修改结果
   */
  changePassword: (passwordData) => userApiService.changePassword(passwordData),
  
  /**
   * 重置密码
   * @param {Object} resetData - 重置数据
   * @returns {Promise<Object>} 重置结果
   */
  resetPassword: (resetData) => userApiService.resetPassword(resetData),
  
  /**
   * 发送重置邮件
   * @param {string} email - 邮箱地址
   * @returns {Promise<Object>} 发送结果
   */
  sendResetEmail: (email) => userApiService.sendResetEmail(email),
  
  /**
   * 检查token是否存在且有效
   * @returns {Promise<Object>} 验证结果
   */
  checkTokenValidity: () => userApiService.checkTokenValidity(),
  
  /**
   * 验证用户登录状态
   * @returns {Promise<Object>} 登录状态验证结果
   */
  validateLoginStatus: () => userApiService.validateLoginStatus(),
  
  /**
   * 获取验证码
   * @param {string} email - 邮箱地址
   * @param {Object} options - 请求选项
   * @returns {Promise<Object>} 获取验证码结果
   */
  getVerificationCode: (email, options = {}) => userApiService.getVerificationCode(email, options)
};