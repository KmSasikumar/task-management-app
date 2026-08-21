'use client';

import type { Priority } from '@/lib/types';

const config: Record<Priority, { label: string; color: string; icon: string }> = {
  urgent: { label: 'Urgent', color: 'text-red-500', icon: '🔴' },
  high: { label: 'High', color: 'text-orange-500', icon: '🟠' },
  medium: { label: 'Medium', color: 'text-yellow-500', icon: '🟡' },
  low: { label: 'Low', color: 'text-gray-400', icon: '⚪' },
  none: { label: 'No Priority', color: 'text-gray-300', icon: '·' },
};

const iconMap: Record<Priority, React.ReactNode> = {
  urgent: <svg className="w-3.5 h-3.5 text-red-500" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="3.5" height="14" rx="0.5"/><rect x="6.25" y="1" width="3.5" height="14" rx="0.5"/><rect x="11.5" y="1" width="3.5" height="14" rx="0.5"/></svg>,
  high: <svg className="w-3.5 h-3.5 text-orange-500" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="5" width="3.5" height="10" rx="0.5"/><rect x="6.25" y="3" width="3.5" height="12" rx="0.5"/><rect x="11.5" y="1" width="3.5" height="14" rx="0.5"/></svg>,
  medium: <svg className="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="7" width="3.5" height="8" rx="0.5"/><rect x="6.25" y="5" width="3.5" height="10" rx="0.5"/><rect x="11.5" y="7" width="3.5" height="8" rx="0.5" opacity="0.3"/></svg>,
  low: <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="9" width="3.5" height="6" rx="0.5"/><rect x="6.25" y="9" width="3.5" height="6" rx="0.5" opacity="0.3"/><rect x="11.5" y="9" width="3.5" height="6" rx="0.5" opacity="0.3"/></svg>,
  none: <span className="text-gray-300 text-xs">·</span>,
};

export default function PriorityBadge({ priority, showLabel = true }: { priority: Priority; showLabel?: boolean }) {
  const c = config[priority];
  return (
    <span className={`inline-flex items-center gap-1.5 ${c.color}`}>
      {iconMap[priority]}
      {showLabel && <span className="text-sm font-medium">{c.label}</span>}
    </span>
  );
}

export { config as priorityConfig };
