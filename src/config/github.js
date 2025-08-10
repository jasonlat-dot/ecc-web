/**
 * GitHub仓库配置文件
 * 
 * @description 集中管理项目相关的GitHub仓库地址，便于维护和更新
 * @author ECC Team
 * @version 1.0.0
 */

/**
 * GitHub仓库地址配置
 * @type {Object}
 */
export const githubRepositories = {
  // 前端项目仓库
  frontend: {
    url: 'https://github.com/jasonlat-dot/ecc-web',
    name: '前端项目仓库',
    description: 'Vue 3 + ECC加密的前端演示项目，采用现代化的组件设计和响应式布局',
    tags: ['Vue 3', 'ECC加密', '响应式']
  },
  
  // 后端服务仓库
  backend: {
    url: 'https://github.com/jasonlat-dot/Ecc-Server-Demo',
    name: '后端服务仓库',
    description: '配套的后端API服务，处理ECC加密数据，提供完整的用户认证和数据管理',
    tags: ['Spring Boot', 'RESTful API', 'MySQL']
  },
  
  // ECC加密库仓库
  crypto: {
    url: 'https://github.com/jasonlat-dot/ecc-encrypt-springboot-starter',
    name: 'ECC加密库',
    description: 'Java实现的ECC椭圆曲线加密JAR包，提供安全可靠的加密解密功能',
    tags: ['Java', 'ECC', 'secp256k1']
  },
}

/**
 * 获取所有仓库信息
 * @returns {Object} 所有GitHub仓库配置
 */
export const getAllRepositories = () => {
  return githubRepositories
}

/**
 * 根据类型获取仓库信息
 * @param {string} type - 仓库类型 (frontend, backend, crypto, docs)
 * @returns {Object|null} 指定类型的仓库配置
 */
export const getRepositoryByType = (type) => {
  return githubRepositories[type] || null
}

/**
 * 获取仓库URL
 * @param {string} type - 仓库类型
 * @returns {string} 仓库URL
 */
export const getRepositoryUrl = (type) => {
  const repo = getRepositoryByType(type)
  return repo ? repo.url : '#'
}

export default githubRepositories