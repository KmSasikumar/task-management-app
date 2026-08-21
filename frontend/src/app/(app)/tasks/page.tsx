'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import TaskListView from '@/components/tasks/TaskListView';
import TaskBoardView from '@/components/tasks/TaskBoardView';
import FieldsDropdown from '@/components/tasks/FieldsDropdown';
import FilterDropdown from '@/components/tasks/FilterDropdown';
import AddTaskModal from '@/components/tasks/AddTaskModal';

export default function TasksPage() {
  const { state, dispatch } = useApp();
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const filteredTasks = state.tasks.filter(t => {
    if (!t.projectId) {
      // Only show non-project tasks on the main tasks page
    }
    if (state.filters.search) {
      const s = state.filters.search.toLowerCase();
      if (!t.title.toLowerCase().includes(s)) return false;
    }
    if (state.filters.priority.length > 0 && !state.filters.priority.includes(t.priority)) return false;
    if (state.filters.status.length > 0 && !state.filters.status.includes(t.status)) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-text-primary">Tasks</h1>
        <div className="flex items-center gap-2">
          {/* Search */}
          {searchOpen ? (
            <div className="relative animate-fadeIn">
              <svg className="w-4 h-4 text-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                autoFocus
                type="text"
                value={state.filters.search}
                onChange={e => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                onBlur={() => { if (!state.filters.search) setSearchOpen(false); }}
                placeholder="Search tasks..."
                className="pl-9 pr-8 py-2 text-sm bg-bg-secondary border border-border rounded-lg w-64 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-text-primary placeholder:text-text-tertiary"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary bg-bg-tertiary px-1.5 py-0.5 rounded font-mono">⌘F</span>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          )}

          <FieldsDropdown />
          <FilterDropdown />

          <button
            onClick={() => setAddOpen(true)}
            id="btn-add-task"
            className="h-9 px-4 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-1.5 active:scale-[0.97]"
          >
            <span className="text-lg leading-none">+</span>
            Add Task
          </button>
        </div>
      </div>

      {/* View */}
      {state.viewMode === 'list' ? (
        <TaskListView tasks={filteredTasks} />
      ) : (
        <TaskBoardView tasks={filteredTasks} />
      )}

      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
