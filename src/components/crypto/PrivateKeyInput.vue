<template>
  <div class="private-key-input">
    <!-- 私钥输入头部 -->
    <div class="input-header">
      <h4 class="input-title">
        <svg class="key-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 14c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM20.71 4.63l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9.12 12.13c-.18.18-.29.43-.29.71v1.59c0 .55.45 1 1 1h1.59c.28 0 .53-.11.71-.29l8.84-8.84c.39-.39.39-1.02 0-1.41z"/>
        </svg>
        {{ title }}
      </h4>
      <p class="input-description">{{ description }}</p>
    </div>

    <!-- 输入方式选择 -->
    <div class="input-method-tabs">
      <button 
        type="button"
        class="tab-button"
        :class="{ active: inputMethod === 'manual' }"
        @click="setInputMethod('manual')"
      >
        <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
        手动输入
      </button>
      <button 
        type="button"
        class="tab-button"
        :class="{ active: inputMethod === 'file' }"
        @click="setInputMethod('file')"
      >
        <svg class="tab-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
        上传文件
      </button>
    </div>

    <!-- 手动输入区域 -->
    <div v-if="inputMethod === 'manual'" class="manual-input-area">
      <div class="input-group">
        <label class="input-label">私钥 (Hex格式)</label>
        <div class="textarea-container">
          <textarea
            v-model="manualPrivateKey"
            class="private-key-textarea"
            :class="{ error: errors.privateKey }"
            placeholder="请输入64位十六进制私钥，例如：a1b2c3d4e5f6..."
            rows="3"
            @input="handleManualInput"
            @blur="validatePrivateKey"
          ></textarea>
          <div class="textarea-actions">
            <button 
              type="button" 
              class="action-btn clear-btn"
              @click="clearManualInput"
              v-if="manualPrivateKey"
              title="清除输入"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
              </svg>
            </button>
            <button 
              type="button" 
              class="action-btn paste-btn"
              @click="pasteFromClipboard"
              title="从剪贴板粘贴"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"/>
              </svg>
            </button>
          </div>
        </div>
        <div v-if="errors.privateKey" class="error-message">
          {{ errors.privateKey }}
        </div>
      </div>
    </div>

    <!-- 文件上传区域 -->
    <div v-if="inputMethod === 'file'" class="file-upload-area">
      <div class="upload-zone" :class="{ dragover: isDragOver, error: errors.file }">
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          class="file-input"
          @change="handleFileSelect"
        >
        <div 
          class="upload-content"
          @click="triggerFileSelect"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleFileDrop"
        >
          <svg class="upload-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <h4 class="upload-title">选择或拖拽JSON文件</h4>
          <p class="upload-description">支持从注册页导出的密钥对文件</p>
          <button type="button" class="upload-btn">选择文件</button>
        </div>
      </div>
      
      <!-- 文件信息显示 -->
      <div v-if="uploadedFile" class="file-info">
        <div class="file-details">
          <svg class="file-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          <div class="file-meta">
            <span class="file-name">{{ uploadedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(uploadedFile.size) }}</span>
          </div>
          <button 
            type="button" 
            class="remove-file-btn"
            @click="removeFile"
            title="移除文件"
          >
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div v-if="errors.file" class="error-message">
        {{ errors.file }}
      </div>
    </div>

    <!-- 私钥信息显示 -->
    <div v-if="privateKeyInfo" class="private-key-info">
      <div class="info-header">
        <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
        </svg>
        <h4>私钥信息</h4>
      </div>
      <div class="info-content">
        <div class="info-item">
          <label>私钥长度:</label>
          <span>{{ privateKeyInfo.length }} 位</span>
        </div>
        <div class="info-item" v-if="privateKeyInfo.timestamp">
          <label>生成时间:</label>
          <span>{{ privateKeyInfo.timestamp }}</span>
        </div>
        <div class="info-item" v-if="privateKeyInfo.curve">
          <label>椭圆曲线:</label>
          <span>{{ privateKeyInfo.curve }}</span>
        </div>
        <div class="info-item">
          <label>状态:</label>
          <span class="status-valid">✓ 有效</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 私钥输入组件
 * 
 * @description 支持手动输入和文件上传两种方式输入私钥的Vue 3组件
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { ref, reactive, computed, watch } from 'vue'

// 导入样式
import '../../styles/components/private-key-input.css'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 组件标题
   * @type {String}
   */
  title: {
    type: String,
    default: '用户私钥'
  },
  
  /**
   * 组件描述
   * @type {String}
   */
  description: {
    type: String,
    default: '请输入您的私钥或上传密钥对文件'
  },
  
  /**
   * 初始私钥值
   * @type {String}
   */
  modelValue: {
    type: String,
    default: ''
  },
  
  /**
   * 是否禁用
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
   * 私钥值更新事件
   * @param {String} value - 私钥值
   */
  'update:modelValue',
  
  /**
   * 私钥验证事件
   * @param {Boolean} isValid - 是否有效
   * @param {Object} keyInfo - 私钥信息
   */
  'validate',
  
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
 * 输入方式 ('manual' | 'file')
 */
const inputMethod = ref('manual')

/**
 * 手动输入的私钥
 */
const manualPrivateKey = ref('')

/**
 * 上传的文件
 */
const uploadedFile = ref(null)

/**
 * 拖拽状态
 */
const isDragOver = ref(false)

/**
 * 文件输入引用
 */
const fileInput = ref(null)

/**
 * 错误信息
 */
const errors = reactive({
  privateKey: '',
  file: ''
})

/**
 * 计算属性
 */

/**
 * 私钥信息
 */
const privateKeyInfo = computed(() => {
  const currentKey = inputMethod.value === 'manual' ? manualPrivateKey.value : props.modelValue
  console.log(inputMethod.value)
  console.log(props.modelValue)
  if (!currentKey || errors.privateKey) {
    return null
  }
  return {
    currentKey: currentKey,
    length: currentKey.length * 4, // hex to bits
    curve: 'secp256k1',
    timestamp: new Date().toLocaleString('zh-CN')
  }
})

/**
 * 监听器
 */

/**
 * 监听手动输入的私钥变化
 */
watch(manualPrivateKey, (newValue) => {
  if (inputMethod.value === 'manual') {
    emit('update:modelValue', newValue)
  }
})

/**
 * 监听外部传入的值变化
 */
watch(() => props.modelValue, (newValue) => {
  if (inputMethod.value === 'manual') {
    manualPrivateKey.value = newValue
  }
})

/**
 * 方法定义
 */

/**
 * 设置输入方式
 * @param {String} method - 输入方式
 */
const setInputMethod = (method) => {
  inputMethod.value = method
  clearErrors()
  
  if (method === 'manual') {
    emit('update:modelValue', manualPrivateKey.value)
  }
}

/**
 * 处理手动输入
 */
const handleManualInput = () => {
  clearErrors()
  // 移除非十六进制字符
  manualPrivateKey.value = manualPrivateKey.value.replace(/[^0-9a-fA-F]/g, '')
}

/**
 * 验证私钥格式
 */
const validatePrivateKey = () => {
  const key = manualPrivateKey.value.trim()
  console.log(key)
  if (!key) {
    errors.privateKey = '请输入私钥'
    emit('validate', false, null)
    return false
  }
  
  if (!/^[0-9a-fA-F]{64}$/.test(key)) {
    errors.privateKey = '私钥必须是64位十六进制字符'
    emit('validate', false, null)
    return false
  }
  
  // 检查私钥是否在有效范围内 (1 < key < n-1)
  const keyBigInt = BigInt('0x' + key)
  const maxKey = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140')
  
  if (keyBigInt <= 1n || keyBigInt >= maxKey) {
    errors.privateKey = '私钥值超出有效范围'
    emit('validate', false, null)
    return false
  }
  
  errors.privateKey = ''
  emit('validate', true, key)
  console.log(key)
  return true
}

/**
 * 清除手动输入
 */
const clearManualInput = () => {
  manualPrivateKey.value = ''
  clearErrors()
  emit('update:modelValue', '')
}

/**
 * 从剪贴板粘贴
 */
const pasteFromClipboard = async () => {
  try {
    const text = await navigator.clipboard.readText()
    manualPrivateKey.value = text.trim()
    handleManualInput()
    validatePrivateKey()
  } catch (error) {
    console.error('粘贴失败:', error)
  }
}

/**
 * 触发文件选择
 */
const triggerFileSelect = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

/**
 * 处理文件选择
 * @param {Event} event - 文件选择事件
 */
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

/**
 * 处理拖拽悬停
 */
const handleDragOver = () => {
  isDragOver.value = true
}

/**
 * 处理拖拽离开
 */
const handleDragLeave = () => {
  isDragOver.value = false
}

/**
 * 处理文件拖拽
 * @param {DragEvent} event - 拖拽事件
 */
const handleFileDrop = (event) => {
  isDragOver.value = false
  const files = event.dataTransfer.files
  if (files.length > 0) {
    processFile(files[0])
  }
}

/**
 * 处理文件
 * @param {File} file - 文件对象
 */
const processFile = (file) => {
  clearErrors()
  
  // 验证文件类型
  if (!file.name.toLowerCase().endsWith('.json')) {
    errors.file = '请选择JSON格式的文件'
    return
  }
  
  // 验证文件大小 (最大1MB)
  if (file.size > 1024 * 1024) {
    errors.file = '文件大小不能超过1MB'
    return
  }
  
  uploadedFile.value = file
  
  // 读取文件内容
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const keyData = JSON.parse(e.target.result)
      
      // 验证文件格式
      if (!keyData.privateKey) {
        errors.file = '文件格式错误：缺少privateKey字段'
        return
      }
      console.log("pojiuhnonklm", keyData)
      // 设置私钥值
      const privateKey = keyData.privateKey
      // 验证私钥
      manualPrivateKey.value = privateKey
      emit('file-upload', file, keyData)
      emit('update:modelValue', privateKey)
      if (validatePrivateKey()) {
        console.log('从文件加载私钥成功:', {
          file: file.name,
          keyLength: privateKey.length,
          timestamp: keyData.timestamp || '未知'
        })
      }
      
    } catch (error) {
      errors.file = '文件解析失败：' + error.message
      console.error('文件解析错误:', error)
    }
  }
  
  reader.onerror = () => {
    errors.file = '文件读取失败'
  }
  
  reader.readAsText(file)
}

/**
 * 移除文件
 */
const removeFile = () => {
  uploadedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  clearErrors()
  emit('update:modelValue', '')
}

/**
 * 格式化文件大小
 * @param {Number} bytes - 字节数
 * @returns {String} 格式化后的大小
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 清除错误信息
 */
const clearErrors = () => {
  errors.privateKey = ''
  errors.file = ''
}

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 验证私钥
   */
  validate: validatePrivateKey,
  
  /**
   * 清除输入
   */
  clear: () => {
    clearManualInput()
    removeFile()
  },
  
  /**
   * 获取私钥信息
   */
  getKeyInfo: () => privateKeyInfo.value
})
</script>