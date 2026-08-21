'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Modal({
  open,
  onClose,
  children,
  title,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className={`backdrop:bg-black/40 backdrop:backdrop-blur-sm bg-bg-primary text-text-primary rounded-2xl shadow-xl border border-border p-0 max-w-lg w-full animate-scaleIn ${className}`}
    >
      {open && (
        <div className="p-6">
          {title && (
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </div>
      )}
    </dialog>
  );
}
