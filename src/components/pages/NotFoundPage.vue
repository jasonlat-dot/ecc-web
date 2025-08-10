<template>
  <div class="not-found-page" @mousemove="handleMouseMove">
    <!-- 星空背景 -->
    <div class="stars-background">
      <div class="stars" ref="starsContainer"></div>
    </div>
    
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
        <div class="shape shape-6"></div>
        <div class="shape shape-7"></div>
      </div>
      <!-- 添加云朵装饰 -->
      <div class="clouds">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
    </div>

    <!-- 主要内容 -->
    <div class="content-container">
      <!-- 左右布局容器 -->
      <div class="content-layout">
        <!-- 左侧：GitHub仓库信息 -->
         <div class="left-section">
           <div class="github-section">
             <GitHubRepositories :show-title="true" />
           </div>
         </div>
 
         <!-- 右侧：404猫咪区域 -->
         <div class="right-section">
           <!-- 404标题 -->
           <div class="error-code">
             <span class="digit digit-4-1">4</span>
             <div class="digit-0-container">
               <!-- 可爱的小猫咪作为0 -->
               <div class="cat-container">
                 <div class="cat">
                   <div class="cat-head">
                     <div class="cat-ears">
                       <div class="ear ear-left"></div>
                       <div class="ear ear-right"></div>
                     </div>
                     <div class="cat-face">
                       <div class="eyes">
                         <div class="eye eye-left">
                           <div class="pupil"></div>
                         </div>
                         <div class="eye eye-right">
                           <div class="pupil"></div>
                         </div>
                       </div>
                       <div class="nose"></div>
                       <div class="mouth">
                         <div class="mouth-line mouth-left"></div>
                         <div class="mouth-line mouth-right"></div>
                       </div>
                       <div class="whiskers">
                         <div class="whisker whisker-left-1"></div>
                         <div class="whisker whisker-left-2"></div>
                         <div class="whisker whisker-right-1"></div>
                         <div class="whisker whisker-right-2"></div>
                       </div>
                     </div>
                   </div>
                   <div class="cat-body">
                     <div class="paws">
                       <div class="paw paw-left"></div>
                       <div class="paw paw-right"></div>
                     </div>
                   </div>
                   <div class="cat-tail"></div>
                 </div>
               </div>
             </div>
             <span class="digit digit-4-2">4</span>
           </div>
 
           <!-- 第一行：页面走丢了 -->
             <div class="title-section">
               <h1 class="title" ref="titleRef">页面走丢了</h1>
             </div>
           
           <!-- 错误信息 -->
           <div class="error-message">
             <!-- 中间：描述文字和进度条 -->
             <div class="content-section">
               <div class="description-section">
                 <p class="description-line">哎呀！您访问的页面似乎不存在，</p>
                 <p class="typing-line">
                   <span class="typing-text" ref="typingText">小猫咪正在努力寻找中...</span>
                 </p>
               </div>
               
               <!-- 下方：进度条 -->
               <div class="search-progress">
                 <div class="progress-bar">
                   <div class="progress-fill" ref="progressFill"></div>
                 </div>
                 <div class="progress-text">搜索进度: <span ref="progressText">0%</span></div>
               </div>
             </div>
           </div>
 
           <!-- 操作按钮 -->
           <div class="action-buttons">
             <button class="btn btn-primary" @click="goToLogin" @mouseenter="playHoverSound">
               <div class="btn-ripple"></div>
               <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"/>
               </svg>
               <span class="btn-text">前往登录</span>
               <div class="btn-glow"></div>
             </button>
             <button class="btn btn-secondary" @click="goToHome" @mouseenter="playHoverSound">
               <div class="btn-ripple"></div>
               <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
               </svg>
               <span class="btn-text">返回首页</span>
               <div class="btn-glow"></div>
             </button>
             <!-- 添加刷新按钮 -->
             <button class="btn btn-refresh" @click="refreshPage" @mouseenter="playHoverSound">
               <div class="btn-ripple"></div>
               <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
               </svg>
               <span class="btn-text">刷新页面</span>
               <div class="btn-glow"></div>
             </button>
           </div>
 
           <!-- 小提示 -->
           <div class="tips">
             <div class="tip-item">
               <span>检查URL是否正确</span>
             </div>
             <div class="tip-item">
               <svg class="tip-icon" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
               </svg>
               <span>尝试从首页重新导航</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 404错误页面组件
 * 
 * @description 当用户访问不存在的路由时显示的错误页面，包含可爱的动漫小猫咪动画效果和丰富的交互体验
 * @author ECC Team
 * @version 2.0.0
 */

// Vue 3 Composition API
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// 导入GitHub仓库组件
import GitHubRepositories from '@/components/common/GitHubRepositories.vue'

/**
 * 路由实例
 */
const router = useRouter()

/**
 * 模板引用
 */
const starsContainer = ref(null)
const titleRef = ref(null)
const typingText = ref(null)
const progressFill = ref(null)
const progressText = ref(null)

/**
 * 响应式数据
 */
const mousePosition = ref({ x: 0, y: 0 })
const searchProgress = ref(0)
const typingIndex = ref(0)
const typingContent = '小猫咪正在努力寻找中...'
let typingTimer = null
let progressTimer = null
let starsAnimationId = null

/**
 * 生命周期钩子
 */

/**
 * 组件挂载后初始化动画效果
 */
onMounted(() => {
  initStars()
  startTypingAnimation()
  startProgressAnimation()
  addTitleShakeEffect()
})

/**
 * 组件卸载前清理定时器和动画
 */
onUnmounted(() => {
  if (typingTimer) clearInterval(typingTimer)
  if (progressTimer) clearInterval(progressTimer)
  if (starsAnimationId) cancelAnimationFrame(starsAnimationId)
})

/**
 * 动画和效果方法
 */

/**
 * 初始化星空背景
 */
const initStars = () => {
  if (!starsContainer.value) return
  
  const container = starsContainer.value
  const starCount = 100
  
  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = Math.random() * 100 + '%'
    star.style.top = Math.random() * 100 + '%'
    star.style.animationDelay = Math.random() * 3 + 's'
    star.style.animationDuration = (Math.random() * 3 + 2) + 's'
    container.appendChild(star)
  }
}

/**
 * 开始打字动画效果
 */
const startTypingAnimation = () => {
  if (!typingText.value) return
  
  typingText.value.textContent = ''
  typingIndex.value = 0
  
  typingTimer = setInterval(() => {
    if (typingIndex.value < typingContent.length) {
      typingText.value.textContent += typingContent[typingIndex.value]
      typingIndex.value++
    } else {
      clearInterval(typingTimer)
      // 打字完成后添加闪烁光标
      typingText.value.classList.add('typing-complete')
    }
  }, 100)
}

/**
 * 开始搜索进度动画
 */
const startProgressAnimation = () => {
  if (!progressFill.value || !progressText.value) return
  
  progressTimer = setInterval(() => {
    if (searchProgress.value < 100) {
      searchProgress.value += Math.random() * 3 + 1
      if (searchProgress.value > 100) searchProgress.value = 100
      
      progressFill.value.style.width = searchProgress.value + '%'
      progressText.value.textContent = Math.floor(searchProgress.value) + '%'
      
      if (searchProgress.value >= 100) {
        clearInterval(progressTimer)
        // 搜索完成后重置并重新开始
        setTimeout(() => {
          searchProgress.value = 0
          startProgressAnimation()
        }, 2000)
      }
    }
  }, 200)
}

/**
 * 添加标题震动效果
 */
const addTitleShakeEffect = () => {
  if (!titleRef.value) return
  
  setInterval(() => {
    titleRef.value.classList.add('shake')
    setTimeout(() => {
      titleRef.value.classList.remove('shake')
    }, 500)
  }, 5000)
}

/**
 * 事件处理方法
 */

/**
 * 处理鼠标移动事件，实现视差效果
 */
const handleMouseMove = (event) => {
  const { clientX, clientY } = event
  const { innerWidth, innerHeight } = window
  
  mousePosition.value = {
    x: (clientX / innerWidth - 0.5) * 20,
    y: (clientY / innerHeight - 0.5) * 20
  }
  
  // 应用视差效果到背景元素
  const shapes = document.querySelectorAll('.shape')
  shapes.forEach((shape, index) => {
    const speed = (index + 1) * 0.5
    shape.style.transform = `translate(${mousePosition.value.x * speed}px, ${mousePosition.value.y * speed}px)`
  })
}

/**
 * 播放悬停音效（模拟）
 */
const playHoverSound = () => {
  // 这里可以添加实际的音效播放逻辑
  console.log('播放悬停音效')
}

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  console.log('跳转到登录页面')
  // 添加页面切换动画
  document.body.style.transition = 'opacity 0.3s ease'
  document.body.style.opacity = '0'
  setTimeout(() => {
    router.push('/login')
  }, 300)
}

/**
 * 跳转到首页
 */
const goToHome = () => {
  console.log('跳转到首页')
  // 添加页面切换动画
  document.body.style.transition = 'opacity 0.3s ease'
  document.body.style.opacity = '0'
  setTimeout(() => {
    router.push('/project-intro')
  }, 300)
}

/**
 * 刷新页面
 */
const refreshPage = () => {
  console.log('刷新页面')
  // 添加刷新动画效果
  const refreshBtn = event.target.closest('.btn-refresh')
  refreshBtn.classList.add('refreshing')
  
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
</script>

<style scoped>
/**
 * 404页面样式
 */
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: relative;
  overflow: hidden;
  font-family: 'Arial', sans-serif;
}

/**
 * 星空背景
 */
.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.stars {
  position: relative;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle linear infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/**
 * 背景装饰
 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  bottom: 15%;
  left: 5%;
  animation-delay: 2s;
}

.shape-4 {
  width: 40px;
  height: 40px;
  bottom: 25%;
  right: 10%;
  animation-delay: 3s;
}

.shape-5 {
  width: 70px;
  height: 70px;
  top: 50%;
  left: 50%;
  animation-delay: 4s;
}

.shape-6 {
  width: 50px;
  height: 50px;
  top: 70%;
  left: 80%;
  animation-delay: 5s;
}

.shape-7 {
  width: 90px;
  height: 90px;
  top: 30%;
  left: 70%;
  animation-delay: 6s;
}

/**
 * 云朵装饰
 */
.clouds {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  animation: cloudFloat 20s ease-in-out infinite;
}

.cloud::before,
.cloud::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
}

.cloud-1 {
  width: 80px;
  height: 30px;
  top: 20%;
  left: -100px;
  animation-duration: 25s;
}

.cloud-1::before {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 10px;
}

.cloud-1::after {
  width: 60px;
  height: 40px;
  top: -15px;
  right: 10px;
}

.cloud-2 {
  width: 60px;
  height: 25px;
  top: 60%;
  left: -80px;
  animation-duration: 30s;
  animation-delay: 5s;
}

.cloud-2::before {
  width: 40px;
  height: 40px;
  top: -20px;
  left: 8px;
}

.cloud-2::after {
  width: 50px;
  height: 35px;
  top: -12px;
  right: 8px;
}

.cloud-3 {
  width: 100px;
  height: 35px;
  top: 40%;
  left: -120px;
  animation-duration: 35s;
  animation-delay: 10s;
}

.cloud-3::before {
  width: 60px;
  height: 60px;
  top: -30px;
  left: 15px;
}

.cloud-3::after {
  width: 70px;
  height: 50px;
  top: -20px;
  right: 15px;
}

@keyframes cloudFloat {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(100vw + 200px));
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/**
 * 主要内容容器
 */
.content-container {
  text-align: center;
  z-index: 10;
  position: relative;
  max-width: 1200px;
  padding: 20px;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/**
 * 左右布局容器
 */
.content-layout {
  display: flex;
  gap: 30px;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
}

/**
 * 左侧区域（GitHub仓库）
 */
.left-section {
  flex: 1.4;
  max-width: 650px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
}

/**
 * 右侧区域（404猫咪）
 */
.right-section {
  flex: 0.8;
  max-width: 450px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin-left: 80px;
  padding-right: 20px;
}

/**
 * 404错误代码样式
 */
.error-code {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  gap: 20px;
}

.digit {
  font-size: 8rem;
  font-weight: bold;
  color: white;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  animation: bounce 2s ease-in-out infinite;
}

.digit-4-1 {
  animation-delay: 0s;
}

.digit-4-2 {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/**
 * 小猫咪容器（作为0）
 */
.digit-0-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
}

.cat-container {
  position: relative;
  animation: catBounce 3s ease-in-out infinite;
}

@keyframes catBounce {
  0%, 100% {
    transform: translateY(0) rotate(-5deg);
  }
  50% {
    transform: translateY(-15px) rotate(5deg);
  }
}

/**
 * 小猫咪样式
 */
.cat {
  position: relative;
  width: 80px;
  height: 80px;
}

.cat-head {
  position: relative;
  width: 60px;
  height: 50px;
  background: #ff9500;
  border-radius: 50% 50% 40% 40%;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.cat-ears {
  position: absolute;
  top: -15px;
  width: 100%;
}

.ear {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #ff9500;
  border-radius: 50% 50% 0 0;
  transform: rotate(-30deg);
}

.ear-left {
  left: 5px;
  animation: earWiggle 4s ease-in-out infinite;
}

.ear-right {
  right: 5px;
  transform: rotate(30deg);
  animation: earWiggle 4s ease-in-out infinite reverse;
}

@keyframes earWiggle {
  0%, 100% {
    transform: rotate(-30deg);
  }
  50% {
    transform: rotate(-20deg);
  }
}

.cat-face {
  position: relative;
  padding-top: 15px;
}

.eyes {
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  margin-bottom: 8px;
}

.eye {
  width: 8px;
  height: 8px;
  background: #333;
  border-radius: 50%;
  position: relative;
  animation: blink 3s ease-in-out infinite;
}

@keyframes blink {
  0%, 90%, 100% {
    transform: scaleY(1);
  }
  95% {
    transform: scaleY(0.1);
  }
}

.pupil {
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
}

.nose {
  width: 6px;
  height: 4px;
  background: #ff6b6b;
  border-radius: 50%;
  margin: 0 auto 4px;
}

.mouth {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.mouth-line {
  width: 8px;
  height: 2px;
  background: #333;
  border-radius: 0 0 50% 50%;
}

.whiskers {
  position: absolute;
  top: 20px;
  width: 100%;
}

.whisker {
  position: absolute;
  width: 15px;
  height: 1px;
  background: #333;
  border-radius: 1px;
}

.whisker-left-1 {
  left: -10px;
  top: 0;
  transform: rotate(-10deg);
}

.whisker-left-2 {
  left: -8px;
  top: 6px;
  transform: rotate(10deg);
}

.whisker-right-1 {
  right: -10px;
  top: 0;
  transform: rotate(10deg);
}

.whisker-right-2 {
  right: -8px;
  top: 6px;
  transform: rotate(-10deg);
}

.cat-body {
  width: 40px;
  height: 30px;
  background: #ff9500;
  border-radius: 50%;
  margin: 5px auto 0;
  position: relative;
}

.paws {
  position: absolute;
  bottom: -8px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
}

.paw {
  width: 8px;
  height: 8px;
  background: #ff9500;
  border-radius: 50%;
}

.cat-tail {
  position: absolute;
  right: -15px;
  top: 35px;
  width: 20px;
  height: 4px;
  background: #ff9500;
  border-radius: 2px;
  transform-origin: left center;
  animation: tailWag 2s ease-in-out infinite;
}

@keyframes tailWag {
  0%, 100% {
    transform: rotate(-20deg);
  }
  50% {
    transform: rotate(20deg);
  }
}

/**
 * 错误信息样式
 */
.error-message {
  margin-bottom: 40px;
  z-index: 10;
  position: relative;
  max-width: none;
  text-align: left;
  margin-top: 0;
}

.error-message::before {
  content: '⚠';
  font-size: 2.5rem;
  background: linear-gradient(45deg, #ff6b6b, #ffa500, #ff6b6b);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: absolute;
  top: -60px;
  left: -40px;
  opacity: 0.95;
  filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.6));
  animation: warningPulse 2s ease-in-out infinite, warningGlow 3s ease-in-out infinite alternate;
  transform-origin: center;
  z-index: 15;
}

@keyframes warningPulse {
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.95;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    opacity: 1;
  }
}

@keyframes warningGlow {
  0% {
    filter: drop-shadow(0 0 10px rgba(255, 107, 107, 0.6));
    background-position: 0% 50%;
  }
  100% {
    filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.8));
    background-position: 100% 50%;
  }
}

/**
 * 标题区域样式
 */
.title-section {
  margin-bottom: 16px;
}

.title {
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0;
  margin-top: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  line-height: 1.2;
  text-align: left;
}

.title.shake {
  animation: titleShake 0.5s ease-in-out;
}

@keyframes titleShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/**
 * 内容区域样式
 */
.content-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/**
 * 描述文字区域样式
 */
.description-section {
  margin-bottom: 0;
  text-align: left;
}

.description-line {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin-bottom: 8px;
  max-width: 300px;
}

.typing-line {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin-bottom: 0;
  max-width: 300px;
}

.typing-text {
  position: relative;
  display: inline-block;
}

.typing-text.typing-complete::after {
  content: '|';
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/**
 * 搜索进度条样式
 */
.search-progress {
  margin-top: 0;
  text-align: left;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin: 0 auto 10px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #81C784);
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  animation: progressShine 2s ease-in-out infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

/**
 * 操作按钮样式
 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: nowrap;
  z-index: 10;
  position: relative;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  min-width: 150px;
  flex: 1;
  max-width: 180px;
  justify-content: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.btn-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.btn-text {
  transition: transform 0.3s ease;
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn:hover .btn-ripple {
  width: 100px;
  height: 100px;
}

.btn:hover .btn-icon {
  transform: scale(1.1) rotate(5deg);
}

.btn:hover .btn-text {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.btn-primary .btn-glow {
  background: linear-gradient(135deg, #66BB6A, #4CAF50);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.btn-primary:hover .btn-glow {
  opacity: 1;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
}

.btn-secondary .btn-glow {
  background: rgba(255, 255, 255, 0.25);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover .btn-glow {
  opacity: 1;
}

.btn-refresh {
  background: linear-gradient(135deg, #FF9800, #F57C00);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.btn-refresh .btn-glow {
  background: linear-gradient(135deg, #FFB74D, #FF9800);
}

.btn-refresh:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255, 152, 0, 0.4);
}

.btn-refresh:hover .btn-glow {
  opacity: 1;
}

.btn-refresh.refreshing .btn-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/**
 * GitHub仓库区域样式
 */
.github-section {
  padding: 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  height: fit-content;
  min-height: 400px;
}

.github-section:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

/* 在左侧布局时的特殊样式 */
.left-section .github-section {
  margin-top: 0;
  width: 100%;
  max-width: none;
}

/**
 * 小提示样式
 */
.tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.tip-icon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
}

/**
 * 响应式设计
 */
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }
  
  .left-section,
  .right-section {
    max-width: 600px;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .error-code {
    flex-direction: column;
    gap: 10px;
  }
  
  .digit {
    font-size: 4rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .action-buttons {
    gap: 8px;
    flex-wrap: nowrap;
  }
  
  .btn {
    min-width: 130px;
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  .content-container {
    padding: 20px 15px;
  }
  
  .content-layout {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .digit {
    font-size: 3rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .description {
    font-size: 1rem;
  }
  
  .action-buttons {
    gap: 6px;
  }
  
  .btn {
    min-width: 110px;
    padding: 8px 12px;
    font-size: 0.8rem;
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
  }
}
</style>