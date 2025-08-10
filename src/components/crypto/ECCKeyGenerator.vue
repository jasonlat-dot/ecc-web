<template>
  <!-- ECC密钥生成组件 -->
  <div class="key-generation-section">
    <!-- 密钥生成区域头部 -->
    <div class="key-section-header">
      <h3>
        <svg class="section-icon" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 1V3" stroke="currentColor" stroke-width="2"/>
          <path d="M12 21V23" stroke="currentColor" stroke-width="2"/>
          <path d="M4.22 4.22L5.64 5.64" stroke="currentColor" stroke-width="2"/>
          <path d="M18.36 18.36L19.78 19.78" stroke="currentColor" stroke-width="2"/>
          <path d="M1 12H3" stroke="currentColor" stroke-width="2"/>
          <path d="M21 12H23" stroke="currentColor" stroke-width="2"/>
          <path d="M4.22 19.78L5.64 18.36" stroke="currentColor" stroke-width="2"/>
          <path d="M18.36 5.64L19.78 4.22" stroke="currentColor" stroke-width="2"/>
        </svg>
        {{ title }}
      </h3>
      <p>{{ description }}</p>
    </div>
    
    <!-- 生成密钥按钮 -->
    <button
      type="button"
      @click="handleGenerateKeyPair"
      class="generate-key-btn"
      :disabled="isGenerating"
    >
      <!-- 加载图标 -->
      <svg v-if="isGenerating" class="loading-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
      <!-- 密钥图标 -->
      <svg v-else viewBox="0 0 24 24" fill="none">
        <path d="M12 1L3 5L12 9L21 5L12 1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M3 17L12 21L21 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M3 12L12 16L21 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
      </svg>
      {{ isGenerating ? '正在生成密钥对...' : buttonText }}
    </button>

    <!-- 密钥对显示区域 -->
    <div v-if="keyPair" class="key-display-area">
      <!-- 成功状态 -->
      <div class="key-status">
        <svg class="success-icon" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12A10 10 0 1 1 5.93 7.69" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
      
      <!-- 密钥信息 -->
      <div class="key-info">
        <!-- 公钥X坐标 -->
        <div class="key-item">
          <label>公钥 X 坐标:</label>
          <div class="key-value" @click="copyToClipboard(keyPair.publicKey.x, '公钥X坐标')">
            {{ formatKeyValue(keyPair.publicKey.x) }}
            <button type="button" class="copy-btn" title="复制">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 公钥Y坐标 -->
        <div class="key-item">
          <label>公钥 Y 坐标:</label>
          <div class="key-value" @click="copyToClipboard(keyPair.publicKey.y, '公钥Y坐标')">
            {{ formatKeyValue(keyPair.publicKey.y) }}
            <button type="button" class="copy-btn" title="复制">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 私钥 -->
        <div class="key-item private-key">
          <label>私钥 (请妥善保管):</label>
          <div class="key-value private" @click="copyToClipboard(keyPair.privateKey, '私钥')">
            {{ showPrivateKey ? keyPair.privateKey : '●'.repeat(64) }}
            <button type="button" class="copy-btn" title="复制" v-if="showPrivateKey">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <button 
            type="button" 
            @click="togglePrivateKeyVisibility" 
            class="toggle-private-key"
            :title="showPrivateKey ? '隐藏私钥' : '显示私钥'"
          >
            {{ showPrivateKey ? '隐藏' : '显示' }}
          </button>
        </div>
        
        <!-- 密钥元数据 -->
        <div v-if="showMetadata" class="key-metadata">
          <div class="metadata-item">
            <label>椭圆曲线:</label>
            <span>{{ keyPair.curve || 'secp256k1' }}</span>
          </div>
          <div class="metadata-item">
            <label>生成时间:</label>
            <span>{{ formatTimestamp(keyPair.timestamp) }}</span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="key-actions">
        <button 
          type="button" 
          @click="exportKeyPair" 
          class="action-btn export-btn"
          title="导出密钥对"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          导出
        </button>
        
        <button 
          type="button" 
          @click="clearKeyPair" 
          class="action-btn clear-btn"
          title="清除密钥对"
        >
          <svg viewBox="0 0 24 24" fill="none">
            <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6M8 6V4A2 2 0 0 1 10 2H14A2 2 0 0 1 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          清除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * ECC密钥对生成组件
 * 
 * @description 用于生成和显示ECC椭圆曲线密钥对的组件
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, ref, computed, watch } from 'vue'

// 导入样式
import '../../styles/components/ecc-key-generator.css'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 密钥对数据（v-model）
   * @type {Object|null}
   */
  modelValue: {
    type: Object,
    default: null
  },
  
  /**
   * 组件标题
   * @type {String}
   */
  title: {
    type: String,
    default: 'ECC密钥对生成'
  },
  
  /**
   * 组件描述
   * @type {String}
   */
  description: {
    type: String,
    default: '生成您的专属椭圆曲线加密密钥对'
  },
  
  /**
   * 生成按钮文本
   * @type {String}
   */
  buttonText: {
    type: String,
    default: '生成ECC密钥对'
  },
  
  /**
   * 成功消息
   * @type {String}
   */
  successMessage: {
    type: String,
    default: '密钥对生成成功！'
  },
  
  /**
   * 是否显示元数据
   * @type {Boolean}
   */
  showMetadata: {
    type: Boolean,
    default: true
  },
  
  /**
   * 是否禁用组件
   * @type {Boolean}
   */
  disabled: {
    type: Boolean,
    default: false
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits([
  /**
   * 密钥对更新事件（v-model）
   * @param {Object|null} keyPair - 密钥对数据
   */
  'update:modelValue',
  
  /**
   * 密钥对生成事件
   * @param {Object} keyPair - 生成的密钥对
   */
  'generated',
  
  /**
   * 密钥对清除事件
   */
  'cleared',
  
  /**
   * 密钥对导出事件
   * @param {Object} keyPair - 要导出的密钥对
   */
  'exported',
  
  /**
   * 复制事件
   * @param {String} value - 复制的值
   * @param {String} type - 复制的类型
   */
  'copied'
])

/**
 * 响应式数据
 */

/**
 * 是否正在生成密钥
 */
const isGenerating = ref(false)

/**
 * 是否显示私钥
 */
const showPrivateKey = ref(false)

/**
 * 计算属性
 */

/**
 * 密钥对数据
 */
const keyPair = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

/**
 * 方法定义
 */

/**
 * 处理生成密钥对
 */
const handleGenerateKeyPair = async () => {
  if (isGenerating.value || props.disabled) {
    return
  }
  
  isGenerating.value = true
  showPrivateKey.value = false
  
  try {
    // 触发生成事件，让父组件处理实际的密钥生成逻辑
    emit('generated')
  } catch (error) {
    console.error('密钥对生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}

/**
 * 切换私钥可见性
 */
const togglePrivateKeyVisibility = () => {
  showPrivateKey.value = !showPrivateKey.value
}

/**
 * 格式化密钥值显示
 * @param {String} value - 密钥值
 * @returns {String} 格式化后的显示值
 */
const formatKeyValue = (value) => {
  if (!value || value.length < 32) {
    return value
  }
  return `${value.substring(0, 16)}...${value.substring(value.length - 16)}`
}

/**
 * 格式化时间戳
 * @param {String} timestamp - ISO时间戳
 * @returns {String} 格式化后的时间
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  } catch (error) {
    return timestamp
  }
}

/**
 * 复制到剪贴板
 * @param {String} value - 要复制的值
 * @param {String} type - 复制的类型
 */
const copyToClipboard = async (value, type) => {
  try {
    await navigator.clipboard.writeText(value)
    emit('copied', value, type)
  } catch (error) {
    console.error('复制失败:', error)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    emit('copied', value, type)
  }
}

/**
 * 导出密钥对
 */
const exportKeyPair = () => {
  if (!keyPair.value) return
  
  emit('exported', keyPair.value)
}

/**
 * 清除密钥对
 */
const clearKeyPair = () => {
  keyPair.value = null
  showPrivateKey.value = false
  emit('cleared')
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 生成密钥对
   */
  generateKeyPair: handleGenerateKeyPair,
  
  /**
   * 清除密钥对
   */
  clearKeyPair,
  
  /**
   * 切换私钥可见性
   */
  togglePrivateKeyVisibility
})
</script>