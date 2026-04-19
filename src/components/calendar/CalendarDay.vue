<script setup lang="ts">
import type { Application } from '@/types/application'
import { getDeadlineStatus } from '@/utils/date'

interface Props {
  date: string
  day: number
  isCurrentMonth: boolean
  applications: Application[]
}

defineProps<Props>()

function getStatusClass(app: Application): string {
  return getDeadlineStatus(app.deadline)
}
</script>

<template>
  <div class="calendar-day" :class="{ 'other-month': !isCurrentMonth }">
    <div class="day-number">{{ day }}</div>
    <div class="day-items">
      <div
        v-for="app in applications.slice(0, 3)"
        :key="app.id"
        class="day-item"
        :class="getStatusClass(app)"
        :title="`${app.company} - ${app.position}`"
      >
        {{ app.company.substring(0, 6) }}
      </div>
      <div v-if="applications.length > 3" class="more-count">
        +{{ applications.length - 3 }} 更多
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-day {
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  padding: 12px;
  min-height: 80px;
  transition: background 0.2s;
}

.calendar-day:hover {
  background: var(--gray-100);
}

.calendar-day.other-month {
  opacity: 0.4;
}

.day-number {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--gray-700);
}

.other-month .day-number {
  color: var(--gray-400);
}

.day-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.day-item {
  font-size: 11px;
  padding: 3px 6px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.day-item.safe {
  background: var(--primary);
}

.day-item.soon {
  background: var(--warning);
}

.day-item.overdue {
  background: var(--danger);
}

.more-count {
  font-size: 10px;
  color: var(--gray-500);
  padding: 2px 4px;
}
</style>
