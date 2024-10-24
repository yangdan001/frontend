<template>
  <div ref="canvasContainer" class="canvas-container"></div> <!-- 用于绘制点云的容器 -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'; // 导入 Vue 相关函数
import * as THREE from 'three'; // 导入 Three.js

export default defineComponent({
  name: 'PointCloud', // 组件名称
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null); // 引用用于渲染的容器
    let scene: THREE.Scene; // 定义场景
    let camera: THREE.Camera; // 定义相机
    let renderer: THREE.WebGLRenderer; // 定义渲染器
    let points: THREE.Points; // 定义点云对象
    const pointCount = 100; // 点的数量
    const positions: Float32Array = new Float32Array(pointCount * 3); // 存储点的坐标

    // 创建点云
    const createPoints = () => {
      for (let i = 0; i < pointCount; i++) {
        // 线性分布 X 坐标，Y 和 Z 坐标随机
        positions[i * 3] = (i / pointCount) * 10 - 5; // X 坐标
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2; // Y 坐标随机
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // Z 坐标随机
      }

      const geometry = new THREE.BufferGeometry(); // 创建几何体
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); // 设置点的位置属性

      const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 }); // 创建点的材质
      points = new THREE.Points(geometry, material); // 创建点云对象
      scene.add(points); // 将点云添加到场景中
    };

    // 动态更新点的位置
    const animatePoints = () => {
      for (let i = 0; i < pointCount; i++) {
        // 随机移动 Y 和 Z 坐标
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1; // 更新 Y 坐标
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1; // 更新 Z 坐标
      }
      points.geometry.attributes.position.needsUpdate = true; // 告诉 Three.js 更新点位置
    };

    // 初始化 Three.js 场景
    const init = () => {
      scene = new THREE.Scene(); // 创建场景
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 创建透视相机
      renderer = new THREE.WebGLRenderer(); // 创建 WebGL 渲染器
      renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器尺寸
      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement); // 将渲染器的 DOM 添加到容器中
      }
      camera.position.z = 5; // 设置相机位置

      createPoints(); // 创建点云

      // 动画循环
      const animate = () => {
        requestAnimationFrame(animate); // 请求下一帧
        animatePoints(); // 动态更新点
        renderer.render(scene, camera); // 渲染场景
      };
      animate(); // 开始动画循环
    };

    onMounted(() => {
      init(); // 组件挂载后初始化
      // 处理窗口大小调整
      window.addEventListener('resize', () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight; // 更新相机宽高比
          camera.updateProjectionMatrix(); // 更新投影矩阵
          renderer.setSize(window.innerWidth, window.innerHeight); // 更新渲染器尺寸
        }
      });
    });

    return {
      canvasContainer, // 返回引用
    };
  },
});
</script>

<style>
.canvas-container {
  width: 100%;  /* 设置容器宽度 */
  height: 100vh; /* 设置容器高度 */
  overflow: hidden; /* 隐藏溢出内容 */
}
</style>
