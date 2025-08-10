<template>
  <div class="api-test-demo">
    <!-- 认证加载动画 -->
    <AuthLoadingSpinner 
      :visible="isAuthLoading"
      :title="authLoadingTitle"
      :message="authLoadingMessage"
    />
    
    <!-- 页面头部 -->
    <div class="demo-header">
      <h1 class="demo-title">API接口测试演示</h1>
      <p class="demo-description">测试ECC加密接口的各种认证和加密场景</p>
    </div>
    
    <!-- 测试按钮区域 -->
    <div class="test-buttons">
      <div class="button-grid">
        <!-- 测试接口1 -->
        <div class="test-card">
          <div class="card-header">
            <div class="test-icon test2">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M11,7H13V9H11V7M11,11H13V17H11V11Z"/>
              </svg>
            </div>
            <span class="test-badge">白名单</span>
          </div>
          <h3>测试接口 1</h3>
          <p>在JWT白名单接口（带token但跳过认证验证）</p>
          <div class="test-features">
            <span class="feature-tag">白名单</span>
            <span class="feature-tag">带Token</span>
            <span class="feature-tag">加密响应</span>
          </div>
          
          <!-- 占位元素，保持与接口3高度一致 -->
          <div class="param-placeholder">
            <div class="placeholder-space"></div>
          </div>
          
          <button 
            class="test-btn test2-btn" 
            @click="testApi2" 
            :disabled="loading.test2"
          >
            <span v-if="loading.test2" class="loading-spinner"></span>
            {{ loading.test2 ? '测试中...' : '测试接口 1' }}
          </button>
        </div>
        
        <!-- 测试接口2 -->
        <div class="test-card">
          <div class="card-header">
            <div class="test-icon test3">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
              </svg>
            </div>
            <span class="test-badge">需要认证</span>
          </div>
          <h3>测试接口 2</h3>
          <p>不在JWT白名单接口（需要token认证验证）</p>
          <div class="test-features">
            <span class="feature-tag">需要认证</span>
            <span class="feature-tag">Token验证</span>
            <span class="feature-tag">加密响应</span>
          </div>
          
          <!-- 占位元素，保持与接口3高度一致 -->
          <div class="param-placeholder">
            <div class="placeholder-space"></div>
          </div>
          
          <button 
            class="test-btn test3-btn" 
            @click="testApi3" 
            :disabled="loading.test3"
          >
            <span v-if="loading.test3" class="loading-spinner"></span>
            {{ loading.test3 ? '测试中...' : '测试接口 2' }}
          </button>
        </div>
        
        <!-- 测试接口3 -->
        <div class="test-card">
          <div class="card-header">
            <div class="test-icon test4">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M11,7H13V9H11V7M11,11H13V17H11V11Z"/>
              </svg>
            </div>
            <span class="test-badge">双向加密</span>
          </div>
          <h3>测试接口 3</h3>
          <p>请求解密+响应加密接口（需要token认证验证）</p>
          <div class="test-features">
            <span class="feature-tag">需要认证</span>
            <span class="feature-tag">请求解密</span>
            <span class="feature-tag">响应加密</span>
          </div>
          
          <!-- 参数输入框 -->
          <div class="param-input-group">
            <label for="api4-params" class="param-label">请求参数 (params):</label>
            <input 
              id="api4-params"
              type="text" 
              v-model="api4Params" 
              placeholder="请输入参数值" 
              class="param-input"
              :disabled="loading.test4"
            />
          </div>
          
          <button 
            class="test-btn test4-btn" 
            @click="testApi4" 
            :disabled="loading.test4"
          >
            <span v-if="loading.test4" class="loading-spinner"></span>
            {{ loading.test4 ? '测试中...' : '测试接口 3' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 返回按钮 -->
    <div class="demo-footer">
      <button class="back-btn" @click="goBack">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
        </svg>
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
/**
 * API测试演示页面组件
 * 
 * @description 提供四个测试按钮来测试不同的ECC加密接口场景
 * @author ECC Team
 * @version 1.0.0
 */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user.js'
import { httpClient } from '@/utils/http.js'
import { showNotification } from '@/utils/notification.js'
import AuthLoadingSpinner from '@/components/common/AuthLoadingSpinner.vue'

// 路由实例
const router = useRouter()

const api4Params = ref('')
const loading = ref({
  test1: false,
  test2: false,
  test3: false,
  test4: false
})

/**
 * 认证加载状态
 */
const isAuthLoading = ref(false)
const authLoadingTitle = ref('身份验证中')
const authLoadingMessage = ref('正在验证您的登录状态，请稍候...')



/**
 * 页面挂载时验证登录状态
 */
onMounted(async () => {
  // 显示loading
  isAuthLoading.value = true
  authLoadingTitle.value = '身份验证中'
  authLoadingMessage.value = '正在验证您的API测试权限，请稍候...'
  
  await checkLoginStatus()
})

/**
 * 检查用户登录状态
 */
const checkLoginStatus = async () => {
  try {
    // 模拟验证过程，让loading显示更久一点
    await new Promise(resolve => setTimeout(resolve, 1500)) // 0
    
    const result = await userApi.validateLoginStatus()
    
    if (!result.success || !result.isLoggedIn) {
      // 更新loading状态
      authLoadingTitle.value = '权限验证失败'
      authLoadingMessage.value = '未检测到有效的API测试权限，即将跳转到登录页面...'
      
      // 等待一下让用户看到状态变化
      await new Promise(resolve => setTimeout(resolve, 800)) // 0
      
      // 显示通知
      showNotification({
        type: 'warning',
        title: '需要登录',
        message: '请先登录后再访问测试页面',
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
    authLoadingTitle.value = '权限验证成功'
    authLoadingMessage.value = 'API测试权限验证成功，正在加载测试界面...'
    
    // 等待一下让用户看到成功状态
    await new Promise(resolve => setTimeout(resolve, 0))
    
    // 隐藏loading
    isAuthLoading.value = false
    
    // 显示成功通知（与loading淡出同步）
    setTimeout(() => {
      showNotification({
        type: 'success',
        title: '权限验证成功',
        message: '欢迎使用API接口测试功能',
        duration: 3000 // 0
      })
    }, 200) // 100
    
  } catch (error) {
    console.error('登录状态检查失败:', error)
    
    // 更新loading状态显示错误
    authLoadingTitle.value = '验证异常'
    authLoadingMessage.value = 'API权限验证过程中发生错误，即将跳转到登录页面...'
    
    // 等待一下让用户看到错误状态
    await new Promise(resolve => setTimeout(resolve, 800)) // 0
    
    // 显示错误通知
    showNotification({
      type: 'error',
      title: '验证失败',
      message: '登录状态验证失败，请重新登录',
      duration: 3000 // 0
    })
    
    // 同时开始loading淡出和页面跳转
    isAuthLoading.value = false
    
    setTimeout(() => {
      router.push('/login')
    }, 10)
  }
}

/**
 * 测试接口1：在JWT白名单接口
 */
const testApi2 = async () => {
  loading.value.test2 = true
  
  try {
    const token = localStorage.getItem('authToken')
    const response = await httpClient.post('/test/2', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Encrypted': 'true'
      }
    })
    console.log(response)
    showNotification({
      type: 'success',
      title: '接口1测试成功',
      message: response.data || '在JWT白名单接口调用成功',
      duration: 4000
    })
  } catch (error) {
    console.error('接口1测试失败:', error)
    showNotification({
      type: 'error',
      title: '接口1测试失败',
      message: error.response?.info || error.message || '接口调用失败',
      duration: 4000
    })
  } finally {
    loading.value.test2 = false
  }
}

/**
 * 测试接口2：不在JWT白名单接口
 */
const testApi3 = async () => {
  loading.value.test3 = true
  
  try {
    const token = localStorage.getItem('authToken')
    const response = await httpClient.post('/test/3', {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Encrypted': 'true'
      }
    })
    
    showNotification({
      type: 'success',
      title: '接口2测试成功',
      message: response.data || '不在JWT白名单接口调用成功',
      duration: 4000
    })
  } catch (error) {
    console.error('接口3测试失败:', error)
    showNotification({
      type: 'error',
      title: '接口2测试失败',
      message: error.response?.info || error.message || '接口调用失败，可能需要重新登录',
      duration: 4000
    })
  } finally {
    loading.value.test3 = false
  }
}

/**
 * 测试接口4：请求解密+响应加密接口
 */
const testApi4 = async () => {
  loading.value.test4 = true
  
  try {
    const token = localStorage.getItem('authToken')
    
    // 构建请求URL，如果有params参数则添加到查询字符串中
    let requestUrl = '/test/4'
    if (api4Params.value && api4Params.value.trim()) {
      requestUrl += `?params=${encodeURIComponent(api4Params.value.trim())}`
    }
    
    const response = await httpClient.get(requestUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Encrypted': 'true',
        'X-Request-Decryption': 'true'
      }
    })
    
    showNotification({
      type: 'success',
      title: '接口3测试成功',
      message: response.data || '请求解密+响应加密接口调用成功',
      duration: 4000
    })
  } catch (error) {
    console.error('接口4测试失败:', error)
    showNotification({
      type: 'error',
      title: '接口3测试失败',
      message: error.response?.info || error.message || '接口调用失败，可能需要重新登录',
      duration: 4000
    })
  } finally {
    loading.value.test4 = false
  }
}

/**
 * 返回首页
 */
const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* 引入外部样式文件 */
@import '@/styles/components/api-test-demo.css';
</style>