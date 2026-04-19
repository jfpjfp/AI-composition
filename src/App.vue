<script setup lang="ts">
import { ref, provide } from 'vue'
import HeaderBar from './components/HeaderBar.vue'
import TabNav from './components/TabNav.vue'
import KanbanBoard from './components/kanban/KanbanBoard.vue'
import OfferComparison from './components/comparison/OfferComparison.vue'
import StatisticsView from './components/statistics/StatisticsView.vue'
import AppModal from './components/kanban/AppModal.vue'

type ViewType = 'kanban' | 'comparison' | 'statistics'

const currentView = ref<ViewType>('kanban')
const searchKeyword = ref('')

// Modal state
const showModal = ref(false)
const editingAppId = ref<string | null>(null)

function openAddModal(): void {
  editingAppId.value = null
  showModal.value = true
}

function openEditModal(appId: string): void {
  editingAppId.value = appId
  showModal.value = true
}

function closeModal(): void {
  showModal.value = false
  editingAppId.value = null
}

// Provide to child components
provide('searchKeyword', searchKeyword)
provide('modal', { showModal, editingAppId, openAddModal, openEditModal, closeModal })

function handleViewChange(view: ViewType) {
  currentView.value = view
}

function handleSearch(keyword: string) {
  searchKeyword.value = keyword
}
</script>

<template>
  <div class="app">
    <HeaderBar @search="handleSearch">
      <template #default>
        <button class="add-btn" @click="openAddModal">+ 新申请</button>
      </template>
    </HeaderBar>
    <TabNav :current-view="currentView" @change="handleViewChange" />
    <main class="main-content">
      <KanbanBoard v-if="currentView === 'kanban'" />
      <OfferComparison v-else-if="currentView === 'comparison'" />
      <StatisticsView v-else-if="currentView === 'statistics'" />
    </main>

    <AppModal
      :show="showModal"
      :app-id="editingAppId"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--gray-100);
}

.main-content {
  padding: 24px 32px;
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
