import { computed } from 'vue'
import { getDeadlineStatus, formatDeadline, type DeadlineStatus } from '@/utils/date'

export function useDeadline(deadline: () => string) {
  const status = computed<DeadlineStatus>(() => getDeadlineStatus(deadline()))
  const formatted = computed(() => formatDeadline(deadline()))

  const statusClass = computed(() => {
    switch (status.value) {
      case 'overdue': return 'overdue'
      case 'soon': return 'soon'
      default: return 'safe'
    }
  })

  return {
    status,
    formatted,
    statusClass
  }
}
