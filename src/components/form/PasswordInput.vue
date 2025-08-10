<template>
  <!-- 密码输入组件 -->
  <div class="form-group">
    <label :for="inputId" class="form-label">
      <!-- 锁图标 -->
      <svg class="label-icon" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
        <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ label }}
    </label>
    
    <!-- 密码输入框容器 -->
    <div class="password-input-group">
      <input
        :id="inputId"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'form-input',
          'password-input',
          { 'error': hasError }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- 密码可见性切换按钮 -->
      <button
        type="button"
        @click="togglePasswordVisibility"
        class="password-toggle"
        :aria-label="showPassword ? '隐藏密码' : '显示密码'"
      >
        <!-- 隐藏密码图标 -->
        <svg v-if="showPassword" viewBox="0 0 24 24" fill="none">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12A18.45 18.45 0 0 1 5.06 5.06L17.94 17.94Z" stroke="currentColor" stroke-width="2"/>
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4C17 4 21.27 7.61 23 12A18.5 18.5 0 0 1 18.94 18.94L9.9 4.24Z" stroke="currentColor" stroke-width="2"/>
          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
        </svg>
        <!-- 显示密码图标 -->
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    </div>
    
    <!-- 错误消息显示 -->
    <span v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </span>
    
    <!-- 密码强度指示器 -->
    <div v-if="showStrengthIndicator && modelValue" class="password-strength">
      <div class="strength-bar">
        <div 
          class="strength-fill" 
          :class="`strength-${passwordStrength.level}`"
          :style="{ width: `${passwordStrength.percentage}%` }"
        ></div>
      </div>
      <span class="strength-text" :class="`strength-${passwordStrength.level}`">
        {{ passwordStrength.text }}
      </span>
    </div>
  </div>
</template>

<script setup>
/**
 * 密码输入组件
 * 
 * @description 专用的密码输入组件，支持显示/隐藏密码、密码强度检测等功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, ref, computed } from 'vue'

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
    default: ''
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
   * 输入框ID
   * @type {String}
   */
  inputId: {
    type: String,
    default: () => `password-${Math.random().toString(36).substr(2, 9)}`
  },
  
  /**
   * 是否显示密码强度指示器
   * @type {Boolean}
   * @default false
   */
  showStrengthIndicator: {
    type: Boolean,
    default: false
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
  'focus'
])

/**
 * 响应式数据
 */

/**
 * 是否显示密码
 */
const showPassword = ref(false)

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
 * 密码强度计算
 */
const passwordStrength = computed(() => {
  const password = props.modelValue
  if (!password) {
    return { level: 'weak', percentage: 0, text: '' }
  }
  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  let score = 0
  let feedback = []
  
  // 检查是否包含非法字符
  if (!/^[a-zA-Z\d]*$/.test(password)) {
    feedback.push('只能包含字母和数字')
  }
  
  // 长度检查
  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push('至少8位字符')
  }
  
  // 小写字母检查
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    feedback.push('包含小写字母')
  }
  
  // 大写字母检查
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push('包含大写字母')
  }
  
  // 数字检查
  if (/\d/.test(password)) {
    score += 25
  } else {
    feedback.push('包含数字')
  }
  
  // 如果完全符合要求，给满分
  if (passwordRegex.test(password)) {
    score = 100
  }
  
  // 确定强度等级
  let level, text
  if (score < 50) {
    level = 'weak'
    text = '弱'
  } else if (score < 100) {
    level = 'medium'
    text = '中等'
  } else {
    level = 'strong'
    text = '强'
  }
  
  return {
    level,
    percentage: Math.min(score, 100),
    text: feedback.length > 0 ? `${text} (需要: ${feedback.join(', ')})` : text
  }
})

/**
 * 方法定义
 */

/**
 * 切换密码可见性
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

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
 * 密码输入组样式
 */
.password-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

/**
 * 密码输入框样式
 */
.password-input {
  flex: 1;
  padding-right: 50px;
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
  width: 100%;
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
 * 密码切换按钮样式
 */
.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #718096;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #4a5568;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
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
 * 密码强度指示器样式
 */
.password-strength {
  margin-top: 8px;
}

/**
 * 强度条容器
 */
.strength-bar {
  width: 100%;
  height: 4px;
  background-color: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

/**
 * 强度条填充
 */
.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

/**
 * 强度等级颜色
 */
.strength-weak {
  background-color: #e53e3e;
  color: #e53e3e;
}

.strength-medium {
  background-color: #ed8936;
  color: #ed8936;
}

.strength-strong {
  background-color: #48bb78;
  color: #48bb78;
}

/**
 * 强度文本样式
 */
.strength-text {
  font-size: 0.8rem;
  font-weight: 500;
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
  
  .password-toggle {
    color: #cbd5e0;
  }
  
  .password-toggle:hover {
    color: #e2e8f0;
  }
  
  .strength-bar {
    background-color: #4a5568;
  }
}
</style>