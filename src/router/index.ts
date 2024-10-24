// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ThreeScene from '../views/ThreeScene.vue'
import Rpc from '../views/Rpc.vue'
import Line from '../views/Line.vue'
import ImageSimulation from '../views/ImageSimulation.vue'
import OriginalImage from '../views/OriginalImage.vue'
import OriginalImageLine from '../views/OriginalImageLine.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'ThreeScene',
    component: ThreeScene  //三维图像
  },
  {
    path: '/Rpc',
    name: 'Rpc',
    component: Rpc        //rpc调试
  },
  {
    path: '/ImageSimulation',
    name: 'ImageSimulation',
    component: ImageSimulation        //轮廓图像
  },
  {
    path: '/OriginalImage',
    name: 'OriginalImage',
    component: OriginalImage        //原始图像
  },
  {
    path: '/OriginalImageLine',
    name: 'OriginalImageLine',
    component: OriginalImageLine        //原始图像线性
  },
  // 其他路由
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
