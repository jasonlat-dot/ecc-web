<template>
  <!-- 背景装饰组件 -->
  <div class="background-decoration">
    <div class="circle circle-1"></div>
    <div class="circle circle-2"></div>
    <div class="circle circle-3"></div>
  </div>
</template>

<script setup>
/**
 * 背景装饰组件
 * 
 * @description 提供页面背景的动态装饰效果，包含浮动的圆形元素
 * @author ECC Team
 * @version 1.0.0
 */

// 该组件不需要任何props或逻辑，纯装饰性组件
</script>

<style scoped>
/**
 * 背景装饰容器
 */
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/**
 * 装饰圆形基础样式
 */
.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

/**
 * 第一个装饰圆形
 */
.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

/**
 * 第二个装饰圆形
 */
.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

/**
 * 第三个装饰圆形
 */
.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

/**
 * 浮动动画效果
 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.3;
  }
}

/**
 * 响应式设计 - 在小屏幕上隐藏装饰元素
 */
@media (max-width: 768px) {
  .circle-1,
  .circle-2,
  .circle-3 {
    display: none;
  }
}
</style>