// 申请阶段
export type StageType = 'intention' | 'applied' | 'test' | 'interview' | 'ended' | 'offer'

// 申请结果
export type OutcomeType = 'offer' | 'rejected'

// 面试轮次名称
export type InterviewRoundName = '一面' | '二面' | '三面' | '四面' | '五面' | '六面' | 'HR面' | '总监面' | '综合面'

// 面试轮次状态
export type InterviewRoundStatus = 'pending' | 'done' | 'cancelled'

// 单个材料
export interface Material {
  name: string
  done: boolean
}

// 面试轮次
export interface InterviewRound {
  id: string
  name: InterviewRoundName
  date: string
  time: string
  location: string
  status: InterviewRoundStatus
}

// 笔试信息
export interface TestInfo {
  date: string
  time: string
  content: string
}

// 申请记录
export interface Application {
  id: string
  company: string
  position: string
  link: string
  deadline: string
  materials: Material[]
  stage: StageType
  testInfo?: TestInfo
  interviewRounds: InterviewRound[]
  salary?: string
  notes?: string
  outcome?: OutcomeType
  createdAt: string
  updatedAt: string
}

// 看板列
export interface KanbanColumn {
  id: StageType
  name: string
  color: string
}

// 拖拽数据
export interface DragData {
  applicationId: string
  fromStage: StageType
}

// 统计数据
export interface Statistics {
  total: number
  applied: number
  interview: number
  offer: number
}

// 日历日期
export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  applications: Application[]
}

// 可选的面试轮次名称列表
export const INTERVIEW_ROUND_NAMES: InterviewRoundName[] = [
  '一面', '二面', '三面', '四面', '五面', '六面', 'HR面', '总监面', '综合面'
]
