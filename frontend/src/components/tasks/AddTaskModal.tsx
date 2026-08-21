'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import Modal from '@/components/ui/Modal';
import type { Task, Priority, Status } from '@/lib/types';

const priorities: { key: Priority; label: string }[] = [
  { key: 'none', label: 'No Priority' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

const statuses: { key: Status; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'doing', label: 'Doing' },
  { key: 'completed', label: 'Completed' },
  { key: 'on-hold', label: 'On Hold' },
];

export default function AddTaskModal({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId?: string }) {
  const { dispatch, state } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [status, setStatus] = useState<Status>('todo');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `t${Date.now()}`,
      title: title.trim(),
      description,
      status,
      priority,
      members: [state.user.id],
      dueDate,
      labels: [],
      reporter: state.user.id,
      projectId: projectId || null,
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    setTitle('');
    setDescription('');
    setPriority('none');
    setStatus('todo');
    setDueDate('');
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full px-3 py-2.5 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-text-primary placeholder:text-text-tertiary"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Task description..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-text-primary placeholder:text-text-tertiary resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2.5 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
            >
              {priorities.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="w-full px-3 py-2.5 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
            >
              {statuses.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1.5">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-bg-hover transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}
