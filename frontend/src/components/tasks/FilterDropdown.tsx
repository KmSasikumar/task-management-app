'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import Dropdown from '@/components/ui/Dropdown';
import type { Priority, Status } from '@/lib/types';

const filterCategories = [
  { key: 'status', label: 'Status', icon: '◉' },
  { key: 'priority', label: 'Priority', icon: '▮' },
  { key: 'members', label: 'Members', icon: '👤' },
  { key: 'dueDate', label: 'Due Date', icon: '📅' },
  { key: 'teams', label: 'Teams', icon: '👥' },
  { key: 'labels', label: 'Labels', icon: '🏷️' },
  { key: 'reporter', label: 'Reporter', icon: '🧑' },
];

const priorityOptions: { key: Priority; label: string; color: string }[] = [
  { key: 'none', label: 'No Priority', color: 'text-gray-400' },
  { key: 'urgent', label: 'Urgent', color: 'text-red-500' },
  { key: 'high', label: 'High', color: 'text-orange-500' },
  { key: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { key: 'low', label: 'Low', color: 'text-gray-400' },
];

const statusOptions: { key: Status; label: string; color: string }[] = [
  { key: 'todo', label: 'To Do', color: 'bg-gray-400' },
  { key: 'doing', label: 'Doing', color: 'bg-blue-500' },
  { key: 'completed', label: 'Completed', color: 'bg-green-500' },
  { key: 'on-hold', label: 'On Hold', color: 'bg-yellow-500' },
  { key: 'backlog', label: 'Backlog', color: 'bg-orange-400' },
];

export default function FilterDropdown() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  function togglePriority(p: Priority) {
    const current = state.filters.priority;
    const next = current.includes(p) ? current.filter(x => x !== p) : [...current, p];
    dispatch({ type: 'SET_FILTER', payload: { priority: next } });
  }

  function toggleStatus(s: Status) {
    const current = state.filters.status;
    const next = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
    dispatch({ type: 'SET_FILTER', payload: { status: next } });
  }

  const hasFilters = state.filters.priority.length > 0 || state.filters.status.length > 0;

  return (
    <Dropdown
      open={open}
      onClose={() => { setOpen(false); setActiveCategory(null); }}
      align="right"
      trigger={
        <button
          onClick={() => setOpen(!open)}
          className={`h-9 w-9 flex items-center justify-center rounded-lg border transition-colors ${hasFilters ? 'border-accent text-accent bg-accent-light' : 'border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover'}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
          </svg>
        </button>
      }
    >
      <div className="flex min-w-[360px]">
        {/* Categories */}
        <div className="border-r border-border py-2 px-1 min-w-[160px]">
          {filterCategories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors ${activeCategory === cat.key ? 'bg-accent-light text-accent font-medium' : 'text-text-primary hover:bg-bg-hover'}`}
            >
              <span className="text-xs">{cat.icon}</span>
              {cat.label}
              <svg className="w-3 h-3 ml-auto text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          ))}
        </div>

        {/* Sub-options */}
        <div className="py-2 px-1 min-w-[180px]">
          {activeCategory === 'priority' && (
            <>
              <p className="px-3 py-1 text-xs font-medium text-text-tertiary">Priority</p>
              {priorityOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => togglePriority(opt.key)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                >
                  <span className={`${opt.color} text-xs`}>
                    {opt.key === 'none' ? '·' : opt.key === 'urgent' ? '🔴' : opt.key === 'high' ? '🟠' : opt.key === 'medium' ? '🟡' : '⚪'}
                  </span>
                  <span className={opt.color}>{opt.label}</span>
                  {state.filters.priority.includes(opt.key) && (
                    <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  )}
                </button>
              ))}
            </>
          )}
          {activeCategory === 'status' && (
            <>
              <p className="px-3 py-1 text-xs font-medium text-text-tertiary">Status</p>
              {statusOptions.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => toggleStatus(opt.key)}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${opt.color}`} />
                  <span className="text-text-primary">{opt.label}</span>
                  {state.filters.status.includes(opt.key) && (
                    <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  )}
                </button>
              ))}
            </>
          )}
          {!activeCategory && (
            <div className="px-3 py-6 text-sm text-text-tertiary text-center">Select a category</div>
          )}
          {activeCategory && !['priority', 'status'].includes(activeCategory) && (
            <div className="px-3 py-6 text-sm text-text-tertiary text-center">Coming soon</div>
          )}
        </div>
      </div>
    </Dropdown>
  );
}
