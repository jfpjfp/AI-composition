<script setup lang="ts">
import { computed } from 'vue'

interface FunnelItem {
  label: string
  count: number
  color: string
}

interface Props {
  data: FunnelItem[]
}

const props = defineProps<Props>()

const maxCount = computed(() => {
  return Math.max(...props.data.map(d => d.count), 1)
})

function getWidth(count: number): string {
  return `${(count / maxCount.value) * 100}%`
}
</script>

<template>
  <div class="funnel-chart">
    <h3>申请转化漏斗</h3>
    <div class="funnel-items">
      <div v-for="item in data" :key="item.label" class="funnel-item">
        <div class="funnel-label">{{ item.label }}</div>
        <div class="funnel-bar">
          <div
            class="funnel-fill"
            :style="{ width: getWidth(item.count), background: item.color }"
          >
            {{ item.count }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.funnel-chart {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
}

.funnel-chart h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.funnel-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.funnel-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.funnel-label {
  width: 80px;
  font-size: 13px;
  color: var(--gray-700);
}

.funnel-bar {
  flex: 1;
  height: 28px;
  background: var(--gray-100);
  border-radius: 4px;
  overflow: hidden;
}

.funnel-fill {
  height: 100%;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  transition: width 0.5s ease;
}
</style>
