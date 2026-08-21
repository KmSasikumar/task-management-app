'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Dropdown({
  trigger,
  children,
  open,
  onClose,
  align = 'right',
  className = '',
}: {
  trigger: ReactNode;
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  align?: 'left' | 'right' | 'center';
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [open, onClose]);

  const alignClass = align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2';

  return (
    <div ref={ref} className="relative inline-flex">
      {trigger}
      {open && (
        <div
          className={`absolute top-full mt-1 z-50 min-w-[200px] bg-bg-primary border border-border rounded-xl shadow-lg animate-scaleIn ${alignClass} ${className}`}
          style={{ boxShadow: 'var(--shadow-xl)' }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
