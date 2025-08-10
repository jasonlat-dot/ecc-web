<template>
  <div class="notification-demo">
    <!-- 认证加载动画 -->
    <AuthLoadingSpinner 
      :visible="isAuthLoading"
      :title="authLoadingTitle"
      :message="authLoadingMessage"
    />
    
    <div class="demo-container">
      <div class="demo-header">
        <button class="back-button" @click="goBack">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          返回登录
        </button>
        
        <button class="project-intro-button" @click="goToProjectIntro">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10.5C10.07,10.5 8.5,8.93 8.5,7C8.5,5.07 10.07,3.5 12,3.5C13.93,3.5 15.5,5.07 15.5,7C15.5,8.93 13.93,10.5 12,10.5Z"/>
          </svg>
          项目介绍
        </button>
      </div>
      
      <h1 class="demo-title">通知组件演示</h1>
      <p class="demo-description">
        这个页面展示了新的通知组件功能，用于替换原生的 alert 弹窗。
      </p>
    
      <div class="demo-section">
        <h2>基础通知类型</h2>
        <div class="button-group">
          <button 
            class="demo-button success" 
            @click="showSuccessNotification"
          >
            成功通知
          </button>
          
          <button 
            class="demo-button error" 
            @click="showErrorNotification"
          >
            错误通知
          </button>
          
          <button 
            class="demo-button warning" 
            @click="showWarningNotification"
          >
            警告通知
          </button>
          
          <button 
            class="demo-button info" 
            @click="showInfoNotification"
          >
            信息通知
          </button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>带标题的通知</h2>
        <div class="button-group">
          <button 
            class="demo-button success" 
            @click="showTitledNotification"
          >
            带标题通知
          </button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>自定义配置</h2>
        <div class="button-group">
          <button 
            class="demo-button info" 
            @click="showPersistentNotification"
          >
            持久通知（不自动关闭）
          </button>
          
          <button 
            class="demo-button warning" 
            @click="showClickToCloseNotification"
          >
            点击关闭通知
          </button>
          
          <button 
            class="demo-button error" 
            @click="showLongDurationNotification"
          >
            长时间显示（10秒）
          </button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>批量操作</h2>
        <div class="button-group">
          <button 
            class="demo-button info" 
            @click="showMultipleNotifications"
          >
            显示多个通知
          </button>
          
          <button 
            class="demo-button secondary" 
            @click="clearAllNotifications"
          >
            清除所有通知
          </button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>模拟登录场景</h2>
        <div class="button-group">
          <button 
            class="demo-button success" 
            @click="simulateLoginSuccess"
          >
            模拟登录成功
          </button>
          
          <button 
            class="demo-button error" 
            @click="simulateLoginError"
          >
            模拟登录失败
          </button>
          
          <button 
            class="demo-button warning" 
            @click="simulateForgotPassword"
          >
            模拟忘记密码
          </button>
        </div>
      </div>
      
      <div class="demo-section">
        <h2>使用说明</h2>
        <div class="usage-info">
          <h3>基础通知使用：</h3>
          <pre><code>// 导入通知服务
import { showSuccess, showError, showWarning, showInfo } from '@/utils/notification'

// 显示基础通知
showSuccess('操作成功！')
showError('操作失败，请重试')
showWarning('请注意相关事项')
showInfo('这是一条信息')</code></pre>
          
          <h3>带标题的通知：</h3>
          <pre><code>// 导入通知服务
import { notificationService } from '@/utils/notification'

// 显示带标题的通知
notificationService.show({
  type: 'success',
  title: '操作成功',
  message: '您的数据已成功保存到服务器',
  duration: 5000
})

notificationService.show({
  type: 'error',
  title: '网络错误',
  message: '无法连接到服务器，请检查网络连接',
  duration: 0 // 不自动关闭
})</code></pre>
          
          <h3>自定义配置：</h3>
          <pre><code>// 持久通知（不自动关闭）
notificationService.show({
  type: 'warning',
  message: '重要提醒：请及时保存您的工作',
  duration: 0,
  closable: true
})

// 点击关闭通知
notificationService.show({
  type: 'info',
  message: '点击此通知可关闭',
  clickToClose: true,
  duration: 10000
})

// 长时间显示
notificationService.show({
  type: 'error',
  message: '系统将在10秒后自动关闭此通知',
  duration: 10000
})</code></pre>
          
          <h3>批量操作：</h3>
          <pre><code>// 显示多个通知
const notifications = [
  { type: 'success', message: '文件1上传成功' },
  { type: 'success', message: '文件2上传成功' },
  { type: 'warning', message: '文件3格式不支持' }
]

notifications.forEach(config => {
  notificationService.show(config)
})

// 清除所有通知
notificationService.clear()</code></pre>
          
          <h3>使用组合式API：</h3>
          <pre><code>import { useNotification } from '@/plugins/notification'

const { showSuccess, showError, showWarning, showInfo, clear } = useNotification()

// 使用方法与上述相同
showSuccess('操作成功！')
clear() // 清除所有通知</code></pre>
          
          <h3>替换原生 alert：</h3>
          <pre><code>// 原来的代码
alert('这是一个提示')

// 新的代码
showInfo('这是一个提示')</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 通知组件演示页面
 * 
 * @description 展示各种通知类型和配置选项，需要用户登录后才能访问
 * @author ECC Team
 * @version 1.0.0
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user.js'
import { 
  showSuccess, 
  showError, 
  showWarning, 
  showInfo, 
  showNotification,
  clearNotifications 
} from '@/utils/notification'
import AuthLoadingSpinner from '@/components/common/AuthLoadingSpinner.vue'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 响应式状态
 */
const isAuthLoading = ref(false)
const authLoadingTitle = ref('身份验证中')
const authLoadingMessage = ref('正在验证您的登录状态，请稍候...')

/**
 * 返回登录页面
 */
const goBack = () => {
  router.push('/login')
}

/**
 * 跳转到项目介绍页面
 */
const goToProjectIntro = () => {
  router.push('/project-intro')
}

/**
 * 页面挂载时验证登录状态
 */
onMounted(async () => {
  // 显示loading
  isAuthLoading.value = true
  authLoadingTitle.value = '身份验证中'
  authLoadingMessage.value = '正在验证您的登录状态，请稍候...'
  
  await checkLoginStatus()
})

/**
 * 检查用户登录状态
 */
const checkLoginStatus = async () => {
  try {
    // 模拟验证过程，让loading显示更久一点
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const result = await userApi.validateLoginStatus()
    
    if (!result.success || !result.isLoggedIn) {
      // 更新loading状态
      authLoadingTitle.value = '验证失败'
      authLoadingMessage.value = '未检测到有效登录状态，即将跳转到登录页面...'
      
      // 等待一下让用户看到状态变化
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 显示通知
      showNotification({
        type: 'warning',
        title: '需要登录',
        message: '请先登录后再访问通知演示页面',
        duration: 3000
      })
      
      // 同时开始loading淡出和页面跳转
      isAuthLoading.value = false
      
      // 稍微延迟跳转，让loading淡出动画完成
      setTimeout(() => {
        router.push('/login')
      }, 300)
      return
    }
    
    // 验证成功，更新loading状态
    authLoadingTitle.value = '验证成功'
    authLoadingMessage.value = '登录状态验证成功，正在加载页面...'
    
    // 等待一下让用户看到成功状态
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // 隐藏loading
    isAuthLoading.value = false
    
    // 登录验证成功，显示欢迎通知（与loading淡出同步）
    setTimeout(() => {
      showSuccess('登录验证成功！欢迎使用通知组件演示。', {
        title: '欢迎',
        duration: 4000
      })
    }, 200)
    
  } catch (error) {
    console.error('登录状态检查失败:', error)
    
    // 更新loading状态显示错误
    authLoadingTitle.value = '验证异常'
    authLoadingMessage.value = '登录状态验证过程中发生错误，即将跳转到登录页面...'
    
    // 等待一下让用户看到错误状态
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 显示错误通知
    showNotification({
      type: 'error',
      title: '验证失败',
      message: '登录状态验证失败，请重新登录',
      duration: 3000
    })
    
    // 同时开始loading淡出和页面跳转
    isAuthLoading.value = false
    
    setTimeout(() => {
      router.push('/login')
    }, 300)
  }
}

/**
 * 显示成功通知
 */
const showSuccessNotification = () => {
  showSuccess('操作成功完成！')
}

/**
 * 显示错误通知
 */
const showErrorNotification = () => {
  showError('操作失败，请检查输入并重试')
}

/**
 * 显示警告通知
 */
const showWarningNotification = () => {
  showWarning('请注意：此操作可能会影响系统性能')
}

/**
 * 显示信息通知
 */
const showInfoNotification = () => {
  showInfo('这是一条普通的信息提示')
}

/**
 * 显示带标题的通知
 */
const showTitledNotification = () => {
  showNotification({
    type: 'success',
    title: '系统更新',
    message: '系统已成功更新到最新版本，新功能已可用！'
  })
}

/**
 * 显示持久通知（不自动关闭）
 */
const showPersistentNotification = () => {
  showNotification({
    type: 'info',
    title: '重要提醒',
    message: '这是一个重要通知，需要您手动关闭',
    duration: 0, // 不自动关闭
    closable: true
  })
}

/**
 * 显示点击关闭通知
 */
const showClickToCloseNotification = () => {
  showNotification({
    type: 'warning',
    message: '点击此通知可以关闭它',
    duration: 0,
    clickToClose: true,
    closable: false
  })
}

/**
 * 显示长时间通知
 */
const showLongDurationNotification = () => {
  showError('这个错误通知将显示10秒钟', {
    duration: 10000
  })
}

/**
 * 显示多个通知
 */
const showMultipleNotifications = () => {
  showInfo('第一个通知')
  
  setTimeout(() => {
    showSuccess('第二个通知')
  }, 500)
  
  setTimeout(() => {
    showWarning('第三个通知')
  }, 1000)
  
  setTimeout(() => {
    showError('第四个通知')
  }, 1500)
}

/**
 * 清除所有通知
 */
const clearAllNotifications = () => {
  clearNotifications()
  showInfo('所有通知已清除')
}

/**
 * 模拟登录成功
 */
const simulateLoginSuccess = () => {
  showSuccess('登录成功！欢迎使用系统。', {
    title: '登录成功',
    duration: 3000
  })
}

/**
 * 模拟登录失败
 */
const simulateLoginError = () => {
  showError('登录失败，用户名或密码错误', {
    title: '登录失败',
    duration: 5000
  })
}

/**
 * 模拟忘记密码
 */
const simulateForgotPassword = () => {
  showWarning('忘记密码功能正在开发中，请联系管理员重置密码', {
    title: '功能提示',
    duration: 6000
  })
}
</script>

<style scoped>
.notification-demo {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

.demo-container {
  max-width: 800px;
  margin: 0 auto 40px auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

.demo-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #4a5568;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.back-button:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  color: #2d3748;
  transform: translateX(-2px);
}

.back-button svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

.project-intro-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.project-intro-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.project-intro-button svg {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.project-intro-button:hover svg {
  transform: scale(1.1);
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin-bottom: 16px;
}

.demo-description {
  font-size: 1.1rem;
  color: #718096;
  text-align: center;
  margin-bottom: 40px;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e2e8f0;
}

.demo-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.demo-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.demo-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.demo-button.success {
  background: #48bb78;
  color: white;
}

.demo-button.success:hover {
  background: #38a169;
}

.demo-button.error {
  background: #f56565;
  color: white;
}

.demo-button.error:hover {
  background: #e53e3e;
}

.demo-button.warning {
  background: #ed8936;
  color: white;
}

.demo-button.warning:hover {
  background: #dd6b20;
}

.demo-button.info {
  background: #4299e1;
  color: white;
}

.demo-button.info:hover {
  background: #3182ce;
}

.demo-button.secondary {
  background: #a0aec0;
  color: white;
}

.demo-button.secondary:hover {
  background: #718096;
}

.usage-info {
  background: #f7fafc;
  border-radius: 8px;
  padding: 24px;
  border-left: 4px solid #4299e1;
}

.usage-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 12px;
  margin-top: 20px;
}

.usage-info h3:first-child {
  margin-top: 0;
}

.usage-info pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
}

.usage-info code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* 滚动条美化 */
.notification-demo::-webkit-scrollbar {
  width: 8px;
}

.notification-demo::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.notification-demo::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  transition: background 0.2s ease;
}

.notification-demo::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}



/* 响应式设计 */
@media (max-width: 768px) {
  .notification-demo {
    padding: 10px;
  }
  
  .demo-container {
    padding: 20px;
    margin: 0 auto 20px auto;
  }
  
  .demo-title {
    font-size: 2rem;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .demo-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .notification-demo {
    padding: 10px;
  }
  
  .demo-container {
    padding: 16px;
  }
  
  .demo-title {
    font-size: 1.8rem;
  }
  
  .usage-info pre {
    font-size: 12px;
    padding: 12px;
  }
}
</style>