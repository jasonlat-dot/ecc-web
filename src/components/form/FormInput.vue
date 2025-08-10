<template>
  <!-- 通用表单输入组件 -->
  <div class="form-group">
    <label :for="inputId" class="form-label">
      <!-- 图标插槽 -->
      <slot name="icon">
        <svg class="label-icon" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
          <circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
      </slot>
      {{ label }}
    </label>
    
    <!-- 输入框容器 -->
    <div class="input-container" :class="{ 'has-action': hasAction }">
      <input
        :id="inputId"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :class="[
          'form-input',
          {
            'error': hasError,
            'with-action': hasAction
          }
        ]"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
      
      <!-- 操作按钮插槽 -->
      <slot name="action"></slot>
    </div>
    
    <!-- 错误消息显示 -->
    <span v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </span>
  </div>
</template>

<script setup>
/**
 * 通用表单输入组件
 * 
 * @description 可复用的表单输入组件，支持图标、验证、操作按钮等功能
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, computed, useSlots } from 'vue'

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
   * 输入框类型
   * @type {String}
   * @default 'text'
   */
  type: {
    type: String,
    default: 'text'
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
    default: () => `input-${Math.random().toString(36).substr(2, 9)}`
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
 * 获取插槽
 */
const slots = useSlots()

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
 * 是否有操作按钮
 */
const hasAction = computed(() => {
  return !!slots.action
})

/**
 * 输入框类型（支持动态切换）
 */
const inputType = computed(() => {
  return props.type
})

/**
 * 事件处理方法
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
  width: 14px;
  height: 14px;
  margin-right: 8px;
  color: #667eea;
  flex-shrink: 0;
}

/**
 * 输入框容器样式
 */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

/**
 * 表单输入框样式
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
 * 有操作按钮时的输入框样式
 */
.form-input.with-action {
  padding-right: 50px;
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
 * 移动端图标优化
 */
@media (max-width: 768px) {
  .label-icon {
    width: 12px;
    height: 12px;
    margin-right: 6px;
  }
}

@media (max-width: 480px) {
  .label-icon {
    width: 10px;
    height: 10px;
    margin-right: 4px;
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
}
</style>