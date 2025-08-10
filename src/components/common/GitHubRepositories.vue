<template>
  <div class="github-repositories">
    <!-- 标题 -->
    <div class="repositories-header">
      <div class="header-main">
        <h3 class="repositories-title">
          <svg class="title-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
          相关仓库
          <span class="repo-count-badge">{{ Object.keys(repositories).length }}</span>
        </h3>
        <p class="repositories-subtitle">探索项目源码和技术文档</p>
      </div>
      
      <!-- 滚动敏感度控制 -->
      <div class="scroll-sensitivity-control">
        <label class="sensitivity-label">
          <svg class="sensitivity-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
          </svg>
          滚动敏感度
        </label>
        <div class="sensitivity-slider-container">
          <input 
            type="range" 
            class="sensitivity-slider"
            v-model="scrollSensitivity"
            min="0.5" 
            max="3" 
            step="0.1"
            title="调整鼠标滚轮敏感度"
          />
          <span class="sensitivity-value">{{ Number(scrollSensitivity).toFixed(1) }}x</span>
        </div>
      </div>
    </div>

    <!-- 仓库列表 -->
    <div class="repositories-container">
      <!-- 左侧导航按钮 -->
      <button 
        v-if="Object.keys(repositories).length > 2"
        class="nav-button nav-left"
        @click="scrollLeft"
        :disabled="scrollPosition <= 0"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41,16.58L10.83,12L15.41,7.42L14,6L8,12L14,18L15.41,16.58Z"/>
        </svg>
      </button>
      
      <div 
        class="repositories-grid" 
        :data-count="Object.keys(repositories).length"
        ref="repositoriesGrid"
        @wheel="handleWheel"
        @scroll="updateScrollPosition"
      >
        <div 
          v-for="(repo, key) in repositories" 
          :key="key"
          class="repository-card"
          @mouseenter="playHoverEffect"
        >
        <!-- 卡片背景效果 -->
        <div class="card-background"></div>
        
        <!-- 仓库图标 -->
        <div class="repo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <!-- 根据仓库类型显示不同图标，默认为GitHub图标 -->
            <path v-if="getRepoIcon(key, repo) === 'frontend'" d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2M6.5,12.5L12,18L17.5,12.5L12,7L6.5,12.5Z"/>
            <path v-else-if="getRepoIcon(key, repo) === 'backend'" d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4A2,2 0 0,0 2,6V16A2,2 0 0,0 4,18H11V20H8V22H16V20H13V18H20Z"/>
            <path v-else-if="getRepoIcon(key, repo) === 'crypto'" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
            <path v-else-if="getRepoIcon(key, repo) === 'mobile'" d="M17,19H7V5H17M17,1H7C5.89,1 5,1.89 5,3V21A2,2 0 0,0 7,23H17A2,2 0 0,0 19,21V3C19,1.89 18.1,1 17,1Z"/>
            <path v-else-if="getRepoIcon(key, repo) === 'api'" d="M8.5,18L11,15.5L9.5,14L6,17.5L9.5,21L11,19.5L8.5,18M15.5,6L13,8.5L14.5,10L18,6.5L14.5,3L13,4.5L15.5,6M21.59,11.59L13.5,19.68L9.83,16L8.42,17.41L13.5,22.5L23,13L21.59,11.59M6.41,2L5,3.41L10.5,8.91L11.91,7.5L6.41,2Z"/>
            <path v-else-if="getRepoIcon(key, repo) === 'docs'" d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            <!-- 默认GitHub图标 - 美观的八角星设计 -->
            <path v-else d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
          </svg>
        </div>

        <!-- 仓库信息 -->
        <div class="repo-content">
          <h4 class="repo-name">{{ repo.name }}</h4>
          <p class="repo-description">{{ repo.description }}</p>
          
          <!-- 标签 -->
          <div class="repo-tags">
            <span 
              v-for="tag in repo.tags" 
              :key="tag"
              class="repo-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 访问按钮 -->
        <div class="repo-action" @click="openRepository(repo.url)">
          <div class="action-button">
            <svg class="action-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
            </svg>
            <span>访问仓库</span>
          </div>
        </div>

        <!-- 悬停效果 -->
        <div class="hover-overlay"></div>
        </div>
      </div>
      
      <!-- 右侧导航按钮 -->
      <button 
        v-if="Object.keys(repositories).length > 2"
        class="nav-button nav-right"
        @click="scrollRight"
        :disabled="scrollPosition >= maxScrollPosition"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59,16.58L13.17,12L8.59,7.42L10,6L16,12L10,18L8.59,16.58Z"/>
        </svg>
      </button>
    </div>

    <!-- 底部提示 -->
    <div class="repositories-footer">
      <p class="footer-text">
        <svg class="footer-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
        点击卡片可直接访问对应的GitHub仓库
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * GitHub仓库展示组件
 * 
 * @description 展示项目相关的GitHub仓库信息，提供美观的卡片式布局和交互效果
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import {nextTick, onMounted, ref} from 'vue'

// 导入GitHub配置
import {getAllRepositories} from '@/config/github'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 是否显示标题
   */
  showTitle: {
    type: Boolean,
    default: true
  },
  /**
   * 自定义样式类名
   */
  customClass: {
    type: String,
    default: ''
  }
})

/**
 * 响应式数据
 */
const repositories = ref({})
const repositoriesGrid = ref(null)
const scrollPosition = ref(0)
const maxScrollPosition = ref(0)

/**
 * 生命周期钩子
 */

/**
 * 组件挂载后初始化仓库数据
 */
onMounted(() => {
  initRepositories()
})

/**
 * 方法定义
 */

/**
 * 初始化仓库数据
 */
const initRepositories = async () => {
  // 直接添加所有仓库，不进行类型过滤
  repositories.value = getAllRepositories()
  // 初始化滚动状态
  await initScrollState()
}

/**
 * 打开GitHub仓库
 * @param {string} url - 仓库URL
 */
const openRepository = (url) => {
  console.log('打开GitHub仓库:', url)
  window.open(url, '_blank', 'noopener,noreferrer')
}

/**
 * 播放悬停效果（音效模拟）
 */
const playHoverEffect = () => {
  console.log('播放悬停效果')
  // 这里可以添加实际的音效或其他反馈效果
}

/**
 * 滚轮敏感度倍数
 * 可以调整这个值来控制滚动敏感度：
 * - 1.0: 正常敏感度
 * - 2.0: 双倍敏感度
 * - 3.0: 最高敏感度（默认）
 * - 0.5: 半倍敏感度
 */
const scrollSensitivity = ref(Number(3.0))

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
const throttle = (func, delay) => {
  let timeoutId
  let lastExecTime = 0
  return function (...args) {
    const currentTime = Date.now()
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func.apply(this, args)
        lastExecTime = Date.now()
      }, delay - (currentTime - lastExecTime))
    }
  }
}

/**
 * 原始滚轮处理函数
 * @param {WheelEvent} event - 滚轮事件
 */
const handleWheelRaw = (event) => {
  event.preventDefault()
  const container = repositoriesGrid.value
  if (container) {
    // 使用可调节的敏感度
    container.scrollLeft += event.deltaY * Number(scrollSensitivity.value)
  }
}

/**
 * 节流后的滚轮处理函数
 */
const handleWheel = throttle(handleWheelRaw, 16)

/**
 * 更新滚动位置
 */
const updateScrollPosition = () => {
  const container = repositoriesGrid.value
  if (container) {
    scrollPosition.value = container.scrollLeft
    maxScrollPosition.value = container.scrollWidth - container.clientWidth
  }
}

/**
 * 向左滚动
 */
const scrollLeft = () => {
  const container = repositoriesGrid.value
  if (container) {
    // 滚动两个卡片的宽度 (280px + 12px gap) * 2
    container.scrollBy({ left: -584, behavior: 'smooth' })
  }
}

/**
 * 向右滚动
 */
const scrollRight = () => {
  const container = repositoriesGrid.value
  if (container) {
    // 滚动两个卡片的宽度 (280px + 12px gap) * 2
    container.scrollBy({ left: 584, behavior: 'smooth' })
  }
}

/**
 * 初始化滚动状态
 */
const initScrollState = async () => {
  await nextTick()
  updateScrollPosition()
}

/**
 * 获取仓库图标类型
 * @param {string} key - 仓库键名
 * @param {Object} repo - 仓库对象
 * @returns {string} 图标类型
 */
const getRepoIcon = (key, repo) => {
  // 如果仓库对象中有icon字段，优先使用
  if (repo.icon) {
    return repo.icon
  }
  
  // 根据键名判断
  if (key.includes('frontend') || key.includes('web') || key.includes('ui')) {
    return 'frontend'
  }
  if (key.includes('backend') || key.includes('server') || key.includes('api')) {
    return 'backend'
  }
  if (key.includes('crypto') || key.includes('security') || key.includes('encrypt')) {
    return 'crypto'
  }
  if (key.includes('mobile') || key.includes('app') || key.includes('android') || key.includes('ios')) {
    return 'mobile'
  }
  if (key.includes('doc') || key.includes('readme') || key.includes('guide')) {
    return 'docs'
  }
  
  // 根据标签判断
  if (repo.tags) {
    const tags = repo.tags.map(tag => tag.toLowerCase())
    if (tags.some(tag => ['vue', 'react', 'angular', 'frontend', 'web', 'ui'].includes(tag))) {
      return 'frontend'
    }
    if (tags.some(tag => ['node', 'express', 'backend', 'server', 'api'].includes(tag))) {
      return 'backend'
    }
    if (tags.some(tag => ['crypto', 'security', 'encryption', 'blockchain'].includes(tag))) {
      return 'crypto'
    }
    if (tags.some(tag => ['mobile', 'android', 'ios', 'react-native', 'flutter'].includes(tag))) {
      return 'mobile'
    }
    if (tags.some(tag => ['docs', 'documentation', 'guide', 'tutorial'].includes(tag))) {
      return 'docs'
    }
  }
  
  // 根据仓库名称判断
  const name = repo.name ? repo.name.toLowerCase() : ''
  if (name.includes('frontend') || name.includes('web') || name.includes('ui')) {
    return 'frontend'
  }
  if (name.includes('backend') || name.includes('server') || name.includes('api')) {
    return 'backend'
  }
  if (name.includes('crypto') || name.includes('security')) {
    return 'crypto'
  }
  if (name.includes('mobile') || name.includes('app')) {
    return 'mobile'
  }
  if (name.includes('doc') || name.includes('guide')) {
    return 'docs'
  }
  
  // 默认返回github图标
  return 'github'
}
</script>

<style scoped>
/**
 * GitHub仓库组件样式
 */
.github-repositories {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/**
 * 标题区域样式
 */
.repositories-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.header-main {
  text-align: center;
}

.repositories-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  position: relative;
}

.title-icon {
  width: 28px;
  height: 28px;
  color: #e74c3c;
  filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3));
  transition: all 0.3s ease;
}

.title-icon:hover {
  color: #3498db;
  transform: rotate(360deg);
}

.repo-count-badge {
  background: linear-gradient(135deg, #e74c3c 0%, #f39c12 25%, #2ecc71 50%, #3498db 75%, #9b59b6 100%);
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: countPulse 2s ease-in-out infinite;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

@keyframes countPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);
  }
}

.repositories-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/**
 * 滚动敏感度控制样式
 */
.scroll-sensitivity-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-width: 200px;
}

.sensitivity-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  cursor: pointer;
  user-select: none;
}

.sensitivity-icon {
  width: 16px;
  height: 16px;
  color: #3498db;
  transition: all 0.3s ease;
}

.sensitivity-label:hover .sensitivity-icon {
  color: #2ecc71;
  transform: rotate(180deg);
}

.sensitivity-slider-container {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.sensitivity-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.3) 100%);
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-appearance: none;
  appearance: none;
}

.sensitivity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.sensitivity-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.6);
}

.sensitivity-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.sensitivity-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.6);
}

.sensitivity-slider:hover {
  background: linear-gradient(90deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.4) 100%);
}

.sensitivity-value {
  font-size: 0.85rem;
  color: #3498db;
  font-weight: 600;
  min-width: 35px;
  text-align: center;
  padding: 2px 6px;
  background: rgba(52, 152, 219, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(52, 152, 219, 0.3);
}

/**
 * 仓库容器布局
 */
.repositories-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

/**
 * 导航按钮样式
 */
.nav-button {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.2) 0%, 
    rgba(255, 255, 255, 0.1) 100%);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.nav-button:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.3) 0%, 
    rgba(255, 255, 255, 0.2) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.nav-button:active:not(:disabled) {
  transform: translateY(0);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button svg {
  width: 20px;
  height: 20px;
}

/**
 * 仓库网格布局
 */
.repositories-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 10px 0;
  scroll-behavior: smooth;
  flex: 1;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.repositories-grid::-webkit-scrollbar {
  display: none;
}

.repositories-grid .repository-card {
  flex: 0 0 280px;
  min-width: 280px;
  max-width: 280px;
}



/**
 * 梦幻仓库卡片样式
 */
.repository-card {
  position: relative;
  background: linear-gradient(135deg, 
    rgba(255, 107, 107, 0.15) 0%,
    rgba(78, 205, 196, 0.15) 25%,
    rgba(69, 183, 209, 0.15) 50%,
    rgba(150, 206, 180, 0.15) 75%,
    rgba(255, 234, 167, 0.15) 100%);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(15px);
  border: 2px solid transparent;
  background-clip: padding-box;
  overflow: hidden;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform-style: preserve-3d;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.repository-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(255, 107, 107, 0.3) 0%,
    rgba(78, 205, 196, 0.3) 25%,
    rgba(69, 183, 209, 0.3) 50%,
    rgba(150, 206, 180, 0.3) 75%,
    rgba(255, 234, 167, 0.3) 100%);
  border-radius: 20px;
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: -1;
}

.repository-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 70%);
  transform: rotate(45deg) translate(-100%, -100%);
  transition: transform 0.6s ease;
  z-index: 1;
  pointer-events: none;
}

.card-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

/**
 * 卡片悬停魔法效果
 */
.repository-card:nth-child(1):hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 25px 50px rgba(231, 76, 60, 0.3),
    0 15px 30px rgba(231, 76, 60, 0.2),
    0 5px 15px rgba(231, 76, 60, 0.1);
  border: 2px solid rgba(231, 76, 60, 0.4);
}

.repository-card:nth-child(2):hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 25px 50px rgba(52, 152, 219, 0.3),
    0 15px 30px rgba(52, 152, 219, 0.2),
    0 5px 15px rgba(52, 152, 219, 0.1);
  border: 2px solid rgba(52, 152, 219, 0.4);
}

.repository-card:nth-child(3):hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 25px 50px rgba(46, 204, 113, 0.3),
    0 15px 30px rgba(46, 204, 113, 0.2),
    0 5px 15px rgba(46, 204, 113, 0.1);
  border: 2px solid rgba(46, 204, 113, 0.4);
}

.repository-card:nth-child(4):hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 25px 50px rgba(155, 89, 182, 0.3),
    0 15px 30px rgba(155, 89, 182, 0.2),
    0 5px 15px rgba(155, 89, 182, 0.1);
  border: 2px solid rgba(155, 89, 182, 0.4);
}

.repository-card:hover {
  transform: translateY(-12px) scale(1.03) rotateX(5deg);
  box-shadow: 
    0 25px 50px rgba(255, 107, 107, 0.2),
    0 15px 30px rgba(78, 205, 196, 0.15),
    0 5px 15px rgba(69, 183, 209, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.repository-card:hover::before {
  opacity: 1;
}

.repository-card:hover::after {
  transform: rotate(45deg) translate(50%, 50%);
}

.repository-card:hover .card-background {
  opacity: 1;
}

/**
 * 梦幻仓库图标样式
 */
.repo-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 15px;
  color: #4ecdc4;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  filter: drop-shadow(0 2px 8px rgba(78, 205, 196, 0.3));
  position: relative;
  z-index: 2;
}

.repository-card:nth-child(1) .repo-icon {
  color: #e74c3c;
  filter: drop-shadow(0 2px 8px rgba(231, 76, 60, 0.3));
}

.repository-card:nth-child(2) .repo-icon {
  color: #3498db;
  filter: drop-shadow(0 2px 8px rgba(52, 152, 219, 0.3));
}

.repository-card:nth-child(3) .repo-icon {
  color: #2ecc71;
  filter: drop-shadow(0 2px 8px rgba(46, 204, 113, 0.3));
}

.repository-card:nth-child(4) .repo-icon {
  color: #9b59b6;
  filter: drop-shadow(0 2px 8px rgba(155, 89, 182, 0.3));
}

.repo-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.repository-card:nth-child(1):hover .repo-icon {
  transform: scale(1.2) rotate(360deg);
  color: #c0392b;
  filter: drop-shadow(0 0 10px rgba(192, 57, 43, 0.5));
}

.repository-card:nth-child(2):hover .repo-icon {
  transform: scale(1.2) rotate(360deg);
  color: #2980b9;
  filter: drop-shadow(0 0 10px rgba(41, 128, 185, 0.5));
}

.repository-card:nth-child(3):hover .repo-icon {
  transform: scale(1.2) rotate(360deg);
  color: #27ae60;
  filter: drop-shadow(0 0 10px rgba(39, 174, 96, 0.5));
}

.repository-card:nth-child(4):hover .repo-icon {
  transform: scale(1.2) rotate(360deg);
  color: #8e44ad;
  filter: drop-shadow(0 0 10px rgba(142, 68, 173, 0.5));
}

.repository-card:hover .repo-icon {
  transform: scale(1.2) rotate(360deg);
  color: #ff6b6b;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.5));
}

/**
 * 梦幻仓库内容样式
 */
.repo-content {
  margin-bottom: 15px;
  flex: 1;
  position: relative;
  z-index: 2;
}

.repo-name {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #4ecdc4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1.3;
  transition: all 0.4s ease;
  position: relative;
}

.repo-name::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  transition: width 0.4s ease;
  border-radius: 1px;
}

.repository-card:hover .repo-name::after {
  width: 100%;
}

.repo-description {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/**
 * 梦幻标签样式
 */
.repo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  position: relative;
  z-index: 2;
}

.repo-tag {
  display: inline-block;
  padding: 4px 10px;
  background: linear-gradient(135deg, 
    rgba(78, 205, 196, 0.3) 0%, 
    rgba(69, 183, 209, 0.3) 100%);
  color: #4ecdc4;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(78, 205, 196, 0.4);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: nowrap;
  backdrop-filter: blur(5px);
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.1);
}

.repository-card:nth-child(1) .repo-tag {
  background: linear-gradient(135deg, 
    rgba(231, 76, 60, 0.3) 0%, 
    rgba(192, 57, 43, 0.3) 100%);
  color: #e74c3c;
  border: 1px solid rgba(231, 76, 60, 0.4);
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.1);
}

.repository-card:nth-child(2) .repo-tag {
  background: linear-gradient(135deg, 
    rgba(52, 152, 219, 0.3) 0%, 
    rgba(41, 128, 185, 0.3) 100%);
  color: #3498db;
  border: 1px solid rgba(52, 152, 219, 0.4);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
}

.repository-card:nth-child(3) .repo-tag {
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.3) 0%, 
    rgba(39, 174, 96, 0.3) 100%);
  color: #2ecc71;
  border: 1px solid rgba(46, 204, 113, 0.4);
  box-shadow: 0 2px 8px rgba(46, 204, 113, 0.1);
}

.repository-card:nth-child(4) .repo-tag {
  background: linear-gradient(135deg, 
    rgba(155, 89, 182, 0.3) 0%, 
    rgba(142, 68, 173, 0.3) 100%);
  color: #9b59b6;
  border: 1px solid rgba(155, 89, 182, 0.4);
  box-shadow: 0 2px 8px rgba(155, 89, 182, 0.1);
}

.repository-card:hover .repo-tag {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.2);
}

.repository-card:nth-child(1):hover .repo-tag {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

.repository-card:nth-child(2):hover .repo-tag {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.repository-card:nth-child(3):hover .repo-tag {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}

.repository-card:nth-child(4):hover .repo-tag {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  transform: scale(1.08) translateY(-1px);
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
}

/**
 * 梦幻操作按钮样式
 */
.repo-action {
  position: relative;
  z-index: 2;
  margin-top: auto;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, 
    rgba(78, 205, 196, 0.3) 0%, 
    rgba(69, 183, 209, 0.3) 100%);
  color: #4ecdc4;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 2px solid rgba(78, 205, 196, 0.4);
  width: 100%;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(78, 205, 196, 0.2);
  position: relative;
  overflow: hidden;
}

.repository-card:nth-child(1) .action-button {
  background: linear-gradient(135deg, 
    rgba(231, 76, 60, 0.3) 0%, 
    rgba(192, 57, 43, 0.3) 100%);
  color: #e74c3c;
  border: 2px solid rgba(231, 76, 60, 0.4);
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
}

.repository-card:nth-child(2) .action-button {
  background: linear-gradient(135deg, 
    rgba(52, 152, 219, 0.3) 0%, 
    rgba(41, 128, 185, 0.3) 100%);
  color: #3498db;
  border: 2px solid rgba(52, 152, 219, 0.4);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
}

.repository-card:nth-child(3) .action-button {
  background: linear-gradient(135deg, 
    rgba(46, 204, 113, 0.3) 0%, 
    rgba(39, 174, 96, 0.3) 100%);
  color: #2ecc71;
  border: 2px solid rgba(46, 204, 113, 0.4);
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.2);
}

.repository-card:nth-child(4) .action-button {
  background: linear-gradient(135deg, 
    rgba(155, 89, 182, 0.3) 0%, 
    rgba(142, 68, 173, 0.3) 100%);
  color: #9b59b6;
  border: 2px solid rgba(155, 89, 182, 0.4);
  box-shadow: 0 4px 15px rgba(155, 89, 182, 0.2);
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.2), 
    transparent);
  transition: left 0.6s ease;
}

.action-button:hover::before {
  left: 100%;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.repository-card:nth-child(1):hover .action-button {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(231, 76, 60, 0.4);
}

.repository-card:nth-child(2):hover .action-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
}

.repository-card:nth-child(3):hover .action-button {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
  border: none;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
}

.repository-card:nth-child(4):hover .action-button {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  color: white;
  border: none;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(155, 89, 182, 0.4);
}

.repository-card:hover .action-button {
  background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
  color: white;
  border: none;
  transform: scale(1.05) translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
}

.repository-card:hover .repo-name {
  color: #ff6b6b;
  text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
}

.repository-card:hover .repo-description {
  color: rgba(255, 255, 255, 0.95);
}

/**
 * 悬停覆盖层
 */
.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(102, 187, 106, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.repository-card:hover .hover-overlay {
  opacity: 1;
}

/**
 * 底部提示样式
 */
.repositories-footer {
  text-align: center;
}

.footer-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.footer-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/**
 * 响应式设计
 */
@media (max-width: 1200px) {
  .repositories-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .github-repositories {
    padding: 12px;
  }
  
  .repositories-grid {
    grid-template-columns: 1fr;
    gap: 10px;
    max-height: 60vh;
  }
  
  .repository-card {
    padding: 14px;
    min-height: 160px;
  }
  
  .repositories-title {
    font-size: 1.4rem;
  }
  
  .repo-name {
    font-size: 0.95rem;
  }
  
  .repo-description {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .github-repositories {
    padding: 8px;
  }
  
  .repository-card {
    padding: 12px;
    min-height: 140px;
  }
  
  .repositories-title {
    font-size: 1.2rem;
  }
  
  .repo-icon {
    width: 28px;
    height: 28px;
  }
  
  .repo-name {
    font-size: 0.9rem;
  }
  
  .repo-description {
    font-size: 0.7rem;
  }
}

/* 动态网格布局 - 根据仓库数量调整 */
.repositories-grid[data-count="1"] {
  grid-template-columns: 1fr;
  max-width: 400px;
  margin: 0 auto;
}

.repositories-grid[data-count="2"] {
  grid-template-columns: repeat(2, 1fr);
}

.repositories-grid[data-count="3"] {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.repositories-grid[data-count="4"] {
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 1024px) {
  .repositories-grid[data-count="4"] {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .repositories-grid[data-count="5"], 
  .repositories-grid[data-count="6"] {
    grid-template-columns: repeat(3, 1fr);
  }
}
/**
 * 梦幻动画效果
 */
@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes iconSpin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/**
 * 卡片加载动画
 */
.repository-card {
  animation: cardFloat 6s ease-in-out infinite;
}

.repository-card:nth-child(1) {
  animation-delay: 0s;
}

.repository-card:nth-child(2) {
  animation-delay: 0.5s;
}

.repository-card:nth-child(3) {
  animation-delay: 1s;
}

.repository-card:nth-child(4) {
  animation-delay: 1.5s;
}

/**
 * 图标脉冲效果
 */
.repo-icon {
  animation: pulse 3s ease-in-out infinite;
}

/**
 * 按钮闪光效果
 */
.action-button {
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

/**
 * 标签呼吸效果
 */
.repo-tag:nth-child(odd) {
  animation: pulse 4s ease-in-out infinite;
}

.repo-tag:nth-child(even) {
  animation: pulse 4s ease-in-out infinite reverse;
}

/**
 * 禁用动画的媒体查询（为了性能考虑）
 */
@media (prefers-reduced-motion: reduce) {
  .repository-card,
  .repo-icon,
  .action-button,
  .repo-tag {
    animation: none;
  }
}

</style>