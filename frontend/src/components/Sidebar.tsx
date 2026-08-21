'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import type { AccentColor, ThemeMode } from '@/lib/types';
import Avatar from './ui/Avatar';

const navItems = [
  { href: '/tasks', label: 'Tasks', icon: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
    </svg>
  )},
  { href: '/projects', label: 'Projects', icon: (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
    </svg>
  )},
];

const accentColors: { key: AccentColor; label: string; color: string }[] = [
  { key: 'amber', label: 'Amber', color: 'bg-amber-500' },
  { key: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { key: 'pink', label: 'Pink', color: 'bg-pink-500' },
  { key: 'rose', label: 'Rose', color: 'bg-rose-500' },
  { key: 'emerald', label: 'Emerald', color: 'bg-emerald-500' },
  { key: 'black', label: 'Black', color: 'bg-gray-800' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);

  return (
    <>
      <aside className="w-[200px] min-w-[200px] h-screen flex flex-col border-r border-border bg-bg-primary sticky top-0">
        {/* User header */}
        <div className="px-4 pt-4 pb-3">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 w-full group"
          >
            <Avatar userId={state.user.id} size="md" />
            <span className="text-sm font-semibold text-text-primary truncate flex-1 text-left">{state.user.name}</span>
            <svg className="w-4 h-4 text-text-tertiary group-hover:text-text-secondary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3">
          <div className="mb-1">
            <button className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
              Workspace
            </button>
          </div>
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-0.5
                  ${isActive
                    ? 'bg-accent-light text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                  }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Profile popover overlay */}
      {profileOpen && (
        <div className="fixed inset-0 z-50" onClick={() => { setProfileOpen(false); setThemeOpen(false); setColorOpen(false); }}>
          <div
            className="absolute left-0 top-0 w-[200px] bg-bg-primary border-r border-border h-auto shadow-xl animate-fadeIn"
            onClick={e => e.stopPropagation()}
          >
            {/* User card */}
            <div className="flex flex-col items-center pt-6 pb-4 px-4 border-b border-border">
              <Avatar userId={state.user.id} size="xl" className="mb-2" />
              <p className="text-sm font-semibold text-text-primary">{state.user.name}</p>
              <p className="text-xs text-text-tertiary">{state.user.email}</p>
            </div>

            {/* Menu items */}
            <div className="py-2 px-2">
              {/* Theme */}
              <div className="relative">
                <button
                  onClick={() => { setThemeOpen(!themeOpen); setColorOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  Change Theme
                  <svg className="w-3.5 h-3.5 ml-auto text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                {themeOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-bg-primary border border-border rounded-xl shadow-lg p-2 min-w-[140px] animate-scaleIn">
                    <p className="px-3 py-1 text-xs font-medium text-text-tertiary">Theme</p>
                    {(['light', 'dark'] as ThemeMode[]).map(t => (
                      <button
                        key={t}
                        onClick={() => { dispatch({ type: 'SET_THEME', payload: t }); setThemeOpen(false); }}
                        className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                      >
                        {t === 'light' ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
                        )}
                        <span className="capitalize">{t}</span>
                        {state.theme === t && <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Color */}
              <div className="relative">
                <button
                  onClick={() => { setColorOpen(!colorOpen); setThemeOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-hover transition-colors"
                >
                  <div className={`w-4 h-4 rounded ${accentColors.find(c => c.key === state.accentColor)?.color || 'bg-gray-400'}`} />
                  Color Mode
                  <svg className="w-3.5 h-3.5 ml-auto text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                </button>
                {colorOpen && (
                  <div className="absolute left-full top-0 ml-1 bg-bg-primary border border-border rounded-xl shadow-lg p-2 min-w-[150px] animate-scaleIn">
                    <p className="px-3 py-1 text-xs font-medium text-text-tertiary">Color Mode</p>
                    {accentColors.map(c => (
                      <button
                        key={c.key}
                        onClick={() => { dispatch({ type: 'SET_ACCENT', payload: c.key }); setColorOpen(false); }}
                        className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-sm hover:bg-bg-hover transition-colors"
                      >
                        <div className={`w-3.5 h-3.5 rounded ${c.color}`} />
                        {c.label}
                        {state.accentColor === c.key && <svg className="w-4 h-4 ml-auto text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Settings */}
              <button
                onClick={() => { setProfileOpen(false); router.push('/settings'); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-text-primary hover:bg-bg-hover transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
