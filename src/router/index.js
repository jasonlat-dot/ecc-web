/**
 * Vue Router 配置文件
 * 
 * @description 应用程序的路由配置，管理登录页面和注册页面的导航
 * @author ECC Team
 * @version 1.0.0
 */

import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import LoginPage from '../components/pages/LoginPage.vue'
import RegisterPage from '../components/pages/RegisterPage.vue'
import NotificationDemo from '../components/pages/NotificationDemo.vue'
import ApiTestDemo from '../components/pages/ApiTestDemo.vue'
import ProjectIntro from '../App.vue' // 项目介绍页面

/**
 * 路由配置数组
 */
const routes = [
  {
    path: '/',
    redirect: '/notification'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: {
      title: '用户登录',
      description: '登录到您的账户',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register', 
    component: RegisterPage,
    meta: {
      title: '用户注册',
      description: '创建新账户',
      requiresAuth: false
    }
  },
  {
    path: '/notification',
    name: 'NotificationDemo',
    component: NotificationDemo,
    meta: {
      title: '通知组件演示',
      description: '展示通知组件的各种功能',
      requiresAuth: false
    }
  },
  {
    path: '/project-intro',
    name: 'ProjectIntro',
    component: ProjectIntro,
    meta: {
      title: 'ECC加密演示项目',
      description: '椭圆曲线加密技术演示和使用指南',
      requiresAuth: false
    }
  },
  {
    path: '/api-test',
    name: 'ApiTestDemo',
    component: ApiTestDemo,
    meta: {
      title: 'API接口测试演示',
      description: '测试ECC加密接口的各种认证和加密场景',
      requiresAuth: false
    }
  },
  // 注释掉暂未实现的页面路由
  // {
  //   path: '/dashboard',
  //   name: 'Dashboard',
  //   component: () => import('../components/pages/DashboardPage.vue'),
  //   meta: {
  //     title: '用户仪表板',
  //     description: '用户主页',
  //     requiresAuth: true
  //   }
  // },
  // {
  //   path: '/forgot-password',
  //   name: 'ForgotPassword',
  //   component: () => import('../components/pages/ForgotPasswordPage.vue'),
  //   meta: {
  //     title: '忘记密码',
  //     description: '重置您的密码',
  //     requiresAuth: false
  //   }
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../components/pages/NotFoundPage.vue'),
  //   meta: {
  //     title: '页面未找到',
  //     description: '请求的页面不存在'
  //   }
  // }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 路由切换时的滚动行为
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

/**
 * 全局前置守卫
 * 用于身份验证和页面标题设置
 */
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - ECC登录系统`
  }
  
  // 设置页面描述
  if (to.meta.description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', to.meta.description)
    }
  }
  
  // 检查是否需要身份验证
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('authToken')
    
    if (!token) {
      // 未登录，重定向到登录页面
      console.log('用户未登录，重定向到登录页面')
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }
  
  // 如果已登录用户访问登录或注册页面，暂时允许访问（Dashboard页面未实现）
  // if ((to.name === 'Login' || to.name === 'Register') && localStorage.getItem('authToken')) {
  //   console.log('用户已登录，重定向到仪表板')
  //   next({ name: 'Dashboard' })
  //   return
  // }
  
  next()
})

/**
 * 全局后置钩子
 * 用于页面加载完成后的处理
 */
router.afterEach((to, from) => {
  // 记录页面访问日志
  console.log(`页面导航: ${from.name || 'Unknown'} -> ${to.name || 'Unknown'}`)
  
  // 发送页面访问统计（可选）
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: to.meta.title,
      page_location: window.location.href
    })
  }
})

/**
 * 路由工具函数
 */
export const routerUtils = {
  /**
   * 安全导航到指定路由
   * @param {String|Object} to - 目标路由
   * @param {Object} options - 导航选项
   */
  safePush(to, options = {}) {
    return router.push(to).catch(err => {
      if (err.name !== 'NavigationDuplicated') {
        console.error('路由导航错误:', err)
        if (options.fallback) {
          router.push(options.fallback)
        }
      }
    })
  },
  
  /**
   * 检查当前路由是否需要身份验证
   * @returns {Boolean}
   */
  requiresAuth() {
    return router.currentRoute.value.meta.requiresAuth || false
  },
  
  /**
   * 获取重定向URL
   * @returns {String|null}
   */
  getRedirectUrl() {
    return router.currentRoute.value.query.redirect || null
  },
  
  /**
   * 登录成功后的重定向
   */
  redirectAfterLogin() {
    const redirectUrl = this.getRedirectUrl()
    if (redirectUrl) {
      router.push(redirectUrl)
    } else {
      // 暂时重定向到注册页面（Dashboard页面未实现）
      router.push({ name: 'Register' })
    }
  },
  
  /**
   * 登出后的重定向
   */
  redirectAfterLogout() {
    // 清除认证信息
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
    
    // 重定向到登录页面
    router.push({ name: 'Login' })
  }
}

export default router