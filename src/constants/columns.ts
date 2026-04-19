import type { KanbanColumn } from '@/types/application'

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'intention', name: '待投递', color: '#6B7280' },
  { id: 'applied', name: '已投递', color: '#6366F1' },
  { id: 'test', name: '笔试中', color: '#F59E0B' },
  { id: 'interview', name: '面试中', color: '#8B5CF6' },
  { id: 'ended', name: '未通过', color: '#374151' },
  { id: 'offer', name: 'Offer', color: '#10B981' }
]
