<template>
  <Button type="primary" @click="increment">点击次数：{{ count }}</Button>
  <ThreeScene />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCounterStore } from '../stores/index'
import ThreeScene from '../components/ThreeScene.vue'
const counterStore = useCounterStore()
import { Button } from 'ant-design-vue';
const increment = () => {
  counterStore.increment()
}

const count = computed(() => counterStore.count)
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
