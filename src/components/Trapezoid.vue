<template>
  <div>
    <div class="button-container">
      <button @click="toggleAxes">{{ axesVisible ? '隐藏辅助线' : '显示辅助线' }}</button>
      <button @click="toggleTrapezoid">{{ trapezoidVisible ? '隐藏梯形' : '显示梯形' }}</button>
      <button @click="toggleFullScreen">{{ isFullScreen ? '退出全屏' : '全屏展示' }}</button>
    </div>
    <div ref="canvasContainer" class="canvas-container"></div> <!-- 用于绘制场景的容器 -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'; // 导入 Vue 相关函数
import * as THREE from 'three'; // 导入 Three.js

export default defineComponent({
  name: 'Trapezoid', // 组件名称
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null); // 引用用于渲染的容器
    let camera: THREE.PerspectiveCamera; // 声明相机
    let renderer: THREE.WebGLRenderer; // 声明渲染器
    let axesVisible = ref(true); // 辅助线可见性状态
    let trapezoidVisible = ref(true); // 梯形可见性状态
    let trapezoid: THREE.Mesh | null = null; // 存储梯形对象
    let outline: THREE.LineSegments | null = null; // 存储梯形轮廓对象
    let isDragging = false; // 拖拽状态
    let previousMousePosition = { x: 0, y: 0 }; // 记录上一个鼠标位置
    let axes: THREE.Line[] = []; // 存储辅助线
    const isFullScreen = ref(false); // 全屏状态

    // 创建场景
    const createScene = () => {
      const scene = new THREE.Scene(); // 创建 Three.js 场景
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 创建透视相机
      renderer = new THREE.WebGLRenderer({ alpha: true }); // 创建 WebGL 渲染器，支持透明背景

      renderer.setSize(window.innerWidth, window.innerHeight); // 设置渲染器尺寸
      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement); // 将渲染器的 DOM 添加到容器中
      }

      // 设置背景颜色为黑色
      scene.background = new THREE.Color(0x000000);

      // 设置相机位置
      camera.position.z = 5;

      // 创建坐标轴
      const createAxis = (color: number, start: THREE.Vector3, end: THREE.Vector3) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        const material = new THREE.LineBasicMaterial({ color });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        axes.push(line); // 将线存储在数组中
      };

      createAxis(0xffffff, new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0)); // x 轴
      createAxis(0xffffff, new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 10, 0)); // y 轴

      // 定义梯形的四个点
      const points = [
        new THREE.Vector3(-1, -1, 0), // p1
        new THREE.Vector3(1, -1, 0),  // p2
        new THREE.Vector3(0.5, 1, 0),  // p3
        new THREE.Vector3(-0.5, 1, 0), // p4
      ];

      // 创建梯形的几何体
      const shape = new THREE.Shape(points); // 创建形状
      const geometry = new THREE.ShapeGeometry(shape); // 将形状转为几何体

      // 设置梯形的材质，透明度为 0.1
      const fillMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x800080, // 紫色
        transparent: true, // 允许透明
        opacity: 0.4 // 设置透明度
      });
      trapezoid = new THREE.Mesh(geometry, fillMaterial); // 创建梯形网格
      scene.add(trapezoid); // 将梯形添加到场景中

      // 创建梯形的轮廓几何体
      const outlineGeometry = new THREE.EdgesGeometry(geometry); // 生成轮廓几何体
      const outlineMaterial = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 2 }); // 轮廓线的材质
      outline = new THREE.LineSegments(outlineGeometry, outlineMaterial); // 创建轮廓线
      scene.add(outline); // 将轮廓线添加到场景中

      // 渲染函数
      const animate = () => {
        requestAnimationFrame(animate); // 请求下一帧
        renderer.render(scene, camera); // 渲染场景
      };

      animate(); // 启动动画循环

      // 添加鼠标滚轮事件监听器
      const handleScroll = (event: WheelEvent) => {
        event.preventDefault(); // 阻止默认滚动行为
        const zoomFactor = 0.1; // 缩放因子
        camera.position.z += event.deltaY * zoomFactor; // 根据滚轮滚动距离调整相机位置
        camera.position.z = Math.max(1, camera.position.z); // 限制相机最小距离
      };

      // 监听鼠标滚轮事件
      window.addEventListener('wheel', handleScroll, { passive: false });

      // 处理鼠标拖拽
      const handleMouseDown = (event: MouseEvent) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (isDragging) {
          const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
          };

          camera.position.x -= deltaMove.x * 0.01; // 根据鼠标移动更新相机位置
          camera.position.y += deltaMove.y * 0.01; // 反向移动 Y 轴
          
          previousMousePosition = { x: event.clientX, y: event.clientY }; // 更新上一个鼠标位置
        }
      };

      const handleMouseUp = () => {
        isDragging = false; // 释放拖拽状态
      };

      // 绑定鼠标事件
      window.addEventListener('mousedown', handleMouseDown);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    };

    // 切换辅助线可见性
    const toggleAxes = () => {
      axesVisible.value = !axesVisible.value;
      axes.forEach(axis => {
        axis.visible = axesVisible.value; // 根据状态设置可见性
      });
    };

    // 切换梯形及其轮廓的可见性
    const toggleTrapezoid = () => {
      trapezoidVisible.value = !trapezoidVisible.value;
      if (trapezoid) {
        trapezoid.visible = trapezoidVisible.value; // 根据状态设置梯形可见性
      }
      if (outline) {
        outline.visible = trapezoidVisible.value; // 根据状态设置轮廓可见性
      }
    };

    // 切换全屏模式
    const toggleFullScreen = () => {
      if (!isFullScreen.value) {
        canvasContainer.value?.requestFullscreen(); // 进入全屏模式
      } else {
        document.exitFullscreen(); // 退出全屏模式
      }
      isFullScreen.value = !isFullScreen.value; // 切换全屏状态
    };

    onMounted(() => {
      createScene(); // 组件挂载后创建场景
    });

    return {
      canvasContainer, // 返回引用
      toggleAxes, // 返回切换辅助线的函数
      axesVisible, // 返回辅助线可见性状态
      toggleTrapezoid, // 返回切换梯形的函数
      trapezoidVisible, // 返回梯形可见性状态
      toggleFullScreen, // 返回切换全屏的函数
      isFullScreen, // 返回全屏状态
    };
  },
});
</script>

<style>
.canvas-container {
  width: 100vw;  /* 设置容器宽度 */
  height: 100vh; /* 设置容器高度 */
  overflow: hidden; /* 隐藏溢出内容 */
}

.button-container {
  position: absolute;
  z-index: 1; /* 确保按钮在画布上方 */
  top: 10px;
}
</style>