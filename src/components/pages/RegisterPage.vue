<template>
  <div class="register-page">
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
        
        <div class="form-info">
           <h2 class="form-title">创建账户</h2>
           <p class="form-description">填写右侧信息</p>
         </div>
      </div>

      <!-- 右侧注册表单区域 -->
      <div class="right-form-section">
        <div class="form-wrapper">
          <RegisterForm
            title=""
            description=""
            submit-text="创建账户"
            submit-processing-text="正在注册..."
            footer-text="已有账户？"
            login-link-text="立即登录"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
            @send-verification-code="handleSendVerificationCode"
            @generate-key-pair="handleGenerateKeyPair"
            @login-click="handleLoginClick"
            @copy-to-clipboard="handleCopyToClipboard"
            @export-key-pair="handleExportKeyPair"
            ref="registerFormRef"
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
      v-if="showSuccessModal"
      :visible="showSuccessModal"
      title="注册成功！"
      message="您的账户已成功创建！点击确认或等待倒计时结束后将跳转到登录页面。"
      confirm-text="确定"
      :show-encryption-info="true"
      :encryption-items="encryptionItems"
      :close-on-overlay="false"
      :show-countdown="true"
      :countdown-time="10"
      @close="handleSuccessModalConfirm"
      @confirm="handleSuccessModalConfirm"
    />
  </div>
</template>

<script setup>
/**
 * 用户注册页面组件
 * 
 * @description 处理用户注册相关的所有业务逻辑，包括ECC密钥对生成、数据加密等
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import {onBeforeUnmount, ref} from 'vue'
import {useRouter} from 'vue-router'

// 导入工具类
import ECCCrypto from '@/utils/ecc.js'
import AESCrypto from '@/utils/aes.js'

// 导入API服务
import {userApi} from '@/api/user.js'

// 导入通知服务
import {showError} from '@/utils/notification'

// 导入组件
import BackgroundDecoration from '@/components/layout/BackgroundDecoration.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import SuccessModal from '@/components/modal/SuccessModal.vue'
import Server from "@/api/server";

// 创建ECC实例
const ECC = new ECCCrypto()

// 路由实例
const router = useRouter()

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
 * 加密信息列表
 */
const encryptionItems = ref([])

/**
 * 注册表单组件引用
 */
const registerFormRef = ref(null)

/**
 * 事件处理方法
 */

/**
 * 处理发送验证码
 * @param {String} email - 邮箱地址
 */
const handleSendVerificationCode = async (email) => {
  try {
    // 调用获取验证码API
    const response = await userApi.getVerificationCode(email)
    
    if (response.success) {
      console.log('验证码已发送到:', email)
      // 可以在这里显示成功提示
      // 注册表单组件会自动处理倒计时
    } else {
      throw new Error(response.error || '验证码发送失败')
    }
    
  } catch (error) {
    console.error('发送验证码失败:', error)
    // 显示错误提示
    showError(error.message || '验证码发送失败，请重试')
    throw error
  }
}

/**
 * 处理生成密钥对
 */
const handleGenerateKeyPair = async () => {
  try {
    // 使用ECC工具生成密钥对
    const keyPair = ECC.generateKeyPair()
    
    const formattedKeyPair = {
      publicKey: {
        x: keyPair.publicKey.x,
        y: keyPair.publicKey.y
      },
      privateKey: keyPair.privateKey,
      timestamp: new Date().toLocaleString('zh-CN'),
      curve: 'secp256k1',
      keyLength: 256
    }
    
    // 设置密钥对到注册表单组件
    if (registerFormRef.value) {
      registerFormRef.value.setKeyPair(formattedKeyPair)
      
      // 获取用户输入的密码和邮箱
      const formData = registerFormRef.value.getFormData()
      
      // 如果用户已输入密码和邮箱，则存储私钥
      if (formData.password && formData.email) {
        try {
          const storeResult = await AESCrypto.storePrivateKey(
            formattedKeyPair.privateKey,
            formData.password,
            formData.email
          )
          
          console.log('私钥存储成功:', {
            storageKey: storeResult.storageKey,
            timestamp: storeResult.timestamp
          })
        } catch (storeError) {
          console.error('私钥存储失败:', storeError)
          // 私钥存储失败不影响密钥对生成，只记录错误
        }
      }
    }
    
    console.log('ECC密钥对生成成功:', formattedKeyPair)
    
  } catch (error) {
    console.error('生成密钥对失败:', error)
    throw new Error('生成密钥对失败，请重试')
  }
}

/**
 * 处理登录链接点击
 */
const handleLoginClick = () => {
  console.log('导航到登录页面')
  // 跳转到登录页面
  router.push('/login')
}

/**
 * 处理复制到剪贴板
 * @param {String} value - 要复制的值
 * @param {String} type - 复制的类型
 */
const handleCopyToClipboard = async (value, type) => {
  try {
    await navigator.clipboard.writeText(value)
    console.log(`${type}已复制到剪贴板`)
    // 这里可以显示一个临时的成功提示
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    console.log(`${type}已复制到剪贴板（降级方案）`)
  }
}

/**
 * 处理导出密钥对
 * @param {Object} keyPair - 密钥对数据
 */
const handleExportKeyPair = (keyPair) => {
  if (!keyPair) return
  
  const keyData = {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    curve: keyPair.curve || 'secp256k1',
    timestamp: keyPair.timestamp,
    keyLength: keyPair.keyLength || 256,
    format: 'ECC-JSON-v1.0'
  }
  
  const dataStr = JSON.stringify(keyData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `ecc-keypair-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  console.log('密钥对已导出')
}

/**
 * 处理表单提交
 * @param {Object} data - 包含表单数据和密钥对的对象
 */
const handleSubmit = async (data) => {
  const { formData, keyPair } = data
  
  if (!keyPair) {
    console.error('密钥对不存在')
    return
  }

  isSubmitting.value = true

  try {
    // 准备要加密的数据
    const dataToEncrypt = {
      username: formData.email,
      password: formData.password,
      verificationCode: formData.verificationCode,
      confirmPassword: formData.confirmPassword,
      userPublicX: keyPair.publicKey.x,
      userPublicY: keyPair.publicKey.y,
    }
    console.log('发送到后端的明文数据:', dataToEncrypt)
    // 获取服务器公钥
    const serverPublicKey = await Server.getServerPublicKey()
    // 使用ECC加密数据
    const encryptionResult = await ECC.encrypt(JSON.stringify(dataToEncrypt), serverPublicKey)
    // 签名
    encryptionResult.signature = await ECC.sign(encryptionResult.ciphertext, keyPair.privateKey)

    console.log('发送到后端的加密数据:', encryptionResult)

    // 发送注册请求到后端
    const response = await userApi.register(encryptionResult)
    
    console.log('注册请求成功:', response)
    
    // 设置加密信息列表
    encryptionItems.value = [
      '用户数据已使用ECC椭圆曲线加密',
      `密文长度: ${encryptionResult.ciphertext.length} 字符`,
      '临时密钥对已生成',
      '用户公钥已保存到服务器'
    ]
    
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('注册失败:', error)
    
    // 处理不同类型的错误
    let errorMessage = '注册失败，请重试'
    
    if (error.success === false) {
      // 使用新的 userApi 错误格式
      switch (error.status) {
        case 409:
          errorMessage = '该邮箱已被注册，请使用其他邮箱'
          break
        case 422:
          errorMessage = '数据验证失败，请检查输入信息'
          break
        case 500:
          errorMessage = '服务器内部错误，请稍后重试'
          break
        default:
          errorMessage = error.error || '注册失败，请重试'
      }
    } else if (error.response) {
      // 兼容原有的 HttpClient 错误格式
      switch (error.response.status) {
        case 409:
          errorMessage = '该邮箱已被注册，请使用其他邮箱'
          break
        case 422:
          errorMessage = '数据验证失败，请检查输入信息'
          break
        case 500:
          errorMessage = '服务器内部错误，请稍后重试'
          break
        default:
          errorMessage = error.response.data?.message || '注册失败，请重试'
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
 * 处理成功模态框确认事件
 */
const handleSuccessModalConfirm = () => {
  showSuccessModal.value = false
  encryptionItems.value = []
  
  // 重置注册表单
  if (registerFormRef.value) {
    registerFormRef.value.resetForm()
  }
  
  // 跳转到登录页面
  console.log('注册成功，跳转到登录页面')
  router.push('/login')
}

/**
 * 生命周期钩子
 */

/**
 * 组件销毁前清理定时器
 */
onBeforeUnmount(() => {
  // 组件销毁时的清理工作
  console.log('RegisterPage组件即将销毁')
})
</script>

<style scoped>
/**
 * 注册页面PC端布局样式
 */
.register-page {
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

.form-info {
  text-align: center;
  padding: 30px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.form-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/**
 * 右侧表单区域
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

.form-wrapper {
  width: 100%;
  max-width: none;
  z-index: 10;
  position: relative;
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
 * 响应式设计
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
  .register-page {
    padding: 16px;
  }
  
  .pc-layout-container {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .register-page {
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
  .register-page {
    background: #0f1419;
  }
  
  .form-info {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }
  
  .brand-subtitle {
    color: rgba(255, 255, 255, 1);
  }
  
  .form-title {
    color: rgba(255, 255, 255, 1);
  }
  
  .form-description {
    color: rgba(255, 255, 255, 0.95);
  }
}
</style>