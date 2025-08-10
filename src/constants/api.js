/**
 * API 响应状态码常量
 * 
 * @description 定义所有API响应中使用的状态码常量，避免硬编码
 * @author ECC Team
 * @version 1.0.0
 */

import ECCCrypto from "@/utils/ecc";
import {serverService} from "@/api/server";
import AESCrypto from "@/utils/aes";

/**
 * 成功状态码
 */
export const SUCCESS_CODES = {
  /** 操作成功 */
  SUCCESS: 'SUCCESS_0000',
  /** 创建成功 */
  CREATED: 'SUCCESS_0001',
  /** 更新成功 */
  UPDATED: 'SUCCESS_0002',
  /** 删除成功 */
  DELETED: 'SUCCESS_0003'
}

/**
 * 错误状态码
 */
export const ERROR_CODES = {
  /** 参数错误 */
  INVALID_PARAMS: 'ERROR_1000',
  /** 认证失败 */
  AUTH_FAILED: 'ERROR_1001',
  /** 权限不足 */
  PERMISSION_DENIED: 'ERROR_1002',
  /** 资源不存在 */
  NOT_FOUND: 'ERROR_1003',
  /** 资源已存在 */
  ALREADY_EXISTS: 'ERROR_1004',
  /** 服务器内部错误 */
  INTERNAL_ERROR: 'ERROR_5000',
  /** 服务不可用 */
  SERVICE_UNAVAILABLE: 'ERROR_5001'
}

/**
 * 业务状态码
 */
export const BUSINESS_CODES = {
  /** 用户已存在 */
  USER_EXISTS: 'BIZ_2001',
  /** 用户不存在 */
  USER_NOT_EXISTS: 'BIZ_2002',
  /** 密码错误 */
  WRONG_PASSWORD: 'BIZ_2003',
  /** 验证码错误 */
  WRONG_VERIFICATION_CODE: 'BIZ_2004',
  /** 验证码已过期 */
  VERIFICATION_CODE_EXPIRED: 'BIZ_2005'
}

/**
 * 所有状态码的集合
 */
export const API_CODES = {
  ...SUCCESS_CODES,
  ...ERROR_CODES,
  ...BUSINESS_CODES
}

/**
 * 检查响应是否成功
 * @param {string} code - 响应状态码
 * @returns {boolean} 是否成功
 */
export const isSuccessCode = (code) => {
  return Object.values(SUCCESS_CODES).includes(code)
}

/**
 * 检查响应是否为错误
 * @param {string} code - 响应状态码
 * @returns {boolean} 是否为错误
 */
export const isErrorCode = (code) => {
  return Object.values(ERROR_CODES).includes(code) || Object.values(BUSINESS_CODES).includes(code)
}

/**
 * 获取状态码对应的消息
 * @param {string} code - 响应状态码
 * @returns {string} 状态码对应的消息
 */
export const getCodeMessage = (code) => {
  const messages = {
    [SUCCESS_CODES.SUCCESS]: '操作成功',
    [SUCCESS_CODES.CREATED]: '创建成功',
    [SUCCESS_CODES.UPDATED]: '更新成功',
    [SUCCESS_CODES.DELETED]: '删除成功',
    
    [ERROR_CODES.INVALID_PARAMS]: '参数错误',
    [ERROR_CODES.AUTH_FAILED]: '认证失败',
    [ERROR_CODES.PERMISSION_DENIED]: '权限不足',
    [ERROR_CODES.NOT_FOUND]: '资源不存在',
    [ERROR_CODES.ALREADY_EXISTS]: '资源已存在',
    [ERROR_CODES.INTERNAL_ERROR]: '服务器内部错误',
    [ERROR_CODES.SERVICE_UNAVAILABLE]: '服务不可用',
    
    [BUSINESS_CODES.USER_EXISTS]: '用户已存在',
    [BUSINESS_CODES.USER_NOT_EXISTS]: '用户不存在',
    [BUSINESS_CODES.WRONG_PASSWORD]: '密码错误',
    [BUSINESS_CODES.WRONG_VERIFICATION_CODE]: '验证码错误',
    [BUSINESS_CODES.VERIFICATION_CODE_EXPIRED]: '验证码已过期'
  }
  
  return messages[code] || '未知状态'
}


export const encryptHeaderKey = 'X-Request-Encrypted';

// 加密请求头
export const encryptHeader = {
  'X-Request-Encrypted': 'true' // 自定义加密请求头，后端可根据此判断是否需要解密
};

export const userTokenKey = 'authToken'

// 创建ECC实例
const ECC = new ECCCrypto()
// 创建server实例
const Server = new serverService()


export async function encryptRequestData(data) {
  // 1. 获取服务器密钥
  const serverPublicKey = await Server.getServerPublicKey()

  // 2. 使用服务器公钥加密登录数据
  const encryptedData = await ECC.encrypt(JSON.stringify(data), serverPublicKey)

  // 3. 构造加密数据格式
  const submitData = {
    encryptedData: encryptedData
  }

  // 4. 使用用户私钥进行数字签名
  const userPrivateKeyInfo =  await AESCrypto.retrievePrivateKey()
  const signature = await ECC.sign(encryptedData.ciphertext, userPrivateKeyInfo)
  console.log("生成的签名", signature)
  submitData.encryptedData.signature = signature

  // 5. 返回数据
  return submitData;
}

/**
 * 解密响应数据
 * @param {Object} responseData - 服务器返回的加密响应数据
 * @returns {Promise<Object>} 解密后的数据
 */
export async function decryptResponseData(responseData) {
  try {
    console.log('开始解密响应数据...', responseData);
    
    // 1. 解密用户私钥
    const userPrivateKeyInfo = await AESCrypto.retrievePrivateKey();
    
    // 2. 获取服务器公钥用于验签
    const serverPublicKey = await Server.getServerPublicKey();
    console.log("服务器公钥", serverPublicKey);
    
    // 3. 验证服务器签名
    const verifyData = await ECC.verify(
      responseData.data.ciphertext, 
      responseData.data.signature, 
      serverPublicKey
    );
    
    if (!verifyData) {
      throw new Error("服务器签名验证失败");
    }
    
    console.log('服务器签名验证成功');
    
    // 4. 解密数据
    const decryptedMessage = await ECC.decrypt(responseData.data, userPrivateKeyInfo);
    
    // 5. 尝试解析解密后的JSON数据
    try {
      const decryptedData = JSON.parse(decryptedMessage);
      console.log('解密成功，返回明文数据:', decryptedData);
      return decryptedData;
    } catch (parseError) {
      console.log('解密后的数据不是JSON格式，返回原始字符串');
      return {
        ...responseData,
        decryptedData: decryptedMessage
      };
    }
    
  } catch (error) {
    console.error('解密响应数据失败:', error);
    const decryptError = new Error(`响应数据解密失败: ${error.message}`);
    decryptError.code = 'DECRYPT_ERROR';
    decryptError.originalData = responseData;
    throw decryptError;
  }
}

