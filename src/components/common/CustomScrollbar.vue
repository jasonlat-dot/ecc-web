<template>
  <div class="custom-scrollbar-container" ref="scrollContainer">
    <div class="custom-scrollbar-content" ref="scrollContent">
      <slot></slot>
    </div>
    
    <!-- 自定义滚动条 -->
    <div 
      v-if="showScrollbar" 
      class="custom-scrollbar-track"
      @click="handleTrackClick"
    >
      <div 
        class="custom-scrollbar-thumb"
        :style="thumbStyle"
        @mousedown="handleThumbMouseDown"
      ></div>
    </div>
  </div>
</template>

<script setup>
/**
 * 自定义滚动条组件
 * 
 * @description 提供美观的自定义滚动条，支持拖拽和点击跳转
 * @author ECC Team
 * @version 1.0.0
 */

import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue'

/**
 * 组件属性
 */
const props = defineProps({
  /**
   * 滚动条宽度
   */
  scrollbarWidth: {
    type: Number,
    default: 8
  },
  /**
   * 滚动条颜色主题
   */
  theme: {
    type: String,
    default: 'default', // default, rainbow, purple
    validator: (value) => ['default', 'rainbow', 'purple'].includes(value)
  },
  /**
   * 是否自动隐藏
   */
  autoHide: {
    type: Boolean,
    default: true
  }
})

/**
 * 响应式数据
 */
const scrollContainer = ref(null)
const scrollContent = ref(null)
const showScrollbar = ref(false)
const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragStartScrollTop = ref(0)

/**
 * 计算滚动条拇指样式
 */
const thumbStyle = computed(() => {
  const thumbHeight = Math.max((clientHeight.value / scrollHeight.value) * clientHeight.value, 30)
  const thumbTop = (scrollTop.value / (scrollHeight.value - clientHeight.value)) * (clientHeight.value - thumbHeight)
  
  let background = ''
  switch (props.theme) {
    case 'rainbow':
      background = 'linear-gradient(135deg, #e74c3c 0%, #f39c12 25%, #2ecc71 50%, #3498db 75%, #9b59b6 100%)'
      break
    case 'purple':
      background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      break
    default:
      background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)'
  }
  
  return {
    height: `${thumbHeight}px`,
    transform: `translateY(${thumbTop}px)`,
    background,
    width: `${props.scrollbarWidth}px`
  }
})

/**
 * 更新滚动条状态
 */
const updateScrollbar = () => {
  if (!scrollContainer.value) return
  
  scrollTop.value = scrollContainer.value.scrollTop
  scrollHeight.value = scrollContainer.value.scrollHeight
  clientHeight.value = scrollContainer.value.clientHeight
  
  showScrollbar.value = scrollHeight.value > clientHeight.value
}

/**
 * 处理滚动事件
 */
const handleScroll = () => {
  updateScrollbar()
}

/**
 * 处理轨道点击
 */
const handleTrackClick = (event) => {
  if (!scrollContainer.value) return
  
  const rect = event.currentTarget.getBoundingClientRect()
  const clickY = event.clientY - rect.top
  const thumbHeight = Math.max((clientHeight.value / scrollHeight.value) * clientHeight.value, 30)
  const maxScrollTop = scrollHeight.value - clientHeight.value
  const targetScrollTop = ((clickY - thumbHeight / 2) / (clientHeight.value - thumbHeight)) * maxScrollTop
  
  scrollContainer.value.scrollTo({
    top: Math.max(0, Math.min(targetScrollTop, maxScrollTop)),
    behavior: 'smooth'
  })
}

/**
 * 处理拇指鼠标按下
 */
const handleThumbMouseDown = (event) => {
  event.preventDefault()
  isDragging.value = true
  dragStartY.value = event.clientY
  dragStartScrollTop.value = scrollTop.value
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = 'none'
}

/**
 * 处理鼠标移动
 */
const handleMouseMove = (event) => {
  if (!isDragging.value || !scrollContainer.value) return
  
  const deltaY = event.clientY - dragStartY.value
  const thumbHeight = Math.max((clientHeight.value / scrollHeight.value) * clientHeight.value, 30)
  const maxScrollTop = scrollHeight.value - clientHeight.value
  const scrollRatio = deltaY / (clientHeight.value - thumbHeight)
  const newScrollTop = dragStartScrollTop.value + scrollRatio * maxScrollTop
  
  scrollContainer.value.scrollTop = Math.max(0, Math.min(newScrollTop, maxScrollTop))
}

/**
 * 处理鼠标释放
 */
const handleMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.body.style.userSelect = ''
}

/**
 * 组件挂载
 */
onMounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll)
    // 初始化
    nextTick(() => {
      updateScrollbar()
    })
  }
  
  // 监听窗口大小变化
  window.addEventListener('resize', updateScrollbar)
})

/**
 * 组件卸载
 */
onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
  window.removeEventListener('resize', updateScrollbar)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

/**
 * 暴露方法
 */
defineExpose({
  scrollTo: (options) => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo(options)
    }
  },
  scrollToTop: () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  scrollToBottom: () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTo({ top: scrollContainer.value.scrollHeight, behavior: 'smooth' })
    }
  }
})
</script>

<style scoped>
/**
 * 自定义滚动条容器
 */
.custom-scrollbar-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.custom-scrollbar-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 12px;
  margin-right: -12px;
}

/* 隐藏原生滚动条 */
.custom-scrollbar-content::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar-content {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

/**
 * 自定义滚动条轨道
 */
.custom-scrollbar-track {
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.custom-scrollbar-container:hover .custom-scrollbar-track {
  opacity: 1;
}

/**
 * 自定义滚动条拇指
 */
.custom-scrollbar-thumb {
  position: absolute;
  top: 0;
  right: 2px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.custom-scrollbar-thumb:hover {
  transform: translateY(var(--thumb-top, 0)) scale(1.1) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.custom-scrollbar-thumb:active {
  transform: translateY(var(--thumb-top, 0)) scale(0.95) !important;
}

/**
 * 自动隐藏模式
 */
.custom-scrollbar-container.auto-hide .custom-scrollbar-track {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.custom-scrollbar-container.auto-hide:hover .custom-scrollbar-track,
.custom-scrollbar-container.auto-hide .custom-scrollbar-track.dragging {
  opacity: 1;
}

/**
 * 主题样式
 */
.theme-rainbow .custom-scrollbar-thumb {
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 25%, #2ecc71 50%, #3498db 75%, #9b59b6 100%);
  animation: rainbowGlow 3s ease-in-out infinite;
}

@keyframes rainbowGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
  }
  25% {
    box-shadow: 0 2px 8px rgba(243, 156, 18, 0.3);
  }
  50% {
    box-shadow: 0 2px 8px rgba(46, 204, 113, 0.3);
  }
  75% {
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
  }
}

.theme-purple .custom-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.theme-default .custom-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%);
}
</style>