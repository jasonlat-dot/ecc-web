import notification from '@/utils/notification'

/**
 * 通知插件
 * 将通知服务注册为全局属性，方便在组件中使用
 */
export default {
  /**
   * 安装插件
   * @param {Object} app - Vue应用实例
   */
  install(app) {
    // 将通知服务添加到全局属性
    app.config.globalProperties.$notification = notification
    app.config.globalProperties.$notify = notification
    
    // 提供便捷方法
    app.config.globalProperties.$success = notification.success.bind(notification)
    app.config.globalProperties.$error = notification.error.bind(notification)
    app.config.globalProperties.$warning = notification.warning.bind(notification)
    app.config.globalProperties.$info = notification.info.bind(notification)
    
    // 替换原生 alert
    app.config.globalProperties.$alert = (message, type = 'info') => {
      return notification.show({
        type,
        message,
        duration: 0, // 不自动关闭
        closable: true,
        clickToClose: true
      })
    }
    
    // 提供 provide/inject 支持
    app.provide('notification', notification)
  }
}

/**
 * 组合式API支持
 * 在 setup 函数中使用
 */
export const useNotification = () => {
  return {
    notification,
    showSuccess: notification.success.bind(notification),
    showError: notification.error.bind(notification),
    showWarning: notification.warning.bind(notification),
    showInfo: notification.info.bind(notification),
    clearNotifications: notification.clear.bind(notification)
  }
}