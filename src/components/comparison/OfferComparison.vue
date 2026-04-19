<script setup lang="ts">
import { computed } from 'vue'
import { useApplicationStore } from '@/stores/application'
import BaseButton from '../common/BaseButton.vue'

const store = useApplicationStore()
const offers = computed(() => store.offers)

function formatDate(date: string): string {
  if (!date) return '-'
  return date
}
</script>

<template>
  <div class="offer-comparison">
    <div v-if="offers.length === 0" class="empty-state">
      <div class="empty-icon">🎓</div>
      <p>还没有Offer，继续加油！</p>
    </div>

    <div v-else class="comparison-table">
      <table>
        <thead>
          <tr>
            <th>公司</th>
            <th>职位</th>
            <th>薪资</th>
            <th>截止日期</th>
            <th>备注</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="offer in offers" :key="offer.id">
            <td><strong>{{ offer.company }}</strong></td>
            <td>{{ offer.position }}</td>
            <td>{{ offer.salary || '-' }}</td>
            <td>{{ formatDate(offer.deadline) }}</td>
            <td>{{ offer.notes || '-' }}</td>
            <td>
              <BaseButton variant="ghost" size="sm">编辑</BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.offer-comparison {
  background: white;
  border-radius: var(--radius);
  padding: 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-500);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
}

.comparison-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid var(--gray-100);
}

th {
  background: var(--gray-50);
  font-weight: 600;
  font-size: 13px;
  color: var(--gray-700);
}

td {
  font-size: 14px;
}

tr:last-child td {
  border-bottom: none;
}
</style>
