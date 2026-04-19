<script setup lang="ts">
import { ref, computed } from 'vue'
import { useApplicationStore } from '@/stores/application'
import CalendarDay from './CalendarDay.vue'

const store = useApplicationStore()
const currentDate = ref(new Date())

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

const monthName = computed(() => {
  return `${year.value}年${month.value + 1}月`
})

const weekDays = ['日', '一', '二', '三', '四', '五', '六']

const daysInMonth = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  return new Date(year.value, month.value, 1).getDay()
})

const calendarDays = computed(() => {
  const days: { date: string; day: number; isCurrentMonth: boolean }[] = []

  // Previous month days
  const prevMonthDays = firstDayOfMonth.value
  const prevMonth = month.value === 0 ? 11 : month.value - 1
  const prevYear = month.value === 0 ? year.value - 1 : year.value
  const prevMonthDaysCount = new Date(prevYear, prevMonth + 1, 0).getDate()

  for (let i = prevMonthDays - 1; i >= 0; i--) {
    const d = prevMonthDaysCount - i
    const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: dateStr, day: d, isCurrentMonth: false })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth.value; d++) {
    const dateStr = `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: dateStr, day: d, isCurrentMonth: true })
  }

  // Next month days to fill grid
  const remaining = 42 - days.length
  const nextMonth = month.value === 11 ? 0 : month.value + 1
  const nextYear = month.value === 11 ? year.value + 1 : year.value

  for (let d = 1; d <= remaining; d++) {
    const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ date: dateStr, day: d, isCurrentMonth: false })
  }

  return days
})

function getAppsForDate(dateStr: string) {
  return store.applications.filter(app => app.deadline === dateStr)
}

function prevMonth(): void {
  currentDate.value = new Date(year.value, month.value - 1, 1)
}

function nextMonth(): void {
  currentDate.value = new Date(year.value, month.value + 1, 1)
}
</script>

<template>
  <div class="calendar-view">
    <div class="calendar-header">
      <h2>{{ monthName }}</h2>
      <div class="calendar-nav">
        <button class="nav-btn" @click="prevMonth">◀</button>
        <button class="nav-btn" @click="nextMonth">▶</button>
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-header">
        {{ day }}
      </div>

      <CalendarDay
        v-for="day in calendarDays"
        :key="day.date"
        :date="day.date"
        :day="day.day"
        :is-current-month="day.isCurrentMonth"
        :applications="getAppsForDate(day.date)"
      />
    </div>
  </div>
</template>

<style scoped>
.calendar-view {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.calendar-header h2 {
  font-size: 20px;
  font-weight: 600;
}

.calendar-nav {
  display: flex;
  gap: 8px;
}

.nav-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gray-200);
  background: white;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-600);
  transition: all 0.2s;
}

.nav-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.day-header {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  color: var(--gray-500);
  padding: 8px;
}
</style>
