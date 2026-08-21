'use client';

import Link from 'next/link';
import type { Task, Status } from '@/lib/types';
import { useApp } from '@/lib/store';
import PriorityBadge from '@/components/ui/PriorityBadge';
import Avatar from '@/components/ui/Avatar';

const statusConfig: Record<Status, { label: string; color: string }> = {
  'todo': { label: 'To Do', color: 'bg-gray-400' },
  'doing': { label: 'Doing', color: 'bg-blue-500' },
  'completed': { label: 'Completed', color: 'bg-green-500' },
  'on-hold': { label: 'On Hold', color: 'bg-yellow-500' },
  'backlog': { label: 'Backlog', color: 'bg-orange-400' },
};

const statusOrder: Status[] = ['todo', 'doing', 'completed', 'on-hold'];

function formatDate(d: string) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function TaskListView({ tasks }: { tasks: Task[] }) {
  const { state, dispatch } = useApp();

  const grouped = statusOrder.reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status);
    return acc;
  }, {} as Record<Status, Task[]>);

  return (
    <div className="space-y-6">
      {statusOrder.map(status => {
        const items = grouped[status];
        if (!items) return null;
        const cfg = statusConfig[status];
        return (
          <StatusGroup key={status} status={status} config={cfg} tasks={items} fieldVisibility={state.fieldVisibility} dispatch={dispatch} />
        );
      })}
    </div>
  );
}

function StatusGroup({
  status, config, tasks, fieldVisibility, dispatch,
}: {
  status: Status;
  config: { label: string; color: string };
  tasks: Task[];
  fieldVisibility: typeof import('@/lib/types').FieldVisibility extends never ? never : { priority: boolean; members: boolean; dueDate: boolean; labels: boolean; status: boolean; reporter: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="animate-fadeIn">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 mb-3 group"
      >
        <svg className={`w-3 h-3 text-text-tertiary transition-transform ${collapsed ? '-rotate-90' : ''}`} fill="currentColor" viewBox="0 0 12 12">
          <path d="M2 4l4 4 4-4z"/>
        </svg>
        <span className="text-sm font-semibold text-text-primary">{config.label}</span>
      </button>

      {!collapsed && (
        <div className="border border-border rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center bg-bg-secondary px-4 py-2.5 border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wider">
            <div className="flex-1 min-w-[200px]">Task</div>
            {fieldVisibility.priority && <div className="w-[120px]">Priority</div>}
            {fieldVisibility.members && <div className="w-[120px]">Members</div>}
            {fieldVisibility.dueDate && <div className="w-[140px]">Due Date</div>}
            <div className="w-[80px] text-right">Actions</div>
          </div>

          {/* Rows */}
          {tasks.length === 0 ? (
            <div className="px-4 py-6 text-sm text-text-tertiary text-center">No tasks</div>
          ) : (
            tasks.map(task => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center px-4 py-3 border-b border-border-light last:border-b-0 hover:bg-bg-hover transition-colors group"
              >
                <div className="flex-1 min-w-[200px] text-sm font-medium text-text-primary group-hover:text-accent transition-colors">{task.title}</div>
                {fieldVisibility.priority && (
                  <div className="w-[120px]">
                    <PriorityBadge priority={task.priority} />
                  </div>
                )}
                {fieldVisibility.members && (
                  <div className="w-[120px]">
                    <div className="flex -space-x-1.5">
                      {task.members.length > 0 ? (
                        task.members.slice(0, 3).map(m => <Avatar key={m} userId={m} size="sm" />)
                      ) : (
                        <button className="w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-tertiary text-xs hover:border-accent hover:text-accent transition-colors">+</button>
                      )}
                    </div>
                  </div>
                )}
                {fieldVisibility.dueDate && (
                  <div className="w-[140px] text-sm text-text-secondary">{formatDate(task.dueDate)}</div>
                )}
                <div className="w-[80px] flex justify-end">
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); dispatch({ type: 'DELETE_TASK', payload: task.id }); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-bg-tertiary text-text-tertiary hover:text-text-primary transition-all"
                  >
                    ⋯
                  </button>
                </div>
              </Link>
            ))
          )}

          {/* Add Task */}
          <button
            onClick={() => {
              const newTask: Task = {
                id: `t${Date.now()}`, title: 'New Task', description: '', status,
                priority: 'none', members: [], dueDate: '', labels: [], reporter: '',
                projectId: null, subtasks: [], comments: [],
                createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
              };
              dispatch({ type: 'ADD_TASK', payload: newTask });
            }}
            className="w-full px-4 py-2.5 text-sm text-text-tertiary hover:text-accent hover:bg-bg-hover transition-colors text-left flex items-center gap-1.5"
          >
            <span className="text-base">+</span> Add Task
          </button>
        </div>
      )}
    </div>
  );
}

// Need useState import
import { useState } from 'react';
