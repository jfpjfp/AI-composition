import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Application, StageType, Material, Statistics } from '@/types/application'

const STORAGE_KEY = 'job-tracker-applications'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getSampleData(): Application[] {
  const now = new Date()
  const addDays = (days: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  return [
    {
      id: generateId(),
      company: '字节跳动',
      position: '前端开发工程师',
      deadline: addDays(7),
      link: 'https://jobs.bytedance.com',
      notes: '看重算法',
      materials: [
        { name: '简历', done: true },
        { name: 'Cover Letter', done: true },
        { name: '作品集', done: false }
      ],
      stage: 'interview',
      testInfo: {
        date: addDays(-3),
        time: '14:00-16:00',
        content: '编程题 + 选择题'
      },
      interviewRounds: [
        {
          id: '1',
          name: '一面',
          date: addDays(-1),
          time: '10:00-11:00',
          location: '线上会议',
          status: 'done'
        },
        {
          id: '2',
          name: '二面',
          date: addDays(2),
          time: '14:00-15:00',
          location: '线上会议',
          status: 'pending'
        }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    },
    {
      id: generateId(),
      company: '阿里巴巴',
      position: '全栈开发实习生',
      deadline: addDays(3),
      link: '',
      notes: '急招',
      materials: [
        { name: '简历', done: true },
        { name: '成绩单', done: true },
        { name: '推荐信', done: false }
      ],
      stage: 'test',
      testInfo: {
        date: addDays(1),
        time: '09:00-12:00',
        content: '在线测评'
      },
      interviewRounds: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    },
    {
      id: generateId(),
      company: '腾讯',
      position: '后台开发工程师',
      deadline: addDays(14),
      link: '',
      notes: '',
      materials: [
        { name: '简历', done: true },
        { name: 'Cover Letter', done: false }
      ],
      stage: 'applied',
      interviewRounds: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    },
    {
      id: generateId(),
      company: '美团',
      position: '前端工程师',
      deadline: addDays(-2),
      link: '',
      notes: '',
      materials: [
        { name: '简历', done: true }
      ],
      stage: 'intention',
      interviewRounds: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    },
    {
      id: generateId(),
      company: '小红书',
      position: 'UI设计师',
      deadline: addDays(-10),
      link: '',
      notes: '已拿到口头Offer',
      materials: [],
      stage: 'ended',
      outcome: 'offer',
      interviewRounds: [
        {
          id: '1',
          name: '一面',
          date: addDays(-15),
          time: '14:00',
          location: '线下',
          status: 'done'
        },
        {
          id: '2',
          name: '二面',
          date: addDays(-12),
          time: '15:00',
          location: '线下',
          status: 'done'
        },
        {
          id: '3',
          name: 'HR面',
          date: addDays(-8),
          time: '10:00',
          location: '线上会议',
          status: 'done'
        }
      ],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    }
  ]
}

function loadFromStorage(): Application[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    return JSON.parse(data)
  }
  // Initialize with sample data
  const samples = getSampleData()
  saveToStorage(samples)
  return samples
}

function saveToStorage(apps: Application[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apps))
}

export const useApplicationStore = defineStore('application', () => {
  // State
  const applications = ref<Application[]>(loadFromStorage())

  // Getters
  const total = computed(() => applications.value.length)

  const applied = computed(() =>
    applications.value.filter(a => a.stage === 'applied').length
  )

  const interview = computed(() =>
    applications.value.filter(a => a.stage === 'interview' || a.stage === 'test').length
  )

  const offer = computed(() =>
    applications.value.filter(a => a.outcome === 'offer').length
  )

  const statistics = computed<Statistics>(() => ({
    total: total.value,
    applied: applied.value,
    interview: interview.value,
    offer: offer.value
  }))

  const offers = computed(() =>
    applications.value.filter(a => a.outcome === 'offer')
  )

  // Actions
  function getApplicationsByStage(stage: StageType): Application[] {
    return applications.value.filter(a => a.stage === stage)
  }

  function getApplicationById(id: string): Application | undefined {
    return applications.value.find(a => a.id === id)
  }

  function addApplication(data: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): void {
    const app: Application = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    applications.value.push(app)
    persist()
  }

  function updateApplication(id: string, data: Partial<Application>): void {
    const index = applications.value.findIndex(a => a.id === id)
    if (index !== -1) {
      applications.value[index] = {
        ...applications.value[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      persist()
    }
  }

  function updateStage(id: string, stage: StageType): void {
    updateApplication(id, { stage })
  }

  function deleteApplication(id: string): void {
    applications.value = applications.value.filter(a => a.id !== id)
    persist()
  }

  function updateMaterials(id: string, materials: Material[]): void {
    updateApplication(id, { materials })
  }

  function searchApplications(keyword: string): Application[] {
    const kw = keyword.toLowerCase()
    return applications.value.filter(a =>
      a.company.toLowerCase().includes(kw) ||
      a.position.toLowerCase().includes(kw)
    )
  }

  function persist(): void {
    saveToStorage(applications.value)
  }

  return {
    applications,
    total,
    applied,
    interview,
    offer,
    statistics,
    offers,
    getApplicationsByStage,
    getApplicationById,
    addApplication,
    updateApplication,
    updateStage,
    deleteApplication,
    updateMaterials,
    searchApplications,
    persist
  }
})
