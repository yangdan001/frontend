<template>
  <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  name: 'PointCloud',
  setup() {
    const canvasContainer = ref<HTMLDivElement | null>(null);
    let scene: THREE.Scene;
    let camera: THREE.Camera;
    let renderer: THREE.WebGLRenderer;
    let points: THREE.Points;
    const pointCount = 100; // 点的数量
    const positions: Float32Array = new Float32Array(pointCount * 3); // 存储点的坐标

    const createPoints = () => {
      for (let i = 0; i < pointCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;   // X 坐标
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // Y 坐标
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // Z 坐标
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 });
      points = new THREE.Points(geometry, material);
      scene.add(points);
    };

    const animatePoints = () => {
      // 更新点的位置
      for (let i = 0; i < pointCount; i++) {
        positions[i * 3] += (Math.random() - 0.5) * 0.1;   // 随机移动 X 坐标
        positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1; // 随机移动 Y 坐标
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1; // 随机移动 Z 坐标
      }
      points.geometry.attributes.position.needsUpdate = true; // 告诉 Three.js 更新点位置
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (canvasContainer.value) {
        canvasContainer.value.appendChild(renderer.domElement);
      }
      camera.position.z = 5;

      createPoints();

      const animate = () => {
        requestAnimationFrame(animate);
        animatePoints(); // 动态更新点
        renderer.render(scene, camera);
      };
      animate();
    };

    onMounted(() => {
      init();
      window.addEventListener('resize', () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        }
      });
    });

    return {
      canvasContainer,
    };
  },
});
</script>

<style>
.canvas-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
