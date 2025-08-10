<template>
  <!-- 验证码输入组件 -->
  <div class="form-group">
    <label :for="inputId" class="form-label">
      <!-- 验证码图标 -->
      <svg class="label-icon" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ label }}
    </label>
    
    <!-- 验证码输入组 -->
    <div class="verification-input-group">
      <input
        :id="inputId"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'form-input',
          'verification-input',
          { 'error': hasError }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- 发送验证码按钮 -->
      <button
        type="button"
        @click="handleSendCode"
        class="verification-btn"
        :disabled="isSending || cooldownTime > 0 || !canSend"
      >
        <span v-if="isSending" class="loading-text">
          <svg class="loading-icon" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
          发送中...
        </span>
        <span v-else-if="cooldownTime > 0">
          {{ cooldownTime }}s
        </span>
        <span v-else>
          {{ buttonText }}
        </span>
      </button>
    </div>
    
    <!-- 错误消息显示 -->
    <span v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </span>
    
    <!-- 提示信息 -->
    <span v-if="hintMessage" class="hint-message">
      {{ hintMessage }}
    </span>
  </div>
</template>

<script setup>
/**
 * 验证码输入组件
 * 
 * @description 专用的验证码输入组件，包含输入框和发送验证码按钮，支持倒计时功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, ref, computed, onUnmounted } from 'vue'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 输入框的值（v-model）
   * @type {String}
   */
  modelValue: {
    type: String,
    default: ''
  },
  
  /**
   * 输入框标签
   * @type {String}
   * @required
   */
  label: {
    type: String,
    required: true
  },
  
  /**
   * 占位符文本
   * @type {String}
   */
  placeholder: {
    type: String,
    default: '请输入验证码'
  },
  
  /**
   * 是否必填
   * @type {Boolean}
   * @default false
   */
  required: {
    type: Boolean,
    default: false
  },
  
  /**
   * 是否禁用
   * @type {Boolean}
   * @default false
   */
  disabled: {
    type: Boolean,
    default: false
  },
  
  /**
   * 错误消息
   * @type {String}
   */
  errorMessage: {
    type: String,
    default: ''
  },
  
  /**
   * 提示消息
   * @type {String}
   */
  hintMessage: {
    type: String,
    default: ''
  },
  
  /**
   * 输入框ID
   * @type {String}
   */
  inputId: {
    type: String,
    default: () => `verification-${Math.random().toString(36).substr(2, 9)}`
  },
  
  /**
   * 发送按钮文本
   * @type {String}
   */
  buttonText: {
    type: String,
    default: '发送验证码'
  },
  
  /**
   * 倒计时时间（秒）
   * @type {Number}
   * @default 60
   */
  cooldownDuration: {
    type: Number,
    default: 60
  },
  
  /**
   * 是否可以发送验证码（外部控制）
   * @type {Boolean}
   * @default true
   */
  canSend: {
    type: Boolean,
    default: true
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits([
  /**
   * 值更新事件（v-model）
   * @param {String} value - 新的输入值
   */
  'update:modelValue',
  
  /**
   * 输入事件
   * @param {Event} event - 输入事件对象
   */
  'input',
  
  /**
   * 失焦事件
   * @param {Event} event - 失焦事件对象
   */
  'blur',
  
  /**
   * 聚焦事件
   * @param {Event} event - 聚焦事件对象
   */
  'focus',
  
  /**
   * 发送验证码事件
   */
  'send-code'
])

/**
 * 响应式数据
 */

/**
 * 是否正在发送
 */
const isSending = ref(false)

/**
 * 倒计时时间
 */
const cooldownTime = ref(0)

/**
 * 倒计时定时器
 */
const cooldownTimer = ref(null)

/**
 * 计算属性
 */

/**
 * 是否有错误
 */
const hasError = computed(() => {
  return !!props.errorMessage
})

/**
 * 方法定义
 */

/**
 * 处理输入事件
 * @param {Event} event - 输入事件对象
 */
const handleInput = (event) => {
  let value = event.target.value
  // 过滤空格字符
  value = value.replace(/\s/g, '')
  // 更新输入框的值
  event.target.value = value
  emit('update:modelValue', value)
  emit('input', event)
}

/**
 * 处理失焦事件
 * @param {Event} event - 失焦事件对象
 */
const handleBlur = (event) => {
  emit('blur', event)
}

/**
 * 处理聚焦事件
 * @param {Event} event - 聚焦事件对象
 */
const handleFocus = (event) => {
  emit('focus', event)
}

/**
 * 处理发送验证码
 */
const handleSendCode = async () => {
  if (isSending.value || cooldownTime.value > 0 || !props.canSend) {
    return
  }
  
  isSending.value = true
  
  try {
    // 触发发送验证码事件
    await emit('send-code')
    
    // 开始倒计时
    startCooldown()
  } catch (error) {
    console.error('发送验证码失败:', error)
  } finally {
    isSending.value = false
  }
}

/**
 * 开始倒计时
 */
const startCooldown = () => {
  // 如果已经有定时器在运行，先清除它
  if (cooldownTimer.value) {
    clearInterval(cooldownTimer.value)
    cooldownTimer.value = null
  }
  
  cooldownTime.value = props.cooldownDuration
  
  cooldownTimer.value = setInterval(() => {
    cooldownTime.value--
    
    if (cooldownTime.value <= 0) {
      clearInterval(cooldownTimer.value)
      cooldownTimer.value = null
    }
  }, 1000)
}

/**
 * 停止倒计时
 */
const stopCooldown = () => {
  if (cooldownTimer.value) {
    clearInterval(cooldownTimer.value)
    cooldownTimer.value = null
    cooldownTime.value = 0
  }
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 开始倒计时
   */
  startCooldown,
  
  /**
   * 停止倒计时
   */
  stopCooldown
})

/**
 * 组件卸载时清理定时器
 */
onUnmounted(() => {
  stopCooldown()
})
</script>

<style scoped>
/**
 * 表单组样式
 */
.form-group {
  display: flex;
  flex-direction: column;
}

/**
 * 表单标签样式
 */
.form-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

/**
 * 标签图标样式
 */
.label-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  color: #667eea;
}

/**
 * 验证码输入组样式
 */
.verification-input-group {
  display: flex;
  gap: 12px;
}

/**
 * 验证码输入框样式
 */
.verification-input {
  flex: 1;
}

/**
 * 表单输入框基础样式
 */
.form-input {
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #ffffff;
}

/**
 * 输入框聚焦状态
 */
.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/**
 * 输入框错误状态
 */
.form-input.error {
  border-color: #e53e3e;
  box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
}

/**
 * 输入框禁用状态
 */
.form-input:disabled {
  background-color: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

/**
 * 占位符样式
 */
.form-input::placeholder {
  color: #a0aec0;
}

/**
 * 验证码按钮样式
 */
.verification-btn {
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

/**
 * 按钮悬停效果
 */
.verification-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/**
 * 按钮禁用状态
 */
.verification-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/**
 * 加载文本样式
 */
.loading-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

/**
 * 加载图标样式
 */
.loading-icon {
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

/**
 * 旋转动画
 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/**
 * 错误消息样式
 */
.error-message {
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
}

/**
 * 提示消息样式
 */
.hint-message {
  color: #718096;
  font-size: 0.85rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
}

/**
 * 响应式设计
 */
@media (max-width: 768px) {
  .verification-input-group {
    flex-direction: column;
  }
  
  .verification-btn {
    min-width: auto;
  }
}

/**
 * 深色模式支持
 */
@media (prefers-color-scheme: dark) {
  .form-label {
    color: #cbd5e0;
  }
  
  .form-input {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }
  
  .form-input:disabled {
    background-color: #1a202c;
    color: #718096;
  }
  
  .form-input::placeholder {
    color: #718096;
  }
  
  .hint-message {
    color: #a0aec0;
  }
}
</style>