'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import Dropdown from '@/components/ui/Dropdown';

export default function FieldsDropdown() {
  const { state, dispatch } = useApp();
  const [open, setOpen] = useState(false);

  const fields: { key: keyof typeof state.fieldVisibility; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <Dropdown
      open={open}
      onClose={() => setOpen(false)}
      align="right"
      trigger={
        <button
          onClick={() => setOpen(!open)}
          className="h-9 px-3 flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-bg-hover transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          Fields
        </button>
      }
    >
      <div className="p-2 min-w-[200px]">
        {/* View toggle */}
        <div className="flex bg-bg-tertiary rounded-lg p-0.5 mb-3">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'list' })}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${state.viewMode === 'list' ? 'bg-bg-primary shadow-sm text-text-primary' : 'text-text-secondary'}`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              List
            </span>
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW_MODE', payload: 'board' })}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${state.viewMode === 'board' ? 'bg-bg-primary shadow-sm text-text-primary' : 'text-text-secondary'}`}
          >
            <span className="flex items-center justify-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="18" rx="1"/></svg>
              Board
            </span>
          </button>
        </div>

        {/* Field toggles */}
        {fields.map(f => (
          <label
            key={f.key}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
          >
            <span className="text-sm text-text-primary">{f.label}</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={state.fieldVisibility[f.key]}
                onChange={e => dispatch({ type: 'SET_FIELD_VISIBILITY', payload: { [f.key]: e.target.checked } })}
                className="sr-only peer"
              />
              <div className="w-8 h-5 bg-bg-tertiary rounded-full peer-checked:bg-accent transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-3" />
            </div>
          </label>
        ))}
      </div>
    </Dropdown>
  );
}
