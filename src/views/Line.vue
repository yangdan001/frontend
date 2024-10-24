<template>
  <div ref="container" style="width: 100%; height: 100vh;"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import * as THREE from 'three';

export default defineComponent({
  setup() {
    const container = ref<HTMLElement | null>(null);

    onMounted(() => {
      if (container.value) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.value.appendChild(renderer.domElement);

        // 梯形四个角的点
        const points = [
          new THREE.Vector3(-1, 0, 0),  // 左下
          new THREE.Vector3(1, 0, 0),   // 右下
          new THREE.Vector3(0.5, 2, 0), // 右上
          new THREE.Vector3(-0.5, 2, 0) // 左上
        ];

        // 创建梯形形状
        const shape = new THREE.Shape(points);
        const shapeGeometry = new THREE.ShapeGeometry(shape);
        const shapeMaterial = new THREE.MeshBasicMaterial({ color: 0x800080, side: THREE.DoubleSide }); // 紫色填充
        const trapezoidMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
        scene.add(trapezoidMesh);

        // 创建边界
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffa500, linewidth: 4 }); // 调整线宽
        const edgeGeometry = new THREE.EdgesGeometry(shapeGeometry);
        const trapezoidEdges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        scene.add(trapezoidEdges);

        // 创建坐标轴
        const axisHelper = new THREE.AxesHelper(5);
        scene.add(axisHelper);

        // 相机位置
        camera.position.z = 5;

        // 渲染函数
        const animate = () => {
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
        };
        animate();
      }
    });

    return {
      container,
    };
  },
});
</script>

<style>
/* 可能需要的样式 */
</style>
