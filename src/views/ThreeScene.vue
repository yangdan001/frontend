<template>
    <div ref="container" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import * as THREE from 'three'
  
  const container = ref<HTMLDivElement | null>(null)
  let renderer: THREE.WebGLRenderer
  let scene: THREE.Scene
  let camera: THREE.PerspectiveCamera
  let cube: THREE.Mesh
  
  onMounted(() => {
    if (!container.value) return
  
    // 初始化场景
    scene = new THREE.Scene()
  
    // 初始化相机
    camera = new THREE.PerspectiveCamera(
      75,
      container.value.clientWidth / container.value.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
  
    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    container.value.appendChild(renderer.domElement)
  
    // 添加立方体
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
  
    // 渲染循环
    const animate = () => {
      requestAnimationFrame(animate)
  
      // 旋转立方体
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
  
      renderer.render(scene, camera)
    }
  
    animate()
  })
  
  onBeforeUnmount(() => {
    if (renderer && renderer.domElement) {
      renderer.dispose()
      if (container.value) {
        container.value.removeChild(renderer.domElement)
      }
    }
  })
  </script>
  
  <style scoped>
  /* 可根据需要添加样式 */
  </style>
  