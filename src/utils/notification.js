import { createApp } from 'vue'
import NotificationToast from '@/components/common/NotificationToast.vue'

/**
 * 通知服务类
 * 用于在应用中显示各种类型的通知消息
 */
class NotificationService {
  constructor() {
    this.notifications = new Map()
    this.zIndex = 9999
  }

  /**
   * 显示通知
   * @param {Object} options - 通知选项
   * @param {string} options.type - 通知类型：success, error, warning, info
   * @param {string} options.title - 通知标题
   * @param {string} options.message - 通知消息
   * @param {number} options.duration - 自动关闭时间（毫秒），0 表示不自动关闭
   * @param {boolean} options.closable - 是否显示关闭按钮
   * @param {boolean} options.clickToClose - 点击通知时是否关闭
   * @returns {string} 通知ID
   */
  show(options = {}) {
    const {
      type = 'info',
      title = '',
      message = '',
      duration = 4000,
      closable = true,
      clickToClose = false
    } = options

    if (!message) {
      console.warn('通知消息不能为空')
      return null
    }

    // 生成唯一ID
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // 创建容器元素
    const container = document.createElement('div')
    container.id = id
    container.style.position = 'fixed'
    container.style.top = '0'
    container.style.right = '0'
    container.style.zIndex = this.zIndex++
    container.style.pointerEvents = 'auto'
    
    // 添加到页面
    document.body.appendChild(container)
    
    // 创建Vue应用实例
    const app = createApp(NotificationToast, {
      type,
      title,
      message,
      duration,
      closable,
      clickToClose,
      onClose: () => {
        this.remove(id)
      }
    })
    
    // 挂载组件
    app.mount(container)
    
    // 存储通知信息
    this.notifications.set(id, {
      app,
      container,
      options
    })
    
    // 调整其他通知的位置
    this.adjustPositions()
    
    return id
  }

  /**
   * 移除通知
   * @param {string} id - 通知ID
   */
  remove(id) {
    const notification = this.notifications.get(id)
    if (notification) {
      const { app, container } = notification
      
      // 卸载Vue应用
      app.unmount()
      
      // 移除DOM元素
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      // 从Map中删除
      this.notifications.delete(id)
      
      // 重新调整位置
      this.adjustPositions()
    }
  }

  /**
   * 清除所有通知
   */
  clear() {
    const ids = Array.from(this.notifications.keys())
    ids.forEach(id => this.remove(id))
  }

  /**
   * 调整通知位置
   * 确保多个通知不会重叠
   */
  adjustPositions() {
    const notifications = Array.from(this.notifications.values())
    let topOffset = 20
    
    notifications.forEach(({ container }) => {
      if (container) {
        const toast = container.querySelector('.notification-toast')
        if (toast) {
          toast.style.top = `${topOffset}px`
          topOffset += toast.offsetHeight + 10
        }
      }
    })
  }

  /**
   * 显示成功通知
   * @param {string} message - 消息内容
   * @param {Object} options - 其他选项
   * @returns {string} 通知ID
   */
  success(message, options = {}) {
    return this.show({
      ...options,
      type: 'success',
      message
    })
  }

  /**
   * 显示错误通知
   * @param {string} message - 消息内容
   * @param {Object} options - 其他选项
   * @returns {string} 通知ID
   */
  error(message, options = {}) {
    return this.show({
      ...options,
      type: 'error',
      message,
      duration: 6000 // 错误消息显示时间更长
    })
  }

  /**
   * 显示警告通知
   * @param {string} message - 消息内容
   * @param {Object} options - 其他选项
   * @returns {string} 通知ID
   */
  warning(message, options = {}) {
    return this.show({
      ...options,
      type: 'warning',
      message
    })
  }

  /**
   * 显示信息通知
   * @param {string} message - 消息内容
   * @param {Object} options - 其他选项
   * @returns {string} 通知ID
   */
  info(message, options = {}) {
    return this.show({
      ...options,
      type: 'info',
      message
    })
  }
}

// 创建全局实例
const notification = new NotificationService()

// 导出实例和类
export default notification
export { NotificationService }

// 为了方便使用，也可以直接导出方法
export const showNotification = (options) => notification.show(options)
export const showSuccess = (message, options) => notification.success(message, options)
export const showError = (message, options) => notification.error(message, options)
export const showWarning = (message, options) => notification.warning(message, options)
export const showInfo = (message, options) => notification.info(message, options)
export const clearNotifications = () => notification.clear()

/**
 * 替换原生 alert 的便捷方法
 * @param {string} message - 消息内容
 * @param {string} type - 通知类型，默认为 'info'
 * @returns {string} 通知ID
 */
export const alert = (message, type = 'info') => {
  return notification.show({
    type,
    message,
    duration: 0, // 不自动关闭，需要用户手动关闭
    closable: true,
    clickToClose: true
  })
}