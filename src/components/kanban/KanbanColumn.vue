<script setup lang="ts">
import { ref } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import type { KanbanColumn, StageType } from '@/types/application'
import ApplicationCard from './ApplicationCard.vue'

interface Props {
  column: KanbanColumn
  applications: any[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [appId: string]
}>()

const store = useApplicationStore()
const { handleDragOver, handleDragEnd, getDraggedApp } = useDragAndDrop()

const isDragOver = ref(false)

function onDragOver(e: DragEvent): void {
  e.preventDefault()
  isDragOver.value = true
  handleDragOver(e)
}

function onDrop(e: DragEvent): void {
  e.preventDefault()
  isDragOver.value = false
  const dragged = getDraggedApp()
  if (dragged && dragged.fromStage !== props.column.id) {
    store.updateStage(dragged.applicationId, props.column.id as StageType)
  }
  handleDragEnd()
}

function onDragLeave(): void {
  isDragOver.value = false
}
</script>

<template>
  <div class="kanban-column" :class="{ 'drag-over': isDragOver }">
    <div class="column-header">
      <div class="column-title">
        <span class="column-dot" :style="{ background: column.color }"></span>
        {{ column.name }}
      </div>
      <span class="column-count">{{ applications.length }}</span>
    </div>

    <div
      class="column-cards"
      @dragover="onDragOver"
      @drop="onDrop"
      @dragleave="onDragLeave"
    >
      <template v-if="applications.length === 0">
        <div class="drag-placeholder"></div>
      </template>
      <ApplicationCard
        v-for="app in applications"
        :key="app.id"
        :application="app"
        @edit="emit('edit', app.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.kanban-column {
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  background: var(--gray-50);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: border-color 0.2s;
  height: calc(100vh - 200px);
  max-height: 700px;
}

.kanban-column.drag-over {
  border: 2px dashed var(--primary);
  background: rgba(99, 102, 241, 0.05);
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.column-title {
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.column-count {
  background: var(--gray-200);
  color: var(--gray-700);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
}

.column-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  min-height: 100px;
}

.drag-placeholder {
  border: 2px dashed var(--gray-300);
  border-radius: var(--radius-sm);
  background: var(--gray-100);
  min-height: 100px;
  flex: 1;
}
</style>
