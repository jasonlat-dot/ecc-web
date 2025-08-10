/**
 * ECC加密相关API服务
 * 提供与服务器端ECC加密功能相关的API调用
 */

import http from '../utils/http.js';

/**
 * ECC API服务类
 */
class ECCApiService {
  /**
   * 获取服务器公钥
   * @param {Object} options 请求选项
   * @returns {Promise<Object>} 服务器公钥信息
   */
  async getServerPublicKey(options = {}) {
    try {
      const response = await http.post('/auth/server/key', {
        timestamp: new Date(),
        clientVersion: process.env.VUE_APP_VERSION || '1.0.0',
        ...options
      });
      console.log(response)
      return {
        success: true,
        code: response.code,
        publicKey: response.data.publicKey,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('获取服务器公钥失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'GET_PUBLIC_KEY_ERROR'
      };
    }
  }
  
  /**
   * 发送加密数据到服务器
   * @param {Object} encryptedData 加密后的数据
   * @param {Object} options 请求选项
   * @returns {Promise<Object>} 服务器响应
   */
  async sendEncryptedData(encryptedData, options = {}) {
    try {
      const response = await http.post('/api/secure/decrypt', {
        encryptedData,
        clientTimestamp: new Date().toISOString(),
        ...options
      });
      
      return {
        success: true,
        data: response.data,
        message: response.data.message || '数据发送成功'
      };
    } catch (error) {
      console.error('发送加密数据失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'SEND_ENCRYPTED_DATA_ERROR'
      };
    }
  }
  
  /**
   * 发送加密数据到服务器进行解密
   * @param {Object} encryptedData 加密后的数据对象
   * @param {string} encryptedData.ciphertext 加密的密文
   * @param {string} encryptedData.iv 初始化向量
   * @param {Object} encryptedData.tempPublicKey 临时公钥
   * @param {string} encryptedData.tempPublicKey.x 临时公钥x坐标
   * @param {string} encryptedData.tempPublicKey.y 临时公钥y坐标
   * @returns {Promise<Object>} 解密结果
   */
  async decryptOnServer(encryptedData) {
    try {
      // 转换前端数据格式为后端期望的格式
      const backendFormat = {
        ciphertext: encryptedData.ciphertext,
        iv: encryptedData.iv,
        ephemeralPublicKeyX: encryptedData.tempPublicKey.x,
        ephemeralPublicKeyY: encryptedData.tempPublicKey.y,
        signature: encryptedData.signature
      };
      
      const response = await http.post('/api/crypto/decrypt', backendFormat);
      
      return {
        success: true,
        decryptedData: response.data.decryptedData,
        message: response.data.message || '解密成功',
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('服务器解密失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'SERVER_DECRYPT_ERROR'
      };
    }
  }
  
  /**
   * 验证数字签名
   * @param {Object} signatureData 签名数据
   * @param {Object} options 请求选项
   * @returns {Promise<Object>} 验证结果
   */
  async verifySignature(signatureData, options = {}) {
    try {
      const response = await http.post('/api/signature/verify', {
        ...signatureData,
        clientTimestamp: new Date().toISOString(),
        ...options
      });
      
      return {
        success: true,
        isValid: response.data.isValid,
        message: response.data.message,
        details: response.data.details
      };
    } catch (error) {
      console.error('验证数字签名失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'VERIFY_SIGNATURE_ERROR'
      };
    }
  }
  
  /**
   * 获取服务器支持的加密算法信息
   * @returns {Promise<Object>} 算法信息
   */
  async getSupportedAlgorithms() {
    try {
      const response = await http.get('/api/crypto/algorithms');
      
      return {
        success: true,
        algorithms: response.data.algorithms,
        curves: response.data.curves,
        versions: response.data.versions
      };
    } catch (error) {
      console.error('获取支持的算法信息失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'GET_ALGORITHMS_ERROR'
      };
    }
  }
  
  /**
   * 健康检查
   * @returns {Promise<Object>} 服务器状态
   */
  async healthCheck() {
    try {
      const response = await http.get('/api/health');
      
      return {
        success: true,
        status: response.data.status,
        timestamp: response.data.timestamp,
        version: response.data.version
      };
    } catch (error) {
      console.error('健康检查失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'HEALTH_CHECK_ERROR'
      };
    }
  }
  
  /**
   * 获取服务器时间（用于时间同步）
   * @returns {Promise<Object>} 服务器时间信息
   */
  async getServerTime() {
    try {
      const response = await http.get('/api/time');
      
      return {
        success: true,
        serverTime: response.data.timestamp,
        timezone: response.data.timezone,
        offset: response.data.offset
      };
    } catch (error) {
      console.error('获取服务器时间失败:', error);
      throw {
        success: false,
        error: error.message,
        code: error.code || 'GET_SERVER_TIME_ERROR'
      };
    }
  }
}

// 创建单例实例
const eccApiService = new ECCApiService();

// 导出实例和类
export default eccApiService;
export { ECCApiService };

// 导出便捷方法
export const eccApi = {
  // 获取服务器公钥
  getServerPublicKey: (options) => eccApiService.getServerPublicKey(options),
  
  // 发送加密数据
  sendEncryptedData: (data, options) => eccApiService.sendEncryptedData(data, options),
  
  // 服务器解密
  decryptOnServer: (encryptedData) => eccApiService.decryptOnServer(encryptedData),
  
  // 验证签名
  verifySignature: (signatureData, options) => eccApiService.verifySignature(signatureData, options),
  
  // 获取算法信息
  getSupportedAlgorithms: () => eccApiService.getSupportedAlgorithms(),
  
  // 健康检查
  healthCheck: () => eccApiService.healthCheck(),
  
  // 获取服务器时间
  getServerTime: () => eccApiService.getServerTime()
};