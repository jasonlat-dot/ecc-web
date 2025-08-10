<template>
  <div class="login-form-container">
    <!-- 表单头部 -->
    <div class="form-header">
      <h2 class="form-title">{{ title }}</h2>
      <p class="form-description">{{ description }}</p>
    </div>

    <!-- 登录表单 -->
    <form class="login-form" @submit.prevent="handleSubmit">
      <!-- 邮箱输入 -->
      <div class="form-section">
        <FormInput
          v-model="formData.email"
          label="邮箱地址"
          type="email"
          placeholder="请输入您的邮箱地址"
          :error-message="errors.email"
          required
        />
      </div>

      <!-- 密码输入 -->
      <div class="form-section">
        <PasswordInput
          v-model="formData.password"
          label="登录密码"
          placeholder="请输入您的登录密码"
          :error-message="errors.password"
          :show-strength="false"
          required
        />
      </div>

      <!-- 私钥输入 -->
      <div class="form-section">
        <PrivateKeyInput
          v-model="formData.privateKey"
          title="用户私钥"
          description="请输入您的私钥或上传注册时导出的密钥对文件"
          @validate="handlePrivateKeyValidate"
          @file-upload="handleFileUpload"
          ref="privateKeyRef"
        />
      </div>

      <!-- 登录选项 -->
      <div class="form-options">
        <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">
          忘记密码？
        </a>
      </div>

      <!-- 提交按钮 -->
      <button 
        type="submit" 
        class="submit-btn"
        :class="{ loading: isSubmitting }"
        :disabled="!isFormValid || isSubmitting"
      >
        <svg v-if="isSubmitting" class="loading-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
        </svg>
        <svg v-else class="login-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"/>
        </svg>
        {{ isSubmitting ? submitProcessingText : submitText }}
      </button>

      <!-- 表单底部 -->
      <div class="form-footer">
        <span class="footer-text">{{ footerText }}</span>
        <a href="#" class="register-link" @click.prevent="handleRegisterClick">
          {{ registerLinkText }}
        </a>
      </div>
    </form>

    <!-- 加密进度提示 -->
    <div v-if="encryptionProgress.show" class="encryption-progress">
      <div class="progress-content">
        <div class="progress-icon">
          <svg class="spinning" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
          </svg>
        </div>
        <div class="progress-text">
          <h4>{{ encryptionProgress.title }}</h4>
          <p>{{ encryptionProgress.message }}</p>
        </div>
      </div>
      <div class="progress-steps">
        <div 
          v-for="(step, index) in encryptionProgress.steps" 
          :key="index"
          class="progress-step"
          :class="{ 
            active: index === encryptionProgress.currentStep,
            completed: index < encryptionProgress.currentStep 
          }"
        >
          <div class="step-indicator">
            <svg v-if="index < encryptionProgress.currentStep" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
            </svg>
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-text">{{ step }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录表单组件
 * 
 * @description 完整的用户登录表单，支持邮箱、密码和私钥输入，包含数据加密和签名功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { ref, reactive, computed, watch } from 'vue'

// 导入样式
import '../../styles/components/login-form.css'

// 导入工具类
import ECCCrypto from '../../utils/ecc.js'

import { AESCrypto } from '@/utils/aes'

// 创建ECC实例
const ECC = new ECCCrypto()

// 创建server实例
const Server = new serverService()

// 导入组件
import FormInput from '../form/FormInput.vue'
import PasswordInput from '../form/PasswordInput.vue'
import PrivateKeyInput from '../crypto/PrivateKeyInput.vue'
import {serverService} from "@/api/server";

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 表单标题
   * @type {String}
   */
  title: {
    type: String,
    default: '用户登录'
  },
  
  /**
   * 表单描述
   * @type {String}
   */
  description: {
    type: String,
    default: '请输入您的登录信息'
  },
  
  /**
   * 提交按钮文本
   * @type {String}
   */
  submitText: {
    type: String,
    default: '立即登录'
  },
  
  /**
   * 提交处理中文本
   * @type {String}
   */
  submitProcessingText: {
    type: String,
    default: '正在登录...'
  },
  
  /**
   * 底部文本
   * @type {String}
   */
  footerText: {
    type: String,
    default: '还没有账户？'
  },
  
  /**
   * 注册链接文本
   * @type {String}
   */
  registerLinkText: {
    type: String,
    default: '立即注册'
  },
  
  /**
   * 是否正在提交
   * @type {Boolean}
   */
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits([
  /**
   * 表单提交事件
   * @param {Object} loginData - 登录数据（包含加密数据、签名、临时公钥）
   */
  'submit',
  
  /**
   * 注册点击事件
   */
  'register-click',
  
  /**
   * 忘记密码点击事件
   */
  'forgot-password',
  
  /**
   * 文件上传事件
   * @param {File} file - 上传的文件
   * @param {Object} keyData - 解析的密钥数据
   */
  'file-upload'
])

/**
 * 响应式数据
 */

/**
 * 表单数据
 */
const formData = reactive({
  email: '',
  password: '',
  privateKey: ''
})

/**
 * 错误信息
 */
const errors = reactive({
  email: '',
  password: '',
  privateKey: ''
})

/**
 * 私钥验证状态
 */
const privateKeyValid = ref(false)

/**
 * 私钥信息
 */
const privateKeyInfo = ref(null)

/**
 * 加密进度状态
 */
const encryptionProgress = reactive({
  show: false,
  title: '正在处理登录请求',
  message: '请稍候，正在加密和签名您的登录数据...',
  currentStep: 0,
  steps: [
    '验证登录信息',
    '构建登录数据',
    '发送到服务器'
  ]
})

/**
 * 组件引用
 */
const privateKeyRef = ref(null)

/**
 * 验证方法
 */

/**
 * 验证邮箱格式
 */
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = '请输入邮箱地址'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = '请输入有效的邮箱地址'
  } else {
    errors.email = ''
  }
}

/**
 * 验证密码
 */
const validatePassword = () => {
  const password = formData.password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  
  if (!password) {
    errors.password = '请输入密码'
  } else if (!passwordRegex.test(password)) {
    errors.password = '密码必须至少8位，包含大小写字母和数字，且只能包含字母和数字'
  } else {
    errors.password = ''
  }
}

/**
 * 验证私钥
 */
const validatePrivateKey = () => {
  console.log(privateKeyValid.value)
  console.log(formData.privateKey)
  if (!formData.privateKey) {
    errors.privateKey = '请输入私钥或上传密钥对文件'
    privateKeyValid.value = false
  } else if (!privateKeyValid.value) {
    errors.privateKey = '私钥格式不正确'
  } else {
    errors.privateKey = ''
  }
  console.log(privateKeyValid.value)
}

/**
 * 计算属性
 */

/**
 * 检查表单是否有效
 */
const isFormValid = computed(() => {
  console.log(privateKeyValid.value)
  return (
    formData.email &&
    formData.password &&
    formData.privateKey &&
    privateKeyValid.value &&
    !errors.email &&
    !errors.password &&
    !errors.privateKey
  )
})

/**
 * 监听器
 */

/**
 * 监听表单字段变化，实时验证
 */
watch(() => formData.email, validateEmail)
watch(() => formData.password, validatePassword)
watch(() => formData.privateKey, validatePrivateKey)

/**
 * 事件处理方法
 */

/**
 * 处理私钥验证
 * @param {Boolean} isValid - 是否有效
 * @param {Object} keyInfo - 私钥信息
 */
const handlePrivateKeyValidate = (isValid, keyInfo) => {
  console.log("oikujioi--", isValid)
  privateKeyValid.value = isValid
  privateKeyInfo.value = keyInfo
  console.log(privateKeyInfo.value)
  validatePrivateKey()
}
/**
 * 处理文件上传
 * @param {File} file - 上传的文件
 * @param {Object} keyData - 解析的密钥数据
 */
const handleFileUpload = (file, keyData) => {
  // 更新
  formData.privateKey = keyData.privateKey
  console.log("123456", keyData)

  console.log('密钥对文件上传成功:', {
    fileName: file.name,
    keyData: keyData
  })
  emit('file-upload', file, keyData)
}

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  // 验证所有字段
  validateEmail()
  validatePassword()
  validatePrivateKey()
  
  if (!isFormValid.value) {
    console.warn('表单验证失败')
    return
  }
  
  try {
    // 显示加密进度
    showEncryptionProgress()

    // 步骤1: 验证登录信息
    updateEncryptionStep(0, '验证登录信息...')
    await delay(500)
    

    // 步骤2: 加密登录数据
    updateEncryptionStep(1, '构建登录数据...')
    const loginData = {
      username: formData.email,
      password: formData.password,
      timestamp: new Date().toISOString(),
    }
    console.log("登录信息明文：", loginData)

    // 步骤3: 存储私钥到本地
    try {
      console.log('开始存储私钥到本地...')
      const storeResult = await AESCrypto.storePrivateKey(
          formData.privateKey,
          formData.password,
          formData.email
      )

      console.log('私钥存储成功:', {
        storageKey: storeResult.storageKey,
        timestamp: storeResult.timestamp
      })


    } catch (error) {
      console.error('私钥存储失败:', error)
    }

     // 步骤4: 准备发送数据
     updateEncryptionStep(3, '准备发送到服务器...')
     await delay(500)
     
     // 隐藏加密进度
     hideEncryptionProgress()
     
     // 发送登录请求
     emit('submit', loginData)

  } catch (error) {
    hideEncryptionProgress()
    console.error('登录处理失败:', error)
    
    // 设置错误信息
    if (error.message.includes('私钥')) {
      errors.privateKey = '私钥验证失败，请检查私钥是否正确'
    } else if (error.message.includes('加密')) {
      errors.password = '数据加密失败，请重试'
    } else {
      errors.email = '登录处理失败，请重试'
    }
  }
}

/**
 * 处理注册点击
 */
const handleRegisterClick = () => {
  emit('register-click')
}

/**
 * 处理忘记密码点击
 */
const handleForgotPassword = () => {
  emit('forgot-password')
}

/**
 * 重置表单
 */
const resetForm = () => {
  formData.email = ''
  formData.password = ''
  formData.privateKey  = ''
  formData.rememberMe = false
  
  errors.email = ''
  errors.password = ''
  errors.privateKey = ''
  
  privateKeyValid.value = false
  privateKeyInfo.value = null
  
  if (privateKeyRef.value) {
    privateKeyRef.value.clear()
  }
}

/**
 * 工具方法
 */

/**
 * 显示加密进度
 */
const showEncryptionProgress = () => {
  encryptionProgress.show = true
  encryptionProgress.currentStep = 0
}

/**
 * 隐藏加密进度
 */
const hideEncryptionProgress = () => {
  encryptionProgress.show = false
  encryptionProgress.currentStep = 0
}

/**
 * 更新加密步骤
 * @param {Number} step - 步骤索引
 * @param {String} message - 步骤消息
 */
const updateEncryptionStep = (step, message) => {
  encryptionProgress.currentStep = step
  encryptionProgress.message = message
}

/**
 * 延迟函数
 * @param {Number} ms - 延迟毫秒数
 */
const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 重置表单
   */
  resetForm,
  
  /**
   * 验证表单
   */
  validateForm: () => {
    validateEmail()
    validatePassword()
    validatePrivateKey()
    return isFormValid.value
  },
  
  /**
   * 获取表单数据
   */
  getFormData: () => ({ ...formData }),
  
  /**
   * 设置表单数据
   */
  setFormData: (data) => {
    Object.assign(formData, data)
  }
})
</script>