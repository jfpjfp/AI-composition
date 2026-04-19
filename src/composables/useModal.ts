import { ref } from 'vue'

const showModal = ref(false)
const editingAppId = ref<string | null>(null)

export function useModal() {
  function openAdd(): void {
    editingAppId.value = null
    showModal.value = true
  }

  function openEdit(appId: string): void {
    editingAppId.value = appId
    showModal.value = true
  }

  function close(): void {
    showModal.value = false
    editingAppId.value = null
  }

  return {
    showModal,
    editingAppId,
    openAdd,
    openEdit,
    close
  }
}
