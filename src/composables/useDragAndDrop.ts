import { ref } from 'vue'
import type { DragData } from '@/types/application'

const draggedApp = ref<DragData | null>(null)

export function useDragAndDrop() {
  function handleDragStart(appId: string, fromStage: string): void {
    draggedApp.value = {
      applicationId: appId,
      fromStage: fromStage as DragData['fromStage']
    }
  }

  function handleDragEnd(): void {
    draggedApp.value = null
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }
  }

  function isDragging(): boolean {
    return draggedApp.value !== null
  }

  function getDraggedApp(): DragData | null {
    return draggedApp.value
  }

  return {
    draggedApp,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    isDragging,
    getDraggedApp
  }
}
