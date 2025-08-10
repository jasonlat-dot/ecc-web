import { createApp } from 'vue'
import AppRouter from './AppRouter.vue'
import router from './router'
import notificationPlugin from './plugins/notification'

// 创建Vue应用实例
const app = createApp(AppRouter)

// 使用Vue Router
app.use(router)

// 使用通知插件
app.use(notificationPlugin)

// 挂载应用
app.mount('#app')
