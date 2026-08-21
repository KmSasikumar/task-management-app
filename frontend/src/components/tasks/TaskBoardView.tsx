'use client';

import type { Task, Status } from '@/lib/types';
import { useApp } from '@/lib/store';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import { useState } from 'react';

const columns: { status: Status; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: 'bg-gray-400' },
  { status: 'doing', label: 'Doing', color: 'bg-blue-500' },
  { status: 'completed', label: 'Completed', color: 'bg-green-500' },
  { status: 'on-hold', label: 'On Hold', color: 'bg-yellow-500' },
];

function formatShortDate(d: string) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
}

export default function TaskBoardView({ tasks }: { tasks: Task[] }) {
  const { dispatch } = useApp();
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData('text/plain', taskId);
    (e.target as HTMLElement).classList.add('dragging');
  }

  function handleDragEnd(e: React.DragEvent) {
    (e.target as HTMLElement).classList.remove('dragging');
    setDragOverCol(null);
  }

  function handleDrop(e: React.DragEvent, status: Status) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
    setDragOverCol(null);
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map(col => {
        const colTasks = tasks.filter(t => t.status === col.status);
        return (
          <div
            key={col.status}
            className={`min-w-[280px] w-[280px] shrink-0 rounded-xl bg-bg-secondary border border-border p-3 transition-colors ${dragOverCol === col.status ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOverCol(col.status); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={e => handleDrop(e, col.status)}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold text-text-primary">{col.label}</span>
                <span className="text-xs text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary hover:text-accent transition-colors text-sm">+</button>
                <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary transition-colors text-sm">⋯</button>
              </div>
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {colTasks.map(task => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  draggable
                  onDragStart={e => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  className="block bg-bg-primary rounded-xl border border-border p-3.5 hover:shadow-md hover:border-accent/30 transition-all cursor-grab active:cursor-grabbing group"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <h3 className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors leading-snug">{task.title}</h3>
                    <button className="w-5 h-5 flex items-center justify-center rounded text-text-tertiary opacity-0 group-hover:opacity-100 hover:bg-bg-hover transition-all text-xs shrink-0 ml-2">⋯</button>
                  </div>

                  <div className="flex items-center gap-2 mb-2.5">
                    {task.members.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar userId={task.members[0]} size="xs" />
                        <span className="text-xs text-text-secondary">{task.reporter === task.members[0] ? 'Admin' : 'Member'}</span>
                      </div>
                    ) : null}

                    {task.dueDate && (
                      <div className="flex items-center gap-1 ml-auto">
                        <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
                        </svg>
                        <span className="text-xs text-red-400 font-medium">{formatShortDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {task.labels.slice(0, 2).map(label => (
                        <span key={label} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary font-medium">
                          ◈ {label}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Add Task */}
            <button
              onClick={() => {
                const newTask: Task = {
                  id: `t${Date.now()}`, title: 'New Task', description: '', status: col.status,
                  priority: 'none', members: [], dueDate: '', labels: [], reporter: '',
                  projectId: null, subtasks: [], comments: [],
                  createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
                };
                dispatch({ type: 'ADD_TASK', payload: newTask });
              }}
              className="w-full mt-2.5 py-2 text-sm text-text-tertiary hover:text-accent transition-colors flex items-center gap-1.5 justify-center rounded-lg hover:bg-bg-hover"
            >
              <span>+</span> Add Task
            </button>
          </div>
        );
      })}
    </div>
  );
}
