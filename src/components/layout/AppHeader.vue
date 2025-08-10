<template>
  <!-- 头部Logo区域组件 -->
  <div class="header-section">
    <div class="logo-container">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        </svg>
      </div>
      <h1 class="logo-text">{{ title }}</h1>
    </div>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
/**
 * 应用头部组件
 * 
 * @description 显示应用的Logo、标题和副标题
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { defineProps } from 'vue'

/**
 * 组件属性定义
 */
const props = defineProps({
  /**
   * 应用标题
   * @type {String}
   * @default 'SecureAuth'
   */
  title: {
    type: String,
    default: 'SecureAuth'
  },
  
  /**
   * 应用副标题
   * @type {String}
   * @default '基于ECC椭圆曲线加密的安全认证系统'
   */
  subtitle: {
    type: String,
    default: '基于ECC椭圆曲线加密的安全认证系统'
  }
})
</script>

<style scoped>
/**
 * 头部区域样式
 */
.header-section {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 40px;
}

/**
 * Logo容器样式
 */
.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

/**
 * Logo图标样式
 */
.logo-icon {
  width: 48px;
  height: 48px;
  margin-right: 16px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.logo-icon svg {
  width: 28px;
  height: 28px;
}

/**
 * Logo文字样式
 */
.logo-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/**
 * 副标题样式
 */
.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/**
 * 响应式设计
 */
@media (max-width: 768px) {
  .header-section {
    padding-top: 20px;
    margin-bottom: 24px;
  }
  
  .logo-text {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .logo-container {
    flex-direction: column;
    gap: 8px;
  }
  
  .logo-icon {
    margin-right: 0;
  }
}
</style>