<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  max: 100
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, (props.value / props.max) * 100)
})
</script>

<template>
  <div class="base-progress">
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: `${percentage}%` }" />
    </div>
    <span class="progress-text">{{ value }}/{{ max }}</span>
  </div>
</template>

<style scoped>
.base-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 11px;
  color: var(--gray-500);
  min-width: 32px;
}
</style>
