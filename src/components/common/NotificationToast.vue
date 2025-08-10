<template>
  <Transition name="toast" appear>
    <div 
      v-if="visible" 
      :class="[
        'notification-toast',
        `toast-${type}`,
        { 'toast-closable': closable }
      ]"
      @click="handleClick"
    >
      <div class="toast-icon">
        <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
        <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
      </div>
      
      <div class="toast-content">
        <div v-if="title" class="toast-title">{{ title }}</div>
        <div class="toast-message">{{ message }}</div>
      </div>
      
      <button 
        v-if="closable" 
        class="toast-close" 
        @click.stop="close"
        aria-label="关闭通知"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

/**
 * 通知提示组件
 * 用于替换原生 alert，提供更好的用户体验
 */
const props = defineProps({
  // 通知类型：success, error, warning, info
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  // 通知标题
  title: {
    type: String,
    default: ''
  },
  // 通知消息内容
  message: {
    type: String,
    required: true
  },
  // 自动关闭时间（毫秒），0 表示不自动关闭
  duration: {
    type: Number,
    default: 4000
  },
  // 是否显示关闭按钮
  closable: {
    type: Boolean,
    default: true
  },
  // 点击通知时是否关闭
  clickToClose: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)
let timer = null

/**
 * 显示通知
 */
const show = () => {
  visible.value = true
  
  // 设置自动关闭定时器
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

/**
 * 关闭通知
 */
const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  emit('close')
}

/**
 * 处理点击事件
 */
const handleClick = () => {
  if (props.clickToClose) {
    close()
  }
}

// 组件挂载时显示通知
onMounted(() => {
  show()
})

// 监听 duration 变化，重新设置定时器
watch(() => props.duration, (newDuration) => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  
  if (newDuration > 0 && visible.value) {
    timer = setTimeout(() => {
      close()
    }, newDuration)
  }
})

// 暴露方法供父组件调用
defineExpose({
  show,
  close
})
</script>

<style scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 9999;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.notification-toast:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* 通知类型样式 */
.toast-success {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid #10b981;
  color: #065f46;
}

.toast-error {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-left: 4px solid #ef4444;
  color: #991b1b;
}

.toast-warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-left: 4px solid #f59e0b;
  color: #92400e;
}

.toast-info {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-left: 4px solid #3b82f6;
  color: #1e40af;
}

/* 图标样式 */
.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
}

.toast-success .toast-icon {
  color: #10b981;
}

.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info .toast-icon {
  color: #3b82f6;
}

/* 内容样式 */
.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  line-height: 1.4;
}

.toast-message {
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;
}

/* 关闭按钮样式 */
.toast-close {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  opacity: 1;
}

.toast-close svg {
  width: 16px;
  height: 16px;
}

/* 动画效果 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-toast {
    top: 10px;
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .notification-toast {
    padding: 12px;
    gap: 8px;
  }
  
  .toast-title {
    font-size: 13px;
  }
  
  .toast-message {
    font-size: 13px;
  }
}
</style>