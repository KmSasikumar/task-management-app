'use client';

import { useApp } from '@/lib/store';

const bgColors = [
  'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
  'bg-purple-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500',
];

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return bgColors[Math.abs(hash) % bgColors.length];
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Avatar({
  userId,
  name,
  size = 'md',
  className = '',
}: {
  userId?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const { members } = useApp();
  const user = userId ? members[userId] : null;
  const displayName = user?.name || name || '?';
  const initials = user?.initials || getInitials(displayName);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div
      className={`${sizeClasses[size]} ${getColor(displayName)} rounded-full flex items-center justify-center text-white font-semibold shrink-0 select-none ${className}`}
      title={displayName}
    >
      {initials}
    </div>
  );
}
