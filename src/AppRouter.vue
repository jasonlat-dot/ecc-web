<template>
  <div id="app-router">
    <!-- 路由视图容器 -->
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="getTransitionName(route)"
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    
    <!-- 全局加载指示器 -->
    <div v-if="isLoading" class="global-loading">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在加载...</p>
      </div>
    </div>
    
    <!-- 全局错误提示 -->
    <div v-if="globalError" class="global-error">
      <div class="error-content">
        <svg class="error-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
        </svg>
        <h3>出现错误</h3>
        <p>{{ globalError }}</p>
        <button @click="clearError" class="error-btn">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 应用路由根组件
 * 
 * @description 管理应用的路由视图、页面过渡动画和全局状态
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { ref, onMounted, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

/**
 * 响应式数据
 */

/**
 * 全局加载状态
 */
const isLoading = ref(false)

/**
 * 全局错误信息
 */
const globalError = ref('')

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 方法定义
 */

/**
 * 获取页面过渡动画名称
 * @param {Object} route - 路由对象
 * @returns {String} 过渡动画名称
 */
const getTransitionName = (route) => {
  // 根据路由名称返回不同的过渡动画
  switch (route.name) {
    case 'Login':
      return 'slide-left'
    case 'Register':
      return 'slide-right'
    case 'Dashboard':
      return 'fade-up'
    case 'ForgotPassword':
      return 'fade'
    default:
      return 'fade'
  }
}

/**
 * 清除全局错误
 */
const clearError = () => {
  globalError.value = ''
}

/**
 * 显示全局加载
 */
const showLoading = () => {
  isLoading.value = true
}

/**
 * 隐藏全局加载
 */
const hideLoading = () => {
  isLoading.value = false
}

/**
 * 显示全局错误
 * @param {String} message - 错误消息
 */
const showError = (message) => {
  globalError.value = message
}

/**
 * 生命周期钩子
 */

/**
 * 组件挂载后
 */
onMounted(() => {
  // 监听路由变化
  router.beforeEach((to, from, next) => {
    // 显示加载状态
    showLoading()
    next()
  })
  
  router.afterEach(() => {
    // 隐藏加载状态
    setTimeout(() => {
      hideLoading()
    }, 300)
  })
  
  // 监听全局错误
  window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error)
    showError('应用程序遇到了一个错误，请刷新页面重试')
  })
  
  // 监听未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason)
    showError('网络请求失败，请检查网络连接后重试')
  })
})

/**
 * 错误捕获
 */
onErrorCaptured((error, instance, info) => {
  console.error('组件错误:', error, info)
  showError('页面组件加载失败，请刷新页面重试')
  return false
})

/**
 * 暴露给外部的方法
 */
defineExpose({
  showLoading,
  hideLoading,
  showError,
  clearError
})
</script>

<style scoped>
/**
 * 应用根容器样式
 */
#app-router {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
}

/**
 * 全局加载样式
 */
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #4a5568;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}

/**
 * 全局错误样式
 */
.global-error {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.error-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-icon {
  width: 48px;
  height: 48px;
  color: #e53e3e;
  margin-bottom: 16px;
}

.error-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.error-content p {
  color: #718096;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.error-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/**
 * 页面过渡动画
 */

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 向上淡入 */
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* 左滑 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* 右滑 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-100px);
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
 * 响应式设计
 */
@media (max-width: 480px) {
  .error-content {
    padding: 24px;
    margin: 16px;
  }
  
  .loading-spinner {
    width: 32px;
    height: 32px;
    border-width: 3px;
  }
  
  .loading-text {
    font-size: 0.9rem;
  }
}

/**
 * 深色模式支持
 */
@media (prefers-color-scheme: dark) {
  .global-loading {
    background: rgba(26, 32, 44, 0.9);
  }
  
  .loading-text {
    color: #e2e8f0;
  }
  
  .loading-spinner {
    border-color: #4a5568;
    border-top-color: #90cdf4;
  }
  
  .error-content {
    background: #1a202c;
    color: #e2e8f0;
  }
  
  .error-content h3 {
    color: #e2e8f0;
  }
  
  .error-content p {
    color: #a0aec0;
  }
}

/**
 * 减少动画模式支持
 */
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active,
  .fade-up-enter-active,
  .fade-up-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}
</style>