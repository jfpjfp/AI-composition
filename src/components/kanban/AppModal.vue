<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useApplicationStore } from '@/stores/application'
import type { Material, StageType, TestInfo, InterviewRound, InterviewRoundName } from '@/types/application'
import { INTERVIEW_ROUND_NAMES } from '@/types/application'
import BaseModal from '../common/BaseModal.vue'
import BaseButton from '../common/BaseButton.vue'

interface Props {
  show: boolean
  appId: string | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const store = useApplicationStore()

// Form fields
const company = ref('')
const position = ref('')
const deadline = ref('')
const link = ref('')
const notes = ref('')
const stage = ref<StageType>('intention')
const materials = ref<Material[]>([
  { name: '简历', done: false },
  { name: 'Cover Letter', done: false }
])

// Test info
const hasTestInfo = ref(false)
const testDate = ref('')
const testTime = ref('')
const testContent = ref('')

// Interview rounds
const interviewRounds = ref<InterviewRound[]>([])

const isEditing = computed(() => !!props.appId)
const modalTitle = computed(() => isEditing.value ? '编辑申请' : '新增申请')

const stageOptions: { value: StageType; label: string }[] = [
  { value: 'intention', label: '待投递' },
  { value: 'applied', label: '已投递' },
  { value: 'test', label: '笔试中' },
  { value: 'interview', label: '面试中' },
  { value: 'ended', label: '已结束' }
]

// Get available round names (not yet used)
function getAvailableRoundNames(): InterviewRoundName[] {
  const usedNames = interviewRounds.value.map(r => r.name)
  return INTERVIEW_ROUND_NAMES.filter(name => !usedNames.includes(name))
}

// Reset form when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.appId) {
      const app = store.getApplicationById(props.appId)
      if (app) {
        company.value = app.company
        position.value = app.position
        deadline.value = app.deadline
        link.value = app.link || ''
        notes.value = app.notes || ''
        stage.value = app.stage
        materials.value = app.materials.length > 0
          ? [...app.materials]
          : [{ name: '简历', done: false }]

        // Test info
        hasTestInfo.value = !!app.testInfo
        testDate.value = app.testInfo?.date || ''
        testTime.value = app.testInfo?.time || ''
        testContent.value = app.testInfo?.content || ''

        // Interview rounds
        interviewRounds.value = app.interviewRounds.length > 0
          ? [...app.interviewRounds]
          : []
      }
    } else {
      company.value = ''
      position.value = ''
      deadline.value = ''
      link.value = ''
      notes.value = ''
      stage.value = 'intention'
      materials.value = [
        { name: '简历', done: false },
        { name: 'Cover Letter', done: false }
      ]
      hasTestInfo.value = false
      testDate.value = ''
      testTime.value = ''
      testContent.value = ''
      interviewRounds.value = []
    }
  }
})

function addMaterial(): void {
  materials.value.push({ name: '', done: false })
}

function removeMaterial(index: number): void {
  if (materials.value.length > 1) {
    materials.value.splice(index, 1)
  }
}

function addInterviewRound(): void {
  const available = getAvailableRoundNames()
  if (available.length === 0) return

  interviewRounds.value.push({
    id: Date.now().toString(),
    name: available[0],
    date: '',
    time: '',
    location: '',
    status: 'pending'
  })
}

function removeInterviewRound(index: number): void {
  interviewRounds.value.splice(index, 1)
}

function updateRoundName(index: number, name: InterviewRoundName): void {
  interviewRounds.value[index].name = name
}

function save(): void {
  if (!company.value.trim()) {
    return
  }

  const validMaterials = materials.value.filter(m => m.name.trim())

  // Build test info if applicable
  const testInfo: TestInfo | undefined = hasTestInfo.value && testDate.value
    ? {
        date: testDate.value,
        time: testTime.value,
        content: testContent.value
      }
    : undefined

  // Filter valid interview rounds
  const validInterviewRounds = interviewRounds.value.filter(r => r.date)

  const appData: Record<string, any> = {
    company: company.value.trim(),
    position: position.value.trim(),
    deadline: deadline.value,
    link: link.value.trim(),
    notes: notes.value.trim(),
    materials: validMaterials,
    stage: stage.value,
    testInfo,
    interviewRounds: validInterviewRounds
  }

  if (isEditing.value && props.appId) {
    store.updateApplication(props.appId, appData)
  } else {
    store.addApplication(appData as any)
  }

  emit('close')
}
</script>

<template>
  <BaseModal :show="show" :title="modalTitle" width="560px" @close="emit('close')">
    <form @submit.prevent="save" class="form">
      <!-- Basic Info -->
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>

        <div class="form-row">
          <div class="form-group">
            <label>公司名称 *</label>
            <input v-model="company" type="text" placeholder="例如：字节跳动" required>
          </div>
          <div class="form-group">
            <label>职位名称 *</label>
            <input v-model="position" type="text" placeholder="例如：前端开发工程师">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>截止日期 *</label>
            <input v-model="deadline" type="date">
          </div>
          <div class="form-group">
            <label>初始状态</label>
            <select v-model="stage">
              <option v-for="opt in stageOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>申请链接</label>
          <input v-model="link" type="url" placeholder="https://...">
        </div>
      </div>

      <!-- Materials -->
      <div class="form-section">
        <h3 class="section-title">材料清单</h3>
        <div class="materials-list">
          <div v-for="(mat, index) in materials" :key="index" class="material-item">
            <input v-model="mat.done" type="checkbox">
            <input v-model="mat.name" type="text" placeholder="材料名称">
            <button type="button" class="remove-btn" @click="removeMaterial(index)">×</button>
          </div>
        </div>
        <button type="button" class="add-btn" @click="addMaterial">+ 添加材料</button>
      </div>

      <!-- Test Info -->
      <div class="form-section" v-if="stage === 'test' || hasTestInfo">
        <h3 class="section-title">
          <label class="checkbox-label">
            <input type="checkbox" v-model="hasTestInfo">
            <span>笔试信息</span>
          </label>
        </h3>
        <div v-if="hasTestInfo" class="test-info">
          <div class="form-row">
            <div class="form-group">
              <label>笔试日期</label>
              <input v-model="testDate" type="date">
            </div>
            <div class="form-group">
              <label>时间段</label>
              <input v-model="testTime" type="text" placeholder="如 14:00-16:00">
            </div>
          </div>
          <div class="form-group">
            <label>笔试内容备注</label>
            <input v-model="testContent" type="text" placeholder="如 编程题、选择题">
          </div>
        </div>
      </div>

      <!-- Interview Rounds -->
      <div class="form-section" v-if="stage === 'interview' || interviewRounds.length > 0">
        <h3 class="section-title">
          面试安排
        </h3>
        <div class="interview-rounds">
          <div v-for="(round, index) in interviewRounds" :key="round.id" class="round-item">
            <div class="round-header">
              <select :value="round.name" @change="updateRoundName(index, ($event.target as HTMLSelectElement).value as any)">
                <option v-for="name in getAvailableRoundNames().concat(round.name)" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
              <button type="button" class="remove-btn" @click="removeInterviewRound(index)">×</button>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>日期</label>
                <input v-model="round.date" type="date">
              </div>
              <div class="form-group">
                <label>时间段</label>
                <input v-model="round.time" type="text" placeholder="如 14:00-16:00">
              </div>
            </div>
            <div class="form-group">
              <label>地点/链接</label>
              <input v-model="round.location" type="text" placeholder="线上会议或具体地址">
            </div>
          </div>
        </div>
        <button
          type="button"
          class="add-btn"
          @click="addInterviewRound"
          :disabled="getAvailableRoundNames().length === 0"
        >
          + 添加面试轮次
        </button>
      </div>

      <!-- Notes -->
      <div class="form-section">
        <h3 class="section-title">备注</h3>
        <div class="form-group">
          <input v-model="notes" type="text" placeholder="其他备注信息">
        </div>
      </div>
    </form>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('close')">取消</BaseButton>
      <BaseButton @click="save">保存</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 4px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-row .form-group {
  flex: 1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-600);
}

.form-group input,
.form-group select {
  padding: 10px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.materials-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--gray-50);
  border-radius: var(--radius-sm);
}

.material-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.material-item input[type="text"] {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  padding: 4px;
}

.material-item input[type="text"]:focus {
  outline: none;
  background: white;
}

.remove-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: var(--gray-400);
}

.remove-btn:hover {
  color: var(--danger);
}

.add-btn {
  padding: 10px;
  border: 1px dashed var(--gray-300);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--gray-500);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(99, 102, 241, 0.05);
}

.add-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.test-info,
.interview-rounds {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.round-item {
  background: var(--gray-50);
  border-radius: var(--radius-sm);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.round-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.round-header select {
  padding: 6px 10px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
}
</style>
