/**
 * AES加密解密工具类
 * 
 * @description 提供AES-GCM加密和解密功能，用于安全存储用户私钥
 * @author ECC Team
 * @version 1.0.0
 */

import {userEmailKey} from "@/constants/api";

/**
 * AES加密解密类
 */
export class AESCrypto {
  /**
   * 生成密钥的哈希值
   * @param {string} password - 用户密码
   * @param {string} timestamp - 时间戳
   * @returns {Promise<string>} 返回哈希值的十六进制字符串
   */
  static async generateKeyHash(password, timestamp) {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(password + timestamp)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = new Uint8Array(hashBuffer)
      const hashHex = Array.from(hashArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      return hashHex
    } catch (error) {
      console.error('生成密钥哈希失败:', error)
      throw new Error('密钥哈希生成失败')
    }
  }

  /**
   * 从哈希值导入AES密钥
   * @param {string} hashHex - 哈希值的十六进制字符串
   * @returns {Promise<CryptoKey>} 返回AES密钥对象
   */
  static async importKeyFromHash(hashHex) {
    try {
      // 将十六进制字符串转换为ArrayBuffer
      const keyBuffer = new Uint8Array(
        hashHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      ).buffer
      
      // 导入AES密钥
      const key = await crypto.subtle.importKey(
        'raw',
        keyBuffer,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      )
      
      return key
    } catch (error) {
      console.error('导入AES密钥失败:', error)
      throw new Error('AES密钥导入失败')
    }
  }

  /**
   * AES-GCM加密
   * @param {string} plaintext - 要加密的明文
   * @param {string} keyHash - 密钥哈希值
   * @returns {Promise<Object>} 返回包含密文和IV的对象
   */
  static async encrypt(plaintext, keyHash) {
    try {
      // 导入密钥
      const key = await this.importKeyFromHash(keyHash)
      
      // 生成随机IV
      const iv = crypto.getRandomValues(new Uint8Array(12))
      
      // 编码明文
      const encoder = new TextEncoder()
      const data = encoder.encode(plaintext)
      
      // 执行加密
      const cipherBuffer = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        data
      )
      
      // 转换为十六进制字符串
      const cipherArray = new Uint8Array(cipherBuffer)
      const cipherHex = Array.from(cipherArray)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      const ivHex = Array.from(iv)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
      
      return {
        ciphertext: cipherHex,
        iv: ivHex,
        algorithm: 'AES-GCM',
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('AES加密失败:', error)
      throw new Error('数据加密失败')
    }
  }

  /**
   * AES-GCM解密
   * @param {string} cipherHex - 密文的十六进制字符串
   * @param {string} ivHex - IV的十六进制字符串
   * @param {string} keyHash - 密钥哈希值
   * @returns {Promise<string>} 返回解密后的明文
   */
  static async decrypt(cipherHex, ivHex, keyHash) {
    try {
      // 导入密钥
      console.log("keyHash:", keyHash)
      const key = await this.importKeyFromHash(keyHash)
      
      // 转换十六进制字符串为ArrayBuffer
      const cipherBuffer = new Uint8Array(
        cipherHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      ).buffer
      
      const iv = new Uint8Array(
        ivHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
      )
      
      // 执行解密
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        cipherBuffer
      )
      
      // 解码为字符串
      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch (error) {
      console.error('AES解密失败:', error)
      throw new Error('数据解密失败')
    }
  }

  /**
   * 存储加密的私钥到本地存储
   * @param {string} privateKey - 用户私钥
   * @param {string} password - 用户密码
   * @param {string} email - 用户邮箱（用作存储键的一部分）
   * @returns {Promise<Object>} 返回存储信息
   */
  static async storePrivateKey(privateKey, password, email) {
    try {
      // 生成时间戳
      const timestamp = Date.now().toString()
      
      // 生成密钥哈希
      const keyHash = await this.generateKeyHash(password, timestamp)
      
      // 加密私钥
      const encryptedData = await this.encrypt(privateKey, keyHash)
      // 构造存储对象
      const storageData = {
        encryptedPrivateKey: encryptedData.ciphertext,
        iv: encryptedData.iv,
        keyHash: keyHash,
        timestamp: timestamp,
        email: email,
        algorithm: encryptedData.algorithm,
        createdAt: encryptedData.timestamp
      }
      
      // 存储到localStorage
      localStorage.setItem(userEmailKey, email)
      const storageKey = `userPrivateKey_${email}`
      localStorage.setItem(storageKey, JSON.stringify(storageData))
      console.log('私钥已安全存储到本地')
      
      return {
        success: true,
        storageKey: storageKey,
        keyHash: keyHash,
        timestamp: timestamp
      }
    } catch (error) {
      console.error('存储私钥失败:', error)
      throw new Error('私钥存储失败')
    }
  }

  /**
   * 从本地存储读取并解密私钥
   * @returns {Promise<string>} 返回解密后的私钥
   */
  static async retrievePrivateKey() {
    try {
      // 构造存储键
      const email = localStorage.getItem(userEmailKey)
      if (!email) {
        throw new Error('未找到存储的私钥数据')
      }
      const storageKey = `userPrivateKey_${email}`
      
      // 从localStorage读取数据
      const storageDataStr = localStorage.getItem(storageKey)
      if (!storageDataStr) {
        throw new Error('未找到存储的私钥数据')
      }
      
      const storageData = JSON.parse(storageDataStr)
      
      // 解密私钥
      const privateKey = await this.decrypt(
          storageData.encryptedPrivateKey,
          storageData.iv,
          storageData.keyHash
      )
      
      console.log('私钥解密成功: ', privateKey)
      
      return privateKey
    } catch (error) {
      console.error('读取私钥失败:', error)
      throw new Error('私钥读取失败: ' + error.message)
    }
  }

  /**
   * 检查是否存在存储的私钥
   * @param {string} email - 用户邮箱
   * @returns {boolean} 是否存在存储的私钥
   */
  static hasStoredPrivateKey(email) {
    const storageKey = `ecc_private_key_${email}`
    return localStorage.getItem(storageKey) !== null
  }

  /**
   * 删除存储的私钥
   * @param {string} email - 用户邮箱
   * @returns {boolean} 是否删除成功
   */
  static removeStoredPrivateKey(email) {
    try {
      const storageKey = `ecc_private_key_${email}`
      localStorage.removeItem(storageKey)
      console.log('已删除存储的私钥')
      return true
    } catch (error) {
      console.error('删除私钥失败:', error)
      return false
    }
  }

  /**
   * 获取存储的私钥信息（不包含敏感数据）
   * @param {string} email - 用户邮箱
   * @returns {Object|null} 私钥存储信息
   */
  static getStoredKeyInfo(email) {
    try {
      const storageKey = `ecc_private_key_${email}`
      const storageDataStr = localStorage.getItem(storageKey)
      
      if (!storageDataStr) {
        return null
      }
      
      const storageData = JSON.parse(storageDataStr)
      
      return {
        email: storageData.email,
        algorithm: storageData.algorithm,
        createdAt: storageData.createdAt,
        timestamp: storageData.timestamp,
        hasKey: true
      }
    } catch (error) {
      console.error('获取私钥信息失败:', error)
      return null
    }
  }

  /**
   * 验证存储的私钥是否可以用指定密码解密
   * @param {string} password - 用户密码
   * @param {string} email - 用户邮箱
   * @returns {Promise<boolean>} 是否验证成功
   */
  static async validateStoredPrivateKey(password, email) {
    try {
      const keyInfo = this.getStoredKeyInfo(email)
      if (!keyInfo) {
        return false
      }
      
      // 尝试解密私钥
      await this.retrievePrivateKey()
      return true
    } catch (error) {
      console.log('私钥验证失败:', error.message)
      return false
    }
  }

}

/**
 * 默认导出AES加密工具类
 */
export default AESCrypto