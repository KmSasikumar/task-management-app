'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import type { Task, Priority, Status, Subtask, Comment } from '@/lib/types';
import PriorityBadge from '@/components/ui/PriorityBadge';
import Avatar from '@/components/ui/Avatar';
import DatePicker from '@/components/ui/DatePicker';

const statusConfig: Record<Status, { label: string; color: string; dotColor: string }> = {
  'todo': { label: 'To Do', color: 'text-gray-600', dotColor: 'bg-gray-400' },
  'doing': { label: 'Doing', color: 'text-blue-600', dotColor: 'bg-blue-500' },
  'completed': { label: 'Completed', color: 'text-green-600', dotColor: 'bg-green-500' },
  'on-hold': { label: 'On Hold', color: 'text-yellow-600', dotColor: 'bg-yellow-500' },
  'backlog': { label: 'Backlog', color: 'text-orange-600', dotColor: 'bg-orange-400' },
};

const priorityOptions: { key: Priority; label: string }[] = [
  { key: 'none', label: 'No Priority' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

function generateId(prefix: string) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

function formatDate(d: string) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatRelative(d: string) {
  if (!d) return '';
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { state, dispatch, members } = useApp();
  const task = state.tasks.find(t => t.id === id);

  const [priorityOpen, setPriorityOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  if (!task) {
    return (
      <div className="p-8 text-center">
        <p className="text-text-secondary mb-4">Task not found</p>
        <button onClick={() => router.push('/tasks')} className="text-accent hover:underline">← Back to Tasks</button>
      </div>
    );
  }

  function updateTask(updates: Partial<Task>) {
    dispatch({ type: 'UPDATE_TASK', payload: { ...task!, ...updates, updatedAt: new Date().toISOString() } });
  }

  function addComment() {
    if (!commentText.trim()) return;
    const comment: Comment = {
      id: generateId('c'),
      userId: state.user.id,
      userName: state.user.name,
      userAvatar: '',
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: { taskId: task!.id, comment } });
    setCommentText('');
  }

  function addSubtask() {
    if (!newSubtaskTitle.trim()) return;
    const subtask: Subtask = {
      id: generateId('st'),
      title: newSubtaskTitle.trim(),
      priority: 'none',
      members: [],
      dueDate: '',
      status: 'todo',
    };
    dispatch({ type: 'ADD_SUBTASK', payload: { taskId: task!.id, subtask } });
    setNewSubtaskTitle('');
  }

  const assignee = task.members[0] ? members[task.members[0]] : null;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl">
        {/* Header icons */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.back()} className="text-text-secondary hover:text-text-primary transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/></svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors">⋯</button>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text-primary mb-2">{task.title}</h1>
        <p className="text-sm text-text-secondary mb-6 leading-relaxed">{task.description}</p>

        {/* Properties */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-text-secondary font-medium">Properties</span>
          {assignee && (
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">A</span>
              <Avatar userId={assignee.id} size="xs" />
              <span className="text-sm text-text-primary">{assignee.title || assignee.name}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1.5 bg-red-50 text-red-500 px-2.5 py-1 rounded-md text-sm font-medium">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-text-secondary font-medium">Labels</span>
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map(label => (
                <span key={label} className="text-xs px-2.5 py-1 rounded-full bg-bg-tertiary text-text-secondary font-medium">
                  ◈ {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-sm text-text-secondary font-medium">Resources</span>
          <button className="text-sm text-text-tertiary hover:text-accent transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
            Add document or link...
          </button>
        </div>

        {/* Subtasks table */}
        <div className="mb-8">
          <button className="flex items-center gap-2 mb-3 text-sm font-semibold text-text-primary">
            <svg className="w-3 h-3 text-text-tertiary" fill="currentColor" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4z"/></svg>
            Subtasks
          </button>

          <div className="border border-border rounded-xl overflow-hidden">
            <div className="flex items-center bg-bg-secondary px-4 py-2 border-b border-border text-xs font-medium text-text-secondary uppercase tracking-wider">
              <div className="flex-1 min-w-[160px]">Task</div>
              <div className="w-[100px]">Priority</div>
              <div className="w-[100px]">Members</div>
              <div className="w-[120px]">Due Date</div>
              <div className="w-[60px] text-right">Actions</div>
            </div>

            {task.subtasks.map(st => (
              <div key={st.id} className="flex items-center px-4 py-2.5 border-b border-border-light last:border-b-0 hover:bg-bg-hover transition-colors">
                <div className="flex-1 min-w-[160px] text-sm text-text-primary">{st.title}</div>
                <div className="w-[100px]"><PriorityBadge priority={st.priority} /></div>
                <div className="w-[100px]">
                  {st.members.length > 0 ? (
                    <div className="flex -space-x-1"><Avatar userId={st.members[0]} size="sm" /></div>
                  ) : (
                    <button className="w-6 h-6 rounded-full border-2 border-dashed border-border flex items-center justify-center text-text-tertiary text-xs">+</button>
                  )}
                </div>
                <div className="w-[120px] text-sm text-text-secondary">{formatDate(st.dueDate)}</div>
                <div className="w-[60px] text-right text-text-tertiary">⋯</div>
              </div>
            ))}

            {/* Add subtask */}
            <div className="flex items-center px-4 py-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') addSubtask(); }}
                placeholder="+ Add Subtasks"
                className="flex-1 text-sm text-text-tertiary placeholder:text-text-tertiary bg-transparent focus:outline-none focus:text-text-primary"
              />
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Subtasks</h3>
          <div className="space-y-4">
            {task.comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar userId={comment.userId} name={comment.userName} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-text-primary">{comment.userName}</span>
                    <span className="text-xs text-text-tertiary">{formatRelative(comment.createdAt)}</span>
                    <div className="ml-auto flex gap-1">
                      <button className="text-text-tertiary hover:text-text-secondary">😊</button>
                      <button className="text-text-tertiary hover:text-text-secondary">⋯</button>
                    </div>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed">{comment.content}</p>
                  {/* Reply */}
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar userId={state.user.id} size="xs" />
                    <input
                      type="text"
                      placeholder="Leave a reply..."
                      className="flex-1 text-sm text-text-tertiary placeholder:text-text-tertiary bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add comment */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Avatar userId={state.user.id} size="md" />
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addComment(); }}
            placeholder="Add a comment..."
            className="flex-1 text-sm text-text-primary placeholder:text-text-tertiary bg-transparent focus:outline-none"
          />
          <div className="flex gap-2">
            <button className="text-text-tertiary hover:text-text-secondary transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
            </button>
            <button onClick={addComment} className="text-accent hover:text-accent-hover transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Details */}
      <div className="w-[280px] min-w-[280px] border-l border-border bg-bg-primary p-5 overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4z"/></svg>
            Details
          </h3>
          <div className="flex gap-1">
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary text-xs">+</button>
            <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-bg-hover text-text-tertiary">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Status</label>
          <div className="relative">
            <button
              onClick={() => setStatusOpen(!statusOpen)}
              className="flex items-center gap-2 text-sm"
            >
              <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[task.status].dotColor}`} />
              <span className={statusConfig[task.status].color}>{statusConfig[task.status].label}</span>
            </button>
            {statusOpen && (
              <div className="absolute top-full left-0 mt-1 bg-bg-primary border border-border rounded-xl shadow-lg p-2 min-w-[140px] z-10 animate-scaleIn">
                {(Object.keys(statusConfig) as Status[]).map(s => (
                  <button
                    key={s}
                    onClick={() => { updateTask({ status: s }); setStatusOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${statusConfig[s].dotColor}`} />
                    {statusConfig[s].label}
                    {task.status === s && <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Priority</label>
          <div className="relative">
            <button onClick={() => setPriorityOpen(!priorityOpen)} className="flex items-center gap-1.5">
              <PriorityBadge priority={task.priority} />
              <svg className="w-3 h-3 text-text-tertiary" fill="currentColor" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4z"/></svg>
            </button>
            {priorityOpen && (
              <div className="absolute top-full left-0 mt-1 bg-bg-primary border border-border rounded-xl shadow-lg p-2 min-w-[160px] z-10 animate-scaleIn">
                <p className="px-3 py-1 text-xs font-medium text-text-tertiary">Priority</p>
                {priorityOptions.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => { updateTask({ priority: opt.key }); setPriorityOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                  >
                    <PriorityBadge priority={opt.key} showLabel={false} />
                    <span>{opt.label}</span>
                    {task.priority === opt.key && <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Members</label>
          <div className="flex items-center gap-1.5">
            {task.members.map(m => <Avatar key={m} userId={m} size="sm" />)}
            <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-accent transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
              Add members
            </button>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Dates</label>
          <div className="relative">
            <button onClick={() => setDatePickerOpen(!datePickerOpen)} className="text-sm text-text-primary hover:text-accent transition-colors">
              {task.dueDate ? formatDate(task.dueDate) : 'Set date...'}
            </button>
            {datePickerOpen && (
              <div className="absolute top-full left-0 mt-1 bg-bg-primary border border-border rounded-xl shadow-lg z-10">
                <DatePicker value={task.dueDate} onChange={d => updateTask({ dueDate: d })} onClose={() => setDatePickerOpen(false)} />
              </div>
            )}
          </div>
        </div>

        {/* Labels */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Labels</label>
          <div className="flex flex-wrap gap-1">
            {task.labels.map(l => (
              <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-bg-tertiary text-text-secondary">{l}</span>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="mb-4">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Teams</label>
          <span className="text-sm text-text-tertiary">—</span>
        </div>

        {/* Reporter */}
        <div className="mb-6">
          <label className="text-xs text-text-secondary font-medium mb-1 block">Reporter</label>
          {task.reporter ? <Avatar userId={task.reporter} size="sm" /> : <span className="text-sm text-text-tertiary">—</span>}
        </div>

        {/* Updates */}
        <div>
          <button className="flex items-center gap-2 mb-3 text-sm font-semibold text-text-primary">
            <svg className="w-3 h-3 text-text-tertiary" fill="currentColor" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4z"/></svg>
            Updates
          </button>
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <Avatar userId={state.user.id} size="xs" />
              <div>
                <p className="text-xs text-text-secondary">priority from No priority to Ur...</p>
                <p className="text-xs text-text-tertiary">You · posted an update · Aug 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
