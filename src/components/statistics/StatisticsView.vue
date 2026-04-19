<script setup lang="ts">
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/application'
import type { Application } from '@/types/application'

const store = useApplicationStore()

// 待投递
const intentionApps = computed(() =>
  store.applications.filter(a => a.stage === 'intention')
)

// 笔试中
const testApps = computed(() =>
  store.applications.filter(a => a.stage === 'test')
)

// 面试中
const interviewApps = computed(() =>
  store.applications.filter(a => a.stage === 'interview')
)

// Offer
const offerApps = computed(() =>
  store.applications.filter(a => a.outcome === 'offer')
)

// 未通过
const rejectedApps = computed(() =>
  store.applications.filter(a => a.stage === 'ended' && a.outcome === 'rejected')
)

function formatDate(date: string): string {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function getInterviewInfo(app: Application): string {
  if (app.interviewRounds.length === 0) return '-'
  const pending = app.interviewRounds.find(r => r.status === 'pending')
  if (pending) {
    return `${pending.name} ${formatDate(pending.date)} ${pending.time || ''}`
  }
  const lastDone = app.interviewRounds.filter(r => r.status === 'done').pop()
  if (lastDone) {
    return `已完${lastDone.name}`
  }
  return '-'
}

function getOfferDate(app: Application): string {
  // 假设 offer 日期是最后一个面试轮次的日期或者 updatedAt
  const lastRound = app.interviewRounds.filter(r => r.status === 'done').pop()
  if (lastRound) {
    return formatDate(lastRound.date)
  }
  return '-'
}
</script>

<template>
  <div class="statistics-view">
    <!-- 面试中 -->
    <section class="stat-section">
      <h2 class="section-title">
        <span class="dot" style="background: #8B5CF6;"></span>
        面试中 ({{ interviewApps.length }})
      </h2>
      <div v-if="interviewApps.length === 0" class="empty-text">暂无</div>
      <div v-else class="app-list">
        <div v-for="app in interviewApps" :key="app.id" class="app-item">
          <div class="app-info">
            <strong>{{ app.company }}</strong>
            <span class="position">{{ app.position }}</span>
          </div>
          <div class="app-detail">
            <span class="tag interview-tag">面试中</span>
            <span class="interview-info">💬 {{ getInterviewInfo(app) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 笔试中 -->
    <section class="stat-section">
      <h2 class="section-title">
        <span class="dot" style="background: #F59E0B;"></span>
        笔试中 ({{ testApps.length }})
      </h2>
      <div v-if="testApps.length === 0" class="empty-text">暂无</div>
      <div v-else class="app-list">
        <div v-for="app in testApps" :key="app.id" class="app-item">
          <div class="app-info">
            <strong>{{ app.company }}</strong>
            <span class="position">{{ app.position }}</span>
          </div>
          <div class="app-detail">
            <span class="tag test-tag">笔试中</span>
            <span v-if="app.testInfo" class="test-info">
              ✍️ {{ formatDate(app.testInfo.date) }} {{ app.testInfo.time || '' }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 待投递 -->
    <section class="stat-section">
      <h2 class="section-title">
        <span class="dot" style="background: #6B7280;"></span>
        待投递 ({{ intentionApps.length }})
      </h2>
      <div v-if="intentionApps.length === 0" class="empty-text">暂无</div>
      <div v-else class="app-list">
        <div v-for="app in intentionApps" :key="app.id" class="app-item">
          <div class="app-info">
            <strong>{{ app.company }}</strong>
            <span class="position">{{ app.position }}</span>
          </div>
          <div class="app-detail">
            <span class="tag intention-tag">待投递</span>
            <span v-if="app.deadline" class="deadline">📅 {{ formatDate(app.deadline) }} 截止</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Offer -->
    <section class="stat-section">
      <h2 class="section-title">
        <span class="dot" style="background: #10B981;"></span>
        Offer ({{ offerApps.length }})
      </h2>
      <div v-if="offerApps.length === 0" class="empty-text">暂无</div>
      <div v-else class="app-list">
        <div v-for="app in offerApps" :key="app.id" class="app-item">
          <div class="app-info">
            <strong>{{ app.company }}</strong>
            <span class="position">{{ app.position }}</span>
          </div>
          <div class="app-detail">
            <span class="tag offer-tag">Offer</span>
            <span class="offer-date">🎉 获得时间: {{ getOfferDate(app) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 未通过 -->
    <section class="stat-section">
      <h2 class="section-title">
        <span class="dot" style="background: #EF4444;"></span>
        未通过 ({{ rejectedApps.length }})
      </h2>
      <div v-if="rejectedApps.length === 0" class="empty-text">暂无</div>
      <div v-else class="app-list">
        <div v-for="app in rejectedApps" :key="app.id" class="app-item">
          <div class="app-info">
            <strong>{{ app.company }}</strong>
            <span class="position">{{ app.position }}</span>
          </div>
          <div class="app-detail">
            <span class="tag rejected-tag">未通过</span>
            <span class="notes">{{ app.notes || '-' }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.statistics-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-section {
  background: white;
  border-radius: var(--radius);
  padding: 20px 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.empty-text {
  color: var(--gray-400);
  font-size: 14px;
  padding: 12px 0;
}

.app-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.app-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.app-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.app-info strong {
  font-size: 14px;
  color: var(--gray-900);
}

.position {
  font-size: 13px;
  color: var(--gray-500);
}

.app-detail {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--gray-600);
}

.tag {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.intention-tag {
  background: var(--gray-100);
  color: var(--gray-600);
}

.test-tag {
  background: var(--warning-light);
  color: var(--warning);
}

.interview-tag {
  background: rgba(139, 92, 246, 0.1);
  color: var(--purple);
}

.offer-tag {
  background: var(--success-light);
  color: var(--success);
}

.rejected-tag {
  background: var(--danger-light);
  color: var(--danger);
}

.deadline,
.test-info,
.interview-info,
.offer-date {
  color: var(--gray-500);
}

.notes {
  color: var(--gray-400);
  font-size: 12px;
}
</style>
