<script setup lang="ts">
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/application'
import { useDragAndDrop } from '@/composables/useDragAndDrop'
import { getDeadlineStatus, formatDeadline } from '@/utils/date'
import { getCompanyColor } from '@/utils/color'
import type { Application } from '@/types/application'
import BaseTag from '../common/BaseTag.vue'
import BaseProgress from '../common/BaseProgress.vue'

interface Props {
  application: Application
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [appId: string]
}>()

const store = useApplicationStore()
const { handleDragStart, handleDragEnd } = useDragAndDrop()

const deadlineStatus = computed(() => getDeadlineStatus(props.application.deadline))
const deadlineFormatted = computed(() => formatDeadline(props.application.deadline))
const companyColor = computed(() => getCompanyColor(props.application.company))

const materialsDone = computed(() =>
  props.application.materials.filter((m: any) => m.done).length
)
const materialsTotal = computed(() => props.application.materials.length)

const tags = computed(() => {
  const result = []
  if (props.application.stage === 'interview') result.push({ variant: 'interview' as const, text: '面试中' })
  if (props.application.stage === 'test') result.push({ variant: 'test' as const, text: '笔试' })
  if (props.application.outcome === 'offer') result.push({ variant: 'offer' as const, text: 'Offer' })
  if (props.application.outcome === 'rejected') result.push({ variant: 'rejected' as const, text: '已拒绝' })
  return result
})

// Next interview round
const nextRound = computed(() => {
  if (props.application.interviewRounds.length === 0) return null
  return props.application.interviewRounds.find(r => r.status === 'pending')
})

// Completed rounds count
const completedRounds = computed(() =>
  props.application.interviewRounds.filter(r => r.status === 'done').length
)

function onDragStart(e: DragEvent): void {
  handleDragStart(props.application.id, props.application.stage)
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.application.id)
  }
}

function onDragEnd(): void {
  handleDragEnd()
}

function onDelete(): void {
  store.deleteApplication(props.application.id)
}

function formatTime(date: string, time: string): string {
  if (!date) return ''
  const d = new Date(date)
  const dateStr = `${d.getMonth() + 1}月${d.getDate()}日`
  return time ? `${dateStr} ${time}` : dateStr
}
</script>

<template>
  <div
    class="app-card"
    :class="{
      overdue: deadlineStatus === 'overdue',
      'new-offer': application.outcome === 'offer'
    }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <div class="card-company">
      <div class="company-logo" :style="{ background: companyColor }">
        {{ application.company.charAt(0) }}
      </div>
      <div class="company-name">{{ application.company }}</div>
    </div>

    <div class="card-position">{{ application.position }}</div>

    <div class="card-meta">
      <div class="meta-item" :class="deadlineStatus">
        <span>📅</span>
        <span class="deadline" :class="deadlineStatus">
          {{ deadlineFormatted }}
        </span>
      </div>

      <!-- Test Info -->
      <div v-if="application.testInfo" class="meta-item test-info">
        <span>✍️</span>
        <span>
          笔试: {{ formatTime(application.testInfo.date, application.testInfo.time) }}
        </span>
      </div>

      <!-- Interview Progress -->
      <div v-if="application.interviewRounds.length > 0" class="meta-item interview-info">
        <span>💬</span>
        <span>
          <template v-if="nextRound">
            {{ nextRound.name }}: {{ formatTime(nextRound.date, nextRound.time) }}
          </template>
          <template v-else-if="completedRounds > 0">
            已完成 {{ completedRounds }}/{{ application.interviewRounds.length }} 轮
          </template>
        </span>
      </div>

      <!-- Materials Progress -->
      <div class="meta-item" v-if="materialsTotal > 0">
        <span>📋</span>
        <BaseProgress :value="materialsDone" :max="materialsTotal" />
      </div>
    </div>

    <div class="card-tags" v-if="tags.length > 0">
      <BaseTag v-for="tag in tags" :key="tag.text" :variant="tag.variant">
        {{ tag.text }}
      </BaseTag>
    </div>

    <div class="card-actions">
      <button class="action-btn" @click.stop="emit('edit', application.id)" title="编辑">✏️</button>
      <button class="action-btn" @click.stop="onDelete" title="删除">🗑️</button>
    </div>
  </div>
</template>

<style scoped>
.app-card {
  background: white;
  border-radius: var(--radius-sm);
  padding: 16px;
  box-shadow: var(--shadow-sm);
  cursor: grab;
  transition: all 0.2s;
  border: 1px solid transparent;
  position: relative;
}

.app-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.app-card.dragging {
  opacity: 0.5;
  transform: rotate(3deg) scale(1.02);
  box-shadow: var(--shadow-lg);
}

.app-card.overdue {
  border-left: 3px solid var(--danger);
}

.app-card.new-offer {
  border-left: 3px solid var(--success);
}

.card-company {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.company-logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
}

.company-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--gray-900);
}

.card-position {
  font-size: 13px;
  color: var(--gray-500);
  margin-bottom: 12px;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-500);
}

.meta-item.soon { color: var(--warning); }
.meta-item.overdue { color: var(--danger); }
.meta-item.test-info { color: var(--warning); }
.meta-item.interview-info { color: var(--purple); }

.deadline {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.deadline.safe { background: var(--success-light); color: var(--success); }
.deadline.soon { background: var(--warning-light); color: var(--warning); }
.deadline.overdue { background: var(--danger-light); color: var(--danger); }

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.app-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  padding: 6px;
  border: none;
  background: var(--gray-100);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gray-500);
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}
</style>
