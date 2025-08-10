<template>
  <div id="login-page">
    <!-- 背景装饰组件 -->
    <BackgroundDecoration />

    <!-- PC端布局容器 -->
    <div class="pc-layout-container">
      <!-- 左侧信息区域 -->
      <div class="left-info-section">
        <div class="brand-info">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="brand-title">SecureAuth</h1>
          <p class="brand-subtitle">基于ECC椭圆曲线加密的安全认证系统</p>
        </div>
        
        <div class="features-list">
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.7C8,12.1 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>安全加密</h3>
              <p>采用椭圆曲线加密算法，确保数据传输安全</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M9,12L11,14L15,10M21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5Z"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>数字签名</h3>
              <p>支持数字签名验证，保证身份真实性</p>
            </div>
          </div>
          
          <div class="feature-item">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>私钥管理</h3>
              <p>本地生成和管理私钥，用户完全控制</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单区域（撑满） -->
      <div class="right-form-section">
        <!-- 登录提示信息 -->
        <div v-if="loginMessage" class="login-message">
          <div class="message-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
            </svg>
          </div>
          <p>{{ loginMessage }}</p>
        </div>
        
        <div class="form-wrapper">
          <LoginForm
            title="用户登录"
            description="请输入您的登录信息以访问您的账户"
            submit-text="立即登录"
            submit-processing-text="正在登录..."
            footer-text="还没有账户？"
            register-link-text="立即注册"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
            @register-click="handleRegisterClick"
            @forgot-password="handleForgotPassword"
            @file-upload="handleFileUpload"
            ref="loginFormRef"
          />
        </div>
        
        <!-- 装饰元素 -->
        <div class="decorative-elements">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
          <div class="floating-shape shape-4"></div>
        </div>
      </div>
    </div>

    <!-- 成功模态框组件 -->
    <SuccessModal
      :visible="showSuccessModal"
      title="登录成功"
      message="欢迎回来！您已成功登录到您的账户。"
      confirm-text="进入系统"
      :show-encryption-info="true"
      :encryption-data="encryptionData"
      @confirm="handleLoginSuccess"
      @close="closeSuccessModal"
      ref="successModalRef"
    />
  </div>
</template>

<script setup>
/**
 * 登录页面组件
 * 
 * @description 完整的用户登录页面，整合登录表单、背景装饰和成功提示等功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 导入样式
import '../../styles/app.css'

// 导入工具类
import { showError, showWarning } from '@/utils/notification'

// 导入API服务
import { userApi } from '@/api/user'

// 导入组件
import BackgroundDecoration from '../layout/BackgroundDecoration.vue'
import LoginForm from '../auth/LoginForm.vue'
import SuccessModal from '../modal/SuccessModal.vue'
import {setUserToken} from "@/constants/api";

/**
 * 响应式数据
 */

/**
 * 提交状态
 */
const isSubmitting = ref(false)

/**
 * 成功模态框显示状态
 */
const showSuccessModal = ref(false)

/**
 * 加密数据（用于模态框显示）
 */
const encryptionData = ref(null)

/**
 * 路由实例
 */
const router = useRouter()
const route = useRoute()

/**
 * 重定向URL
 */
const redirectUrl = ref('')

/**
 * 登录提示信息
 */
const loginMessage = ref('')

/**
 * 组件引用
 */
const loginFormRef = ref(null)
const successModalRef = ref(null)

/**
 * 事件处理方法
 */

/**
 * 处理登录提交
 * @param {Object} loginData - 登录数据（包含加密数据、签名、临时公钥）
 */
const handleSubmit = async (loginData) => {
  isSubmitting.value = true
  console.log(loginData)
  try {
    // 发送登录请求到后端
    const response = await userApi.login(loginData)
    console.log('登录请求成功:', response)
    
    // 保存加密数据用于模态框显示
    encryptionData.value = {
      algorithm: 'ECIES + ECDSA',
    }

    // 保存 token
    setUserToken(response.data.token)

    // 显示成功模态框
    showSuccessModal.value = true

  } catch (error) {
    console.error('登录失败:', error)
    
    // 处理不同类型的错误
    let errorMessage = '登录失败，请重试'
    
    if (error.success === false) {
      // 使用新的 userApi 错误格式
      switch (error.status) {
        case 401:
          errorMessage = '邮箱或密码错误，请检查后重试'
          break
        case 403:
          errorMessage = '账户已被锁定，请联系管理员'
          break
        case 422:
          errorMessage = '数据验证失败，请检查输入信息'
          break
        case 500:
          errorMessage = '服务器内部错误，请稍后重试'
          break
        default:
          errorMessage = error.error || '登录失败，请重试'
      }
    } else if (error.response) {
      // 兼容原有的 httpClient 错误格式
      switch (error.response.status) {
        case 401:
          errorMessage = '邮箱或密码错误，请检查后重试'
          break
        case 403:
          errorMessage = '账户已被锁定，请联系管理员'
          break
        case 422:
          errorMessage = '数据验证失败，请检查输入信息'
          break
        case 500:
          errorMessage = '服务器内部错误，请稍后重试'
          break
        default:
          errorMessage = error.response.data?.message || '登录失败，请重试'
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络后重试'
    }
    
    // 显示错误提示
    showError(errorMessage)
    
  } finally {
    isSubmitting.value = false
  }
}

/**
 * 处理注册点击
 */
const handleRegisterClick = () => {
  console.log('跳转到注册页面')
  // 这里可以使用Vue Router进行页面跳转
  // router.push('/register')
  
  // 临时解决方案：重新加载页面到注册页面
  window.location.href = '/register'
}

/**
 * 处理忘记密码点击
 */
const handleForgotPassword = () => {
  console.log('跳转到忘记密码页面')
  // 这里可以使用Vue Router进行页面跳转
  // router.push('/forgot-password')
  
  // 临时解决方案：显示提示
  showWarning('忘记密码功能正在开发中，请联系管理员重置密码')
}

/**
 * 处理文件上传
 * @param {File} file - 上传的文件
 * @param {Object} keyData - 解析的密钥数据
 */
const handleFileUpload = (file, keyData) => {
  console.log('密钥对文件上传成功:', {
    fileName: file.name,
    fileSize: file.size,
    // keyData: {
    //   hasPrivateKey: !!keyData.privateKey,
    //   hasPublicKey: !!keyData.publicKey,
    //   timestamp: keyData.timestamp,
    //   curve: keyData.curve
    // }
  })
}

/**
 * 处理登录成功
 */
const handleLoginSuccess = () => {
  console.log('用户确认登录成功，准备跳转')
  
  // 关闭模态框
  closeSuccessModal()
  
  // 检查是否有重定向URL
  const targetUrl = redirectUrl.value || '/notification'
  console.log('跳转到:', targetUrl)
  
  // 跳转到目标页面
  router.push(targetUrl)
  
  // 重置表单
  if (loginFormRef.value) {
    loginFormRef.value.resetForm()
  }
}

/**
 * 关闭成功模态框
 */
const closeSuccessModal = () => {
  showSuccessModal.value = false
  encryptionData.value = null
}

/**
 * 组件挂载时检查重定向参数
 */
onMounted(() => {
  // 检查URL参数
  const redirect = route.query.redirect
  const expired = route.query.expired
  const invalid = route.query.invalid
  
  if (redirect) {
    redirectUrl.value = redirect
    console.log('检测到重定向参数:', redirect)
  }
  
  // 设置提示信息
  if (expired === 'true') {
    loginMessage.value = '登录已过期，请重新登录后访问API测试页面'
    showWarning('登录已过期，请重新登录')
  } else if (invalid === 'true') {
    loginMessage.value = '登录信息无效，请重新登录后访问API测试页面'
    showWarning('登录信息无效，请重新登录')
  } else if (redirect) {
    if (redirect.includes('/api-test')) {
      loginMessage.value = '请先登录后访问API测试页面'
      showWarning('请先登录后访问API测试页面')
    } else {
      loginMessage.value = '请先登录后访问该页面'
      showWarning('请先登录后访问该页面')
    }
  }
})

/**
 * 组件卸载前清理
 */
onBeforeUnmount(() => {
  // 清理定时器或其他资源
  if (successModalRef.value) {
    successModalRef.value = null
  }
})

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 重置页面状态
   */
  resetPage: () => {
    isSubmitting.value = false
    showSuccessModal.value = false
    encryptionData.value = null
    
    if (loginFormRef.value) {
      loginFormRef.value.resetForm()
    }
  },
  
  /**
   * 获取页面状态
   */
  getPageState: () => ({
    isSubmitting: isSubmitting.value,
    showSuccessModal: showSuccessModal.value,
    hasEncryptionData: !!encryptionData.value
  })
})
</script>

<style scoped>
/**
 * 登录页面PC端布局样式
 */
#login-page {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-x: hidden;
  overflow-y: auto;
}

/**
 * PC端两栏布局容器
 */
.pc-layout-container {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: 60px;
  width: 100%;
  max-width: 1400px;
  min-height: 80vh;
  align-items: center;
  z-index: 2;
  position: relative;
}

/**
 * 左侧信息区域
 */
.left-info-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 40px 20px;
}

.brand-info {
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.logo-icon svg {
  width: 40px;
  height: 40px;
  color: white;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ff6b35;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0 0 12px 0;
}

.brand-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.feature-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.2);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.feature-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.feature-content p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/**
 * 右侧表单区域（撑满）
 */
.right-form-section {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  min-height: 80vh;
  max-height: 100vh;
  overflow: hidden;
}

/**
 * 登录提示信息样式
 */
.login-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 193, 7, 0.15);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.1);
  animation: slideInDown 0.3s ease-out;
}

.login-message .message-icon {
  width: 24px;
  height: 24px;
  color: #ffc107;
  flex-shrink: 0;
}

.login-message .message-icon svg {
  width: 100%;
  height: 100%;
}

.login-message p {
  margin: 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-wrapper {
  width: 100%;
  max-width: none;
  z-index: 10;
  position: relative;
}

.security-stats {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.security-stats h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0 0 20px 0;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-item {
  text-align: center;
  margin-bottom: 16px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/**
 * 装饰元素
 */
.decorative-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.4;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.shape-4 {
  width: 40px;
  height: 40px;
  bottom: 25%;
  right: 10%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/**
 * 美化页面滚动条样式
 */
#login-page::-webkit-scrollbar {
  width: 8px;
}

#login-page::-webkit-scrollbar-track {
  background: transparent;
}

#login-page::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.2);
  border-radius: 10px;
  transition: background 0.3s ease;
}

#login-page::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.4);
}

/* Firefox滚动条样式 */
#login-page {
  scrollbar-width: thin;
  scrollbar-color: rgba(102, 126, 234, 0.2) transparent;
}

/**
 * 响应式调整
 */
@media (max-width: 1200px) {
  .pc-layout-container {
    grid-template-columns: 400px 1fr;
    gap: 40px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .logo-icon {
    width: 60px;
    height: 60px;
  }
  
  .logo-icon svg {
    width: 30px;
    height: 30px;
  }
}

@media (max-width: 1024px) {
  .pc-layout-container {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 500px;
  }
  
  .left-info-section {
    display: none;
  }
  
  .right-form-section {
    width: 100%;
    padding: 20px;
  }
  
  .form-wrapper {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  #login-page {
    padding: 16px;
  }
  
  .pc-layout-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  #login-page {
    padding: 12px;
    align-items: flex-start;
    padding-top: 20px;
    padding-bottom: 20px;
  }
}

/**
 * 深色模式支持
 */
@media (prefers-color-scheme: dark) {
  #login-page {
    background: #0f1419;
  }
  
  .feature-item {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .feature-item:hover {
    background: rgba(255, 255, 255, 0.12);
  }
  
  .security-stats {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .brand-subtitle {
    color: rgba(255, 255, 255, 1);
  }
  
  .feature-content h3 {
    color: rgba(255, 255, 255, 1);
  }
  
  .feature-content p {
    color: rgba(255, 255, 255, 0.95);
  }
  
  .security-stats h3 {
    color: rgba(255, 255, 255, 1);
  }
  
  .stat-label {
    color: rgba(255, 255, 255, 0.95);
  }
}
</style>