<template>
  <!-- 认证加载遮罩层 -->
  <Transition name="auth-loading" appear>
    <div v-show="visible" class="auth-loading-overlay">
      <div class="auth-loading-container">
      <!-- 主要loading动画 -->
      <div class="loading-animation">
        <!-- 外圈旋转环 -->
        <div class="outer-ring">
          <div class="ring-segment" v-for="i in 8" :key="i" :style="{ '--delay': i * 0.1 + 's' }"></div>
        </div>
        
        <!-- 中心脉动圆 -->
        <div class="center-pulse">
          <div class="pulse-dot"></div>
          <div class="pulse-wave" v-for="i in 3" :key="i" :style="{ '--wave-delay': i * 0.6 + 's' }"></div>
        </div>
        
        <!-- 安全锁图标 -->
        <div class="security-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
          </svg>
        </div>
      </div>
      
      <!-- 加载文本 -->
      <div class="loading-text">
        <h3 class="loading-title">{{ title }}</h3>
        <p class="loading-message">{{ message }}</p>
        
        <!-- 进度点 -->
        <div class="progress-dots">
          <span class="dot" v-for="i in 3" :key="i" :style="{ '--dot-delay': i * 0.3 + 's' }"></span>
        </div>
      </div>
      
      <!-- 装饰性粒子 -->
      <div class="particles">
        <div 
          class="particle" 
          v-for="i in 12" 
          :key="i" 
          :style="{ 
            '--particle-delay': Math.random() * 2 + 's',
            '--particle-duration': (Math.random() * 3 + 2) + 's',
            '--particle-x': Math.random() * 100 + '%',
            '--particle-y': Math.random() * 100 + '%'
          }"
        ></div>
      </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
/**
 * 认证加载动画组件
 * 
 * @description 用于登录验证过程中显示的创意loading效果
 * @author ECC Team
 * @version 1.0.0
 */

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 是否显示loading
   */
  visible: {
    type: Boolean,
    default: false
  },
  /**
   * 加载标题
   */
  title: {
    type: String,
    default: '身份验证中'
  },
  /**
   * 加载消息
   */
  message: {
    type: String,
    default: '正在验证您的登录状态，请稍候...'
  }
})
</script>

<style scoped>
.auth-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

.auth-loading-container {
  position: relative;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.5s ease-out;
}

/* 主要loading动画 */
.loading-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

/* 外圈旋转环 */
.outer-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.ring-segment {
  position: absolute;
  width: 6px;
  height: 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 3px;
  top: 0;
  left: 50%;
  transform-origin: 3px 60px;
  transform: translateX(-50%) rotate(calc(var(--delay) * 45deg));
  animation: pulse 1.6s ease-in-out infinite;
  animation-delay: var(--delay);
}

/* 中心脉动圆 */
.center-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
}

.pulse-dot {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: centerPulse 1.5s ease-in-out infinite;
}

.pulse-wave {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 50%;
  animation: waveExpand 1.8s ease-out infinite;
  animation-delay: var(--wave-delay);
}

/* 安全锁图标 */
.security-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  color: white;
  z-index: 10;
  animation: iconFloat 2s ease-in-out infinite;
}

.security-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 加载文本 */
.loading-text {
  margin-bottom: 20px;
}

.loading-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
  animation: textGlow 2s ease-in-out infinite;
}

.loading-message {
  font-size: 0.95rem;
  color: #718096;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

/* 进度点 */
.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite;
  animation-delay: var(--dot-delay);
}

/* 装饰性粒子 */
.particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  border-radius: 20px;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(102, 126, 234, 0.6);
  border-radius: 50%;
  animation: particleFloat var(--particle-duration) ease-in-out infinite;
  animation-delay: var(--particle-delay);
  left: var(--particle-x);
  top: var(--particle-y);
}

/* 动画定义 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: translateX(-50%) rotate(calc(var(--delay) * 45deg)) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) rotate(calc(var(--delay) * 45deg)) scale(1.2);
  }
}

@keyframes centerPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.7;
  }
}

@keyframes waveExpand {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
  }
  100% {
    width: 60px;
    height: 60px;
    opacity: 0;
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translate(-50%, -50%) translateY(0);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-3px);
  }
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(102, 126, 234, 0.6);
  }
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes particleFloat {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0;
  }
}

/* 过渡动画 */
.auth-loading-enter-active {
  transition: opacity 0.3s ease-out;
}

.auth-loading-leave-active {
  transition: opacity 0.25s ease-in;
}

.auth-loading-enter-from,
.auth-loading-leave-to {
  opacity: 0;
}

.auth-loading-enter-active .auth-loading-container {
  animation: slideUp 0.5s ease-out;
}

.auth-loading-leave-active .auth-loading-container {
  animation: slideDown 0.25s ease-in;
}

@keyframes slideDown {
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(20px) scale(0.95);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .auth-loading-container {
    padding: 30px 20px;
    margin: 20px;
  }
  
  .loading-animation {
    width: 100px;
    height: 100px;
  }
  
  .loading-title {
    font-size: 1.3rem;
  }
  
  .loading-message {
    font-size: 0.9rem;
  }
}
</style>