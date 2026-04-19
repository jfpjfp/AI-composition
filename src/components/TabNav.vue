<script setup lang="ts">
type ViewType = 'kanban' | 'comparison' | 'statistics'

interface Props {
  currentView: ViewType
}

defineProps<Props>()

const emit = defineEmits<{
  change: [view: ViewType]
}>()

const tabs: { id: ViewType; label: string }[] = [
  { id: 'kanban', label: '看板视图' },
  { id: 'comparison', label: 'Offer对比' },
  { id: 'statistics', label: '数据统计' }
]
</script>

<template>
  <nav class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: currentView === tab.id }"
      @click="emit('change', tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<style scoped>
.tabs {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 0 32px;
  display: flex;
  gap: 8px;
}

.tab {
  padding: 14px 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-500);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--gray-700);
}

.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}
</style>
