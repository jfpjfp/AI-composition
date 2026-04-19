<script setup lang="ts">
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/application'

const store = useApplicationStore()

const stats = computed(() => store.statistics)

const emit = defineEmits<{
  search: [keyword: string]
}>()

function onSearchInput(e: Event): void {
  const value = (e.target as HTMLInputElement).value
  emit('search', value)
}
</script>

<template>
  <header class="header">
    <div class="logo">
      <div class="logo-icon">📋</div>
      <span>求职看板</span>
    </div>

    <div class="search-box">
      <input
        type="text"
        placeholder="搜索公司或职位..."
        @input="onSearchInput"
      >
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">总申请</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.applied }}</div>
        <div class="stat-label">已投递</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.interview }}</div>
        <div class="stat-label">面试中</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.offer }}</div>
        <div class="stat-label">Offer</div>
      </div>
    </div>

    <slot />
  </header>
</template>

<style scoped>
.header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 18px;
  color: var(--gray-900);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, var(--primary), var(--purple));
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.search-box {
  flex: 1;
  max-width: 320px;
  position: relative;
}

.search-box input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 14px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-box::before {
  content: "🔍";
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  opacity: 0.5;
}

.stats-bar {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
}

.stat-label {
  font-size: 12px;
  color: var(--gray-500);
}

.add-btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  background: var(--primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.add-btn:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
</style>
