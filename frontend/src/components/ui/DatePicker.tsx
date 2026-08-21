'use client';

import { useState } from 'react';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function DatePicker({
  value,
  onChange,
  onClose,
}: {
  value: string;
  onChange: (date: string) => void;
  onClose?: () => void;
}) {
  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const selected = value ? new Date(value) : null;

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { day: number; month: number; year: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, month: viewMonth, year: viewYear, isCurrentMonth: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }

  function prev() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }
  function next() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function select(cell: typeof cells[0]) {
    const dateStr = `${cell.year}-${String(cell.month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    onChange(dateStr);
    onClose?.();
  }

  function isSelected(cell: typeof cells[0]) {
    if (!selected) return false;
    return selected.getFullYear() === cell.year && selected.getMonth() === cell.month && selected.getDate() === cell.day;
  }

  const today = new Date();
  function isToday(cell: typeof cells[0]) {
    return today.getFullYear() === cell.year && today.getMonth() === cell.month && today.getDate() === cell.day;
  }

  return (
    <div className="p-3 w-[280px] animate-scaleIn">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-sm font-semibold text-text-primary">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={next} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-[11px] font-medium text-text-tertiary text-center py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => (
          <button
            key={i}
            onClick={() => select(cell)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all
              ${!cell.isCurrentMonth ? 'text-text-tertiary' : 'text-text-primary'}
              ${isSelected(cell) ? 'bg-accent text-white font-semibold' : ''}
              ${isToday(cell) && !isSelected(cell) ? 'ring-2 ring-accent font-semibold' : ''}
              ${!isSelected(cell) ? 'hover:bg-bg-hover' : ''}
            `}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
}
