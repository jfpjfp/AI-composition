export type DeadlineStatus = 'safe' | 'soon' | 'overdue'

export function getDeadlineStatus(deadline: string): DeadlineStatus {
  if (!deadline) return 'safe'
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diff = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)

  if (diff < 0) return 'overdue'
  if (diff <= 3) return 'soon'
  return 'safe'
}

export function formatDeadline(deadline: string): string {
  if (!deadline) return ''
  const d = new Date(deadline)
  const now = new Date()
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return `已过期 ${Math.abs(diff)}天`
  if (diff === 0) return '今天截止'
  if (diff === 1) return '明天截止'
  return `${d.getMonth() + 1}月${d.getDate()}日截止`
}

export function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export function isSameDate(date1: string, date2: string): boolean {
  return date1 === date2
}
