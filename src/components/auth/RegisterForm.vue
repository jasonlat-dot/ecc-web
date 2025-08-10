<template>
  <!-- 注册表单组件 -->
  <div class="form-container">
    <!-- 表单头部 -->
    <div class="form-header">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </div>

    <!-- 注册表单 -->
    <form @submit.prevent="handleSubmit" class="register-form">
      <!-- 邮箱输入 -->
      <FormInput
        v-model="formData.email"
        label="邮箱地址"
        type="email"
        placeholder="请输入您的邮箱地址"
        :error-message="errors.email"
        required
        input-id="email"
        @blur="validateEmail"
      >
        <template #icon>
          <svg class="label-icon" viewBox="0 0 24 24" fill="none">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </template>
      </FormInput>

      <!-- 验证码输入 -->
      <VerificationCodeInput
        v-model="formData.verificationCode"
        label="验证码"
        placeholder="请输入验证码"
        :error-message="errors.verificationCode"
        :hint-message="verificationHint"
        :can-send="!!formData.email && !errors.email"
        :cooldown-duration="60"
        required
        input-id="verificationCode"
        @send-code="handleSendVerificationCode"
        @blur="validateVerificationCode"
        ref="verificationCodeRef"
      />

      <!-- 密码输入 -->
      <PasswordInput
        v-model="formData.password"
        label="密码"
        placeholder="请输入密码（至少8位）"
        :error-message="errors.password"
        :show-strength-indicator="true"
        required
        input-id="password"
        @blur="validatePassword"
      />

      <!-- 确认密码输入 -->
      <PasswordInput
        v-model="formData.confirmPassword"
        label="确认密码"
        placeholder="请再次输入密码"
        :error-message="errors.confirmPassword"
        required
        input-id="confirmPassword"
        @blur="validateConfirmPassword"
      />

      <!-- ECC密钥生成组件 -->
      <ECCKeyGenerator
        v-model="keyPair"
        title="ECC密钥对生成"
        description="生成您的专属椭圆曲线加密密钥对"
        button-text="生成ECC密钥对"
        success-message="密钥对生成成功！"
        :show-metadata="true"
        @generated="handleGenerateKeyPair"
        @cleared="handleClearKeyPair"
        @exported="handleExportKeyPair"
        @copied="handleCopyToClipboard"
        ref="keyGeneratorRef"
      />

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="submit-btn"
        :disabled="!isFormValid || isSubmitting"
      >
        <!-- 加载图标 -->
        <svg v-if="isSubmitting" class="loading-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
        <!-- 提交图标 -->
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path d="M22 12H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M15 5L22 12L15 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {{ isSubmitting ? submitProcessingText : submitText }}
      </button>
    </form>

    <!-- 表单底部 -->
    <div class="form-footer">
      <p>{{ footerText }} <a href="#" class="login-link" @click="handleLoginClick">{{ loginLinkText }}</a></p>
    </div>
  </div>
</template>

<script setup>
/**
 * 注册表单组件
 * 
 * @description 完整的用户注册表单，包含邮箱验证、密码设置、ECC密钥生成等功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, ref, reactive, computed, watch, nextTick } from 'vue'

// 导入样式
import '../../styles/components/register-form.css'

// 导入子组件
import FormInput from '../form/FormInput.vue'
import PasswordInput from '../form/PasswordInput.vue'
import VerificationCodeInput from '../form/VerificationCodeInput.vue'
import ECCKeyGenerator from '../crypto/ECCKeyGenerator.vue'

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
    default: '创建账户'
  },
  
  /**
   * 表单描述
   * @type {String}
   */
  description: {
    type: String,
    default: '请填写以下信息完成注册'
  },
  
  /**
   * 提交按钮文本
   * @type {String}
   */
  submitText: {
    type: String,
    default: '创建账户'
  },
  
  /**
   * 提交处理中文本
   * @type {String}
   */
  submitProcessingText: {
    type: String,
    default: '正在注册...'
  },
  
  /**
   * 底部文本
   * @type {String}
   */
  footerText: {
    type: String,
    default: '已有账户？'
  },
  
  /**
   * 登录链接文本
   * @type {String}
   */
  loginLinkText: {
    type: String,
    default: '立即登录'
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
   * @param {Object} formData - 表单数据
   * @param {Object} keyPair - 密钥对数据
   */
  'submit',
  
  /**
   * 发送验证码事件
   * @param {String} email - 邮箱地址
   */
  'send-verification-code',
  
  /**
   * 生成密钥对事件
   */
  'generate-key-pair',
  
  /**
   * 登录链接点击事件
   */
  'login-click',
  
  /**
   * 复制到剪贴板事件
   * @param {String} value - 复制的值
   * @param {String} type - 复制的类型
   */
  'copy-to-clipboard',
  
  /**
   * 导出密钥对事件
   * @param {Object} keyPair - 密钥对数据
   */
  'export-key-pair'
])

/**
 * 响应式数据
 */

/**
 * 表单数据
 */
const formData = reactive({
  email: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

/**
 * 表单错误信息
 */
const errors = reactive({})

/**
 * 密钥对数据
 */
const keyPair = ref(null)

/**
 * 验证码提示信息
 */
const verificationHint = ref('')

/**
 * 组件引用
 */
const verificationCodeRef = ref(null)
const keyGeneratorRef = ref(null)

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
    delete errors.email
  }
}

/**
 * 验证密码强度
 */
const validatePassword = () => {
  const password = formData.password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  
  if (!password) {
    errors.password = '请输入密码'
  } else if (!passwordRegex.test(password)) {
    errors.password = '密码必须至少8位，包含大小写字母和数字，且只能包含字母和数字'
  } else {
    delete errors.password
  }
  
  // 如果确认密码已输入，重新验证确认密码
  if (formData.confirmPassword) {
    validateConfirmPassword()
  }
}

/**
 * 验证确认密码
 */
const validateConfirmPassword = () => {
  if (!formData.confirmPassword) {
    errors.confirmPassword = '请确认密码'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
  } else {
    delete errors.confirmPassword
  }
}

/**
 * 验证验证码
 */
const validateVerificationCode = () => {
  if (!formData.verificationCode) {
    errors.verificationCode = '请输入验证码'
  } else if (formData.verificationCode.length < 4) {
    errors.verificationCode = '验证码长度不正确'
  } else {
    delete errors.verificationCode
  }
}

/**
 * 计算属性
 */

/**
 * 检查表单是否有效
 */
const isFormValid = computed(() => {
  return (
    formData.email &&
    formData.verificationCode &&
    formData.password &&
    formData.confirmPassword &&
    keyPair.value &&
    Object.keys(errors).length === 0
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
watch(() => formData.confirmPassword, validateConfirmPassword)
watch(() => formData.verificationCode, validateVerificationCode)

/**
 * 事件处理方法
 */

/**
 * 处理发送验证码
 */
const handleSendVerificationCode = async () => {
  validateEmail()
  if (errors.email) {
    return
  }
  
  try {
    emit('send-verification-code', formData.email)
    verificationHint.value = '验证码已发送到您的邮箱，请查收'
    
    // 注意：不需要手动调用startCooldown()，因为VerificationCodeInput组件内部已经处理了倒计时
    // VerificationCodeInput组件在handleSendCode方法中会自动调用startCooldown()
  } catch (error) {
    console.error('发送验证码失败:', error)
    verificationHint.value = '验证码发送失败，请重试'
  }
}

/**
 * 处理生成密钥对
 */
const handleGenerateKeyPair = () => {
  emit('generate-key-pair')
}

/**
 * 处理清除密钥对
 */
const handleClearKeyPair = () => {
  keyPair.value = null
}

/**
 * 处理导出密钥对
 */
const handleExportKeyPair = (keyPairData) => {
  emit('export-key-pair', keyPairData)
}

/**
 * 处理复制到剪贴板
 */
const handleCopyToClipboard = (value, type) => {
  emit('copy-to-clipboard', value, type)
}

/**
 * 处理登录链接点击
 */
const handleLoginClick = (event) => {
  event.preventDefault()
  emit('login-click')
}

/**
 * 处理表单提交
 */
const handleSubmit = () => {
  // 验证所有字段
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateVerificationCode()

  if (!keyPair.value) {
    // 可以显示提示信息
    return
  }

  if (!isFormValid.value) {
    return
  }

  // 提交表单数据
  emit('submit', {
    formData: { ...formData },
    keyPair: keyPair.value
  })
}

/**
 * 重置表单
 */
const resetForm = () => {
  // 重置表单数据
  Object.assign(formData, {
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
  })
  
  // 清除错误信息
  Object.keys(errors).forEach(key => {
    delete errors[key]
  })
  
  // 清除密钥对
  keyPair.value = null
  
  // 清除验证码提示
  verificationHint.value = ''
  
  // 停止验证码倒计时
  if (verificationCodeRef.value) {
    verificationCodeRef.value.stopCooldown()
  }
}

/**
 * 设置密钥对（供父组件调用）
 * @param {Object} newKeyPair - 新的密钥对数据
 */
const setKeyPair = (newKeyPair) => {
  keyPair.value = newKeyPair
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
   * 设置密钥对
   */
  setKeyPair,
  
  /**
   * 验证表单
   */
  validateForm: () => {
    validateEmail()
    validatePassword()
    validateConfirmPassword()
    validateVerificationCode()
    return isFormValid.value
  },
  
  /**
   * 获取表单数据
   */
  getFormData: () => ({ ...formData }),
  
  /**
   * 获取密钥对
   */
  getKeyPair: () => keyPair.value
})
</script>