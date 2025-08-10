<template>
  <!-- 成功提示模态框组件 -->
  <Teleport to="body">
    <Transition name="modal" appear>
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-content" @click.stop>
          <!-- 模态框头部 -->
          <div class="modal-header">
            <svg class="success-icon large" viewBox="0 0 24 24" fill="none">
              <path d="M22 11.08V12A10 10 0 1 1 5.93 7.69" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h3>{{ title }}</h3>
          </div>
          
          <!-- 模态框主体 -->
          <div class="modal-body">
            <p>{{ message }}</p>
            
            <!-- 加密信息展示 -->
            <div v-if="showEncryptionInfo" class="encryption-info">
              <h4>{{ encryptionTitle }}</h4>
              <ul>
                <li v-for="(item, index) in encryptionItems" :key="index">
                  ✓ {{ item }}
                </li>
              </ul>
            </div>
            
            <!-- 详细加密数据展示 -->
            <div v-if="encryptionData" class="encryption-details">
              <h4>加密详情:</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">加密算法:</span>
                  <span class="detail-value">{{ encryptionData.algorithm }}</span>
                </div>
                <div class="detail-item" v-if="encryptionData.encryptedSize">
                  <span class="detail-label">加密数据大小:</span>
                  <span class="detail-value">{{ encryptionData.encryptedSize }}</span>
                </div>
                <div class="detail-item" v-if="encryptionData.signatureSize">
                  <span class="detail-label">签名大小:</span>
                  <span class="detail-value">{{ encryptionData.signatureSize }}</span>
                </div>
                <div class="detail-item" v-if="encryptionData.tempPublicKey">
                  <span class="detail-label">临时公钥 X:</span>
                  <span class="detail-value code">{{ encryptionData.tempPublicKey.x }}</span>
                </div>
                <div class="detail-item" v-if="encryptionData.tempPublicKey">
                  <span class="detail-label">临时公钥 Y:</span>
                  <span class="detail-value code">{{ encryptionData.tempPublicKey.y }}</span>
                </div>
              </div>
            </div>
            
            <!-- 自定义内容插槽 -->
            <slot name="content"></slot>
          </div>
          
          <!-- 模态框底部 -->
          <div class="modal-footer">
            <button 
              @click="handleConfirm" 
              class="modal-btn primary"
              :disabled="isProcessing"
            >
              <svg v-if="isProcessing" class="loading-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                  <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                  <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
                </circle>
              </svg>
              {{ confirmButtonText }}
            </button>
            
            <button 
              v-if="showCancel"
              @click="handleCancel" 
              class="modal-btn secondary"
              :disabled="isProcessing"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
/**
 * 成功提示模态框组件
 * 
 * @description 用于显示操作成功信息的模态框组件，支持自定义内容和操作
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps, defineEmits, computed, onMounted, onUnmounted, ref, watch } from 'vue'

// 导入样式
import '../../styles/components/success-modal.css'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 是否显示模态框
   * @type {Boolean}
   */
  visible: {
    type: Boolean,
    default: false
  },
  
  /**
   * 模态框标题
   * @type {String}
   */
  title: {
    type: String,
    default: '操作成功！'
  },
  
  /**
   * 主要消息内容
   * @type {String}
   */
  message: {
    type: String,
    default: '操作已成功完成。'
  },
  
  /**
   * 确认按钮文本
   * @type {String}
   */
  confirmText: {
    type: String,
    default: '确定'
  },
  
  /**
   * 取消按钮文本
   * @type {String}
   */
  cancelText: {
    type: String,
    default: '取消'
  },
  
  /**
   * 处理中按钮文本
   * @type {String}
   */
  processingText: {
    type: String,
    default: '处理中...'
  },
  
  /**
   * 是否显示取消按钮
   * @type {Boolean}
   */
  showCancel: {
    type: Boolean,
    default: false
  },
  
  /**
   * 是否正在处理
   * @type {Boolean}
   */
  isProcessing: {
    type: Boolean,
    default: false
  },
  
  /**
   * 是否显示加密信息
   * @type {Boolean}
   */
  showEncryptionInfo: {
    type: Boolean,
    default: false
  },
  
  /**
   * 加密信息标题
   * @type {String}
   */
  encryptionTitle: {
    type: String,
    default: '加密信息:'
  },
  
  /**
   * 加密信息列表
   * @type {Array}
   */
  encryptionItems: {
    type: Array,
    default: () => [
      '用户数据已使用ECC椭圆曲线加密',
      '临时密钥对已生成',
      '永久公钥已保存'
    ]
  },
  
  /**
   * 是否允许点击遮罩关闭
   * @type {Boolean}
   */
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  
  /**
   * 是否允许按ESC键关闭
   * @type {Boolean}
   */
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  
  /**
   * 自动关闭时间（毫秒，0表示不自动关闭）
   * @type {Number}
   */
  autoCloseDelay: {
    type: Number,
    default: 0
  },
  
  /**
   * 加密数据对象
   * @type {Object}
   */
  encryptionData: {
    type: Object,
    default: () => null
  },
  
  /**
   * 是否显示倒计时
   * @type {Boolean}
   */
  showCountdown: {
    type: Boolean,
    default: false
  },
  
  /**
   * 倒计时时间（秒）
   * @type {Number}
   */
  countdownTime: {
    type: Number,
    default: 10
  }
})

/**
 * 组件事件定义
 */
const emit = defineEmits([
  /**
   * 确认事件
   */
  'confirm',
  
  /**
   * 取消事件
   */
  'cancel',
  
  /**
   * 关闭事件
   */
  'close',
  
  /**
   * 更新visible状态（v-model支持）
   * @param {Boolean} visible - 新的显示状态
   */
  'update:visible'
])

/**
 * 响应式数据
 */

/**
 * 倒计时剩余时间
 */
const countdown = ref(0)

/**
 * 倒计时定时器
 */
let countdownTimer = null

/**
 * 计算属性
 */

/**
 * 是否显示（支持v-model）
 */
const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

/**
 * 确认按钮显示文本
 */
const confirmButtonText = computed(() => {
  if (props.isProcessing) {
    return props.processingText
  }
  if (props.showCountdown && countdown.value > 0) {
    return `${props.confirmText} (${countdown.value}s)`
  }
  return props.confirmText
})

/**
 * 方法定义
 */

/**
 * 处理确认操作
 */
const handleConfirm = () => {
  emit('confirm')
  if (!props.isProcessing) {
    closeModal()
  }
}

/**
 * 处理取消操作
 */
const handleCancel = () => {
  emit('cancel')
  closeModal()
}

/**
 * 处理遮罩点击
 */
const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.isProcessing) {
    closeModal()
  }
}

/**
 * 关闭模态框
 */
const closeModal = () => {
  isVisible.value = false
  emit('close')
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} event - 键盘事件
 */
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.isProcessing) {
    closeModal()
  }
}

/**
 * 自动关闭定时器
 */
let autoCloseTimer = null

/**
 * 启动自动关闭定时器
 */
const startAutoCloseTimer = () => {
  if (props.autoCloseDelay > 0) {
    autoCloseTimer = setTimeout(() => {
      if (props.visible && !props.isProcessing) {
        closeModal()
      }
    }, props.autoCloseDelay)
  }
}

/**
 * 清除自动关闭定时器
 */
const clearAutoCloseTimer = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

/**
 * 启动倒计时
 */
const startCountdown = () => {
  if (props.showCountdown && props.countdownTime > 0) {
    countdown.value = props.countdownTime
    countdownTimer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearCountdown()
        // 倒计时结束，自动确认
        handleConfirm()
      }
    }, 1000)
  }
}

/**
 * 清除倒计时
 */
const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  countdown.value = 0
}

/**
 * 生命周期钩子
 */

/**
 * 组件挂载时
 */
onMounted(() => {
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
  
  // 如果模态框已显示，启动自动关闭定时器和倒计时
  if (props.visible) {
    startAutoCloseTimer()
    startCountdown()
  }
})

/**
 * 组件卸载时
 */
onUnmounted(() => {
  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeydown)
  
  // 清除定时器
  clearAutoCloseTimer()
  clearCountdown()
})

/**
 * 监听visible变化
 */
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    startAutoCloseTimer()
    startCountdown()
  } else {
    clearAutoCloseTimer()
    clearCountdown()
  }
})

/**
 * 暴露给父组件的方法
 */
defineExpose({
  /**
   * 关闭模态框
   */
  close: closeModal,
  
  /**
   * 确认操作
   */
  confirm: handleConfirm,
  
  /**
   * 取消操作
   */
  cancel: handleCancel
})
</script>

<style scoped>
/* 加密详情样式 */
.encryption-details {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.encryption-details h4 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.detail-label {
  font-weight: 500;
  color: #6c757d;
  min-width: 100px;
}

.detail-value {
  color: #495057;
  font-weight: 400;
  text-align: right;
  flex: 1;
  margin-left: 10px;
}

.detail-value.code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 4px;
  color: #e83e8c;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .detail-label {
    margin-bottom: 4px;
    min-width: auto;
  }
  
  .detail-value {
    text-align: left;
    margin-left: 0;
  }
}
</style>