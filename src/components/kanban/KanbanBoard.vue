<script setup lang="ts">
import { inject } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { KANBAN_COLUMNS } from '@/constants/columns'
import KanbanColumn from './KanbanColumn.vue'

const store = useApplicationStore()
const searchKeyword = inject<{ value: string }>('searchKeyword', { value: '' })
const modal = inject<{ openEditModal: (id: string) => void }>('modal', { openEditModal: () => {} })

function getColumnApps(stageId: string) {
  const apps = store.getApplicationsByStage(stageId as any)
  const kw = searchKeyword.value.toLowerCase()
  if (!kw) return apps
  return apps.filter(a =>
    a.company.toLowerCase().includes(kw) ||
    a.position.toLowerCase().includes(kw)
  )
}

function handleEdit(appId: string): void {
  modal.openEditModal(appId)
}
</script>

<template>
  <div class="kanban-board">
    <KanbanColumn
      v-for="col in KANBAN_COLUMNS"
      :key="col.id"
      :column="col"
      :applications="getColumnApps(col.id)"
      @edit="handleEdit"
    />
  </div>
</template>

<style scoped>
.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
  align-items: flex-start;
}
</style>
