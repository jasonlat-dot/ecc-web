<template>
  <div id="app">
    <!-- 背景装饰组件 -->
    <BackgroundDecoration />

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 头部区域 -->
      <header class="header-section">
        <div class="logo-area">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.33 7 14.67 7.33 15.67 8.17C16.67 9 17.33 10.17 17.33 11.5C17.33 12.83 16.67 14 15.67 14.83C14.67 15.67 13.33 16 12 16C10.67 16 9.33 15.67 8.33 14.83C7.33 14 6.67 12.83 6.67 11.5C6.67 10.17 7.33 9 8.33 8.17C9.33 7.33 10.67 7 12 7Z"/>
            </svg>
          </div>
          <h1 class="brand-title">SecureAuth ECC Demo</h1>
          <p class="brand-subtitle">基于椭圆曲线加密的安全认证演示系统</p>
        </div>
        
        <!-- 导航按钮 -->
        <div class="nav-buttons">
          <button class="nav-btn primary" @click="goToRegister">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"/>
            </svg>
            用户注册
          </button>
          <button class="nav-btn secondary" @click="goToLogin">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M10,17V14H3V10H10V7L15,12L10,17M10,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H10A2,2 0 0,1 8,20V18H10V20H19V4H10V6H8V4A2,2 0 0,1 10,2Z"/>
            </svg>
            用户登录
          </button>
          <button class="nav-btn info" @click="goToNotification">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
            </svg>
            通知演示
          </button>
          <button class="nav-btn test" @click="goToApiTest">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
            </svg>
            API测试
          </button>
        </div>
      </header>

      <!-- 项目介绍区域 -->
      <section class="intro-section">
        <div class="intro-content">
          <h2 class="section-title">项目简介</h2>
          <p class="section-description">展示椭圆曲线加密(ECC)在现代Web应用中的实际应用</p>
          
          <div class="intro-text">
            <p>本项目是一个完整的安全认证演示系统，通过Vue.js前端和Spring Boot后端的结合，实现了基于椭圆曲线加密算法的用户认证流程。</p>
            <p>系统包含用户注册、登录验证、实时通知等核心功能，展示了现代密码学在Web应用中的最佳实践。</p>
          </div>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
                </svg>
              </div>
              <h3>椭圆曲线加密</h3>
              <p>采用ECC算法保护用户数据，提供银行级别的安全保障</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                </svg>
              </div>
              <h3>现代化界面</h3>
              <p>基于Vue.js 3构建的响应式用户界面，支持多设备访问</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19Z"/>
                </svg>
              </div>
              <h3>实时通知</h3>
              <p>集成实时通知系统，提供即时的用户反馈和状态更新</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15,18V16H6V18H15M18,14V12H6V14H18Z"/>
                </svg>
              </div>
              <h3>完整文档</h3>
              <p>提供详细的API文档和使用说明，便于学习和二次开发</p>
            </div>
          </div>
        </div>
      </section>

      <!-- GitHub仓库链接区域 -->
      <section class="github-section">
        <div class="github-content">
          <h2 class="section-title">相关仓库</h2>
          <p class="section-description">项目的各个组件都托管在GitHub上，便于学习和贡献</p>
          
          <div class="github-layout">
            <!-- 前端项目仓库 -->
            <div class="github-card">
              <div class="card-header">
                <div class="github-icon frontend">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                  </svg>
                </div>
                <div class="card-badge">Frontend</div>
              </div>
              <h3>前端项目仓库</h3>
              <p>Vue 3 + ECC加密的前端演示项目，采用现代化的组件设计和响应式布局</p>
              <div class="tech-tags">
                <span class="tech-tag">Vue 3</span>
                <span class="tech-tag">ECC加密</span>
                <span class="tech-tag">响应式</span>
              </div>
              <div class="github-link-placeholder">
                <a :href="githubRepositories.frontend.url" target="_blank" class="github-link">
                  <span class="link-icon">🔗</span>
                  <span class="link-text">{{ githubRepositories.frontend.name }}</span>
                </a>
              </div>
            </div>
            
            <!-- 后端服务仓库 -->
            <div class="github-card">
              <div class="card-header">
                <div class="github-icon backend">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z"/>
                  </svg>
                </div>
                <div class="card-badge">Backend</div>
              </div>
              <h3>后端服务仓库</h3>
              <p>配套的后端API服务，处理ECC加密数据，提供完整的用户认证和数据管理</p>
              <div class="tech-tags">
                <span class="tech-tag">Spring Boot</span>
                <span class="tech-tag">RESTful API</span>
                <span class="tech-tag">MySQL</span>
              </div>
              <div class="github-link-placeholder">
                <a :href="githubRepositories.backend.url" target="_blank" class="github-link">
                  <span class="link-icon">🔗</span>
                  <span class="link-text">{{ githubRepositories.backend.name }}</span>
                </a>
              </div>
            </div>
            
            <!-- ECC加密库仓库 -->
            <div class="github-card">
              <div class="card-header">
                <div class="github-icon crypto">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
                  </svg>
                </div>
                <div class="card-badge">Crypto</div>
              </div>
              <h3>ECC加密库</h3>
              <p>Java实现的ECC椭圆曲线加密JAR包，提供安全可靠的加密解密功能</p>
              <div class="tech-tags">
                <span class="tech-tag">Java</span>
                <span class="tech-tag">ECC</span>
                <span class="tech-tag">secp256k1</span>
              </div>
              <div class="github-link-placeholder">
                <a :href="githubRepositories.crypto.url" target="_blank" class="github-link">
                  <span class="link-icon">🔗</span>
                  <span class="link-text">{{ githubRepositories.crypto.name }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 技术栈区域 -->
      <section class="tech-section">
        <div class="tech-content">
          <h2 class="section-title">技术栈</h2>
          <p class="section-description">采用现代化的技术栈，确保系统的性能和可维护性</p>
          
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-label">前端框架</span>
              <span class="tech-value">Vue 3 + Composition API</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">加密算法</span>
              <span class="tech-value">ECC椭圆曲线加密 (secp256k1)</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">UI组件</span>
              <span class="tech-value">自定义组件 + CSS3动画</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">构建工具</span>
              <span class="tech-value">Vue CLI + Webpack</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">后端语言</span>
              <span class="tech-value">Java + Spring Boot</span>
            </div>
            <div class="tech-item">
              <span class="tech-label">数据传输</span>
              <span class="tech-value">HTTPS + ECC加密</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
/**
 * 主应用组件 - 项目介绍页面
 * 
 * @description 展示ECC加密演示项目的介绍、功能特性和相关仓库链接
 * @author ECC Team
 * @version 1.0.0
 */

// Vue 3 Composition API
import { useRouter } from 'vue-router'

// 导入样式
import './styles/app.css'

// 导入组件
import BackgroundDecoration from './components/layout/BackgroundDecoration.vue'

// 导入GitHub配置
import { githubRepositories } from './config/github.js'

// 路由实例
const router = useRouter()

/**
 * 导航方法
 */

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push('/register')
}

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push('/login')
}

/**
 * 跳转到通知演示页面
 */
const goToNotification = () => {
  router.push('/notification')
}

/**
 * 跳转到API测试页面
 */
const goToApiTest = () => {
  // 直接跳转到API测试页面，登录检查在页面内部进行
  router.push('/api-test')
}


</script>

<style scoped>
/**
 * 项目介绍页面样式
 */
#app {
  min-height: 100vh;
  height: auto;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.main-container {
  position: relative;
  z-index: 2;
  min-height: 150vh;
  padding: 20px;
  width: 100%;
}

/**
 * 头部区域样式
 */
.header-section {
  text-align: center;
  padding: 60px 20px 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-area {
  margin-bottom: 40px;
}

.logo-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.logo-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.brand-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin: 0 0 12px 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 40px 0;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/**
 * 导航按钮样式
 */
.nav-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  min-width: 140px;
  justify-content: center;
}

.nav-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.nav-btn.primary {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
}

.nav-btn.primary:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.nav-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.nav-btn.info {
  background: rgba(255, 107, 53, 0.9);
  color: white;
}

.nav-btn.info:hover {
  background: #ff6b35;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
}

.nav-btn.test {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.nav-btn.test:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.nav-btn:hover svg {
  transform: scale(1.1);
}

/**
 * 内容区域样式
 */
.intro-section,
.github-section,
.tech-section {
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.95);
  margin: 20px auto;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 1240px;
  width: 100%;
}

.intro-section {
  background: white;
  margin-top: 0;
}

.github-section {
  background: #f8fafc;
}

.tech-section {
  background: white;
  margin-bottom: 40px;
}

.intro-content,
.github-content,
.tech-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center;
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
}

.section-description {
  font-size: 1.1rem;
  color: #718096;
  text-align: center;
  margin: 0 0 50px 0;
  line-height: 1.6;
}

.intro-text {
  text-align: center;
  margin-bottom: 50px;
}

.intro-text p {
  font-size: 1.1rem;
  color: #4a5568;
  line-height: 1.8;
  margin: 0 0 20px 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/**
 * 功能特性网格
 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-icon svg {
  width: 30px;
  height: 30px;
  color: white;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.feature-card p {
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.6;
  margin: 0;
}

/**
 * GitHub仓库左右布局
 */
.github-layout {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: center;
}

.github-card {
  background: white;
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.github-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.github-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.github-card:hover::before {
  transform: scaleX(1);
}

.github-card {
  flex: 1;
  max-width: 350px;
}

.github-card:hover {
  transform: translateY(-8px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.github-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.github-icon.frontend {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
}

.github-icon.backend {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.github-icon.crypto {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.github-icon.docs {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.github-icon svg {
  width: 28px;
  height: 28px;
  color: white;
  z-index: 1;
}

.card-badge {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.github-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 15px 0;
  line-height: 1.3;
}

.github-card p {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.7;
  margin: 0 0 25px 0;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 25px;
}

.tech-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
}

.github-link-placeholder {
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.github-link-placeholder:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.github-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #667eea;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
}

.github-link:hover {
  color: #5a67d8;
  transform: translateX(5px);
}

.link-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.github-link:hover .link-icon {
  transform: rotate(15deg) scale(1.1);
}

.link-text {
  flex: 1;
  font-weight: 600;
}

/**
 * 技术栈网格
 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tech-label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.95rem;
}

.tech-value {
  font-weight: 500;
  color: #667eea;
  font-size: 0.95rem;
}

/* GitHub仓库区域响应式设计 */
@media (max-width: 1024px) {
  .github-layout {
    flex-direction: column;
    align-items: center;
  }
  
  .github-card {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .github-layout {
    gap: 20px;
  }
}

/* 通用响应式设计 */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2.5rem;
  }
  
  .nav-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-btn {
    width: 100%;
    max-width: 280px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .github-layout {
    flex-direction: column;
    gap: 30px;
  }
  
  .left-card,
  .right-card {
    transform: none;
  }
  
  .left-card:hover,
  .right-card:hover {
    transform: translateY(-8px);
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-item {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header-section {
    padding: 40px 15px 30px;
  }
  
  .intro-section,
  .github-section,
  .tech-section {
    padding: 40px 15px;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .nav-btn {
    padding: 12px 20px;
    font-size: 0.9rem;
  }
}

/**
 * 滚动条美化
 */
#app::-webkit-scrollbar {
  width: 8px;
}

#app::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

#app::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

#app::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
