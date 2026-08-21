'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  
  // Local state for the inputs.
  const [name, setName] = useState(state.user.name || '');
  const [email, setEmail] = useState(state.user.email || '');
  const [title, setTitle] = useState(state.user.title || '');
  const [username, setUsername] = useState(state.user.username || '');

  // Keep local state in sync if global state changes
  useEffect(() => {
    setName(state.user.name || '');
    setEmail(state.user.email || '');
    setTitle(state.user.title || '');
    setUsername(state.user.username || '');
  }, [state.user]);

  function handleBlur(field: string, value: string) {
    dispatch({ type: 'UPDATE_USER', payload: { [field]: value } });
  }

  return (
    <div className="flex h-screen w-full bg-bg-primary text-text-primary">
      {/* Custom Settings Sidebar */}
      <aside className="w-[260px] h-full flex-shrink-0 border-r border-border bg-bg-secondary flex flex-col">
        <div className="p-4 pt-6">
          <Link href="/tasks" className="flex items-center gap-2 text-[14px] font-medium text-text-primary hover:opacity-70 transition-opacity mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to app
          </Link>

          {/* Search */}
          <div className="relative mb-4">
            <svg className="w-[15px] h-[15px] absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-9 pr-3 py-1.5 text-[14px] border border-border rounded-lg bg-transparent focus:outline-none focus:border-border placeholder:text-text-tertiary" 
            />
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-2.5 px-3 py-2 text-[14px] bg-bg-tertiary font-medium rounded-lg text-text-primary">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-bg-primary flex justify-center">
        <div className="w-full max-w-[720px] px-8 pt-[60px] pb-24">
          
          <h1 className="text-[28px] font-medium text-text-primary mb-8">Profile</h1>
          
          {/* Profile Details Card */}
          <div className="border border-border-light rounded-[16px] bg-bg-primary mb-12 shadow-sm overflow-hidden">
            
            {/* Profile Picture */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <span className="text-[14px] font-medium text-text-secondary">Profile picture</span>
              <Avatar userId={state.user.id} size="lg" className="w-[32px] h-[32px]" />
            </div>
            
            {/* Email */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <span className="text-[14px] font-medium text-text-secondary">Email</span>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-text-primary font-medium">{email}</span>
                <button className="text-text-tertiary hover:text-text-primary transition-colors">
                  <svg className="w-[14px] h-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Full name */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <span className="text-[14px] font-medium text-text-secondary">Full name</span>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={(e) => handleBlur('name', e.target.value)}
                placeholder="Dexter"
                className="w-[280px] bg-bg-tertiary border border-transparent focus:border-border focus:bg-bg-primary rounded-[8px] px-3.5 py-2 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors" 
              />
            </div>
            
            {/* Title */}
            <div className="flex items-center justify-between p-6 border-b border-border-light">
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-medium text-text-secondary">Title</span>
                <span className="text-[13px] text-text-tertiary">Your job title or role</span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={(e) => handleBlur('title', e.target.value)}
                placeholder="Designer"
                className="w-[280px] bg-bg-tertiary border border-transparent focus:border-border focus:bg-bg-primary rounded-[8px] px-3.5 py-2 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors" 
              />
            </div>
            
            {/* Username */}
            <div className="flex items-center justify-between p-6">
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-medium text-text-secondary">Username</span>
                <span className="text-[13px] text-text-tertiary">One word, like a nickname or first name</span>
              </div>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={(e) => handleBlur('username', e.target.value)}
                placeholder="Dexuser"
                className="w-[280px] bg-bg-tertiary border border-transparent focus:border-border focus:bg-bg-primary rounded-[8px] px-3.5 py-2 text-[14px] text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors" 
              />
            </div>
          </div>

          {/* Appearance Card */}
          <h2 className="text-[18px] font-medium text-text-primary mb-4">Appearance</h2>
          <div className="border border-border-light rounded-[16px] bg-bg-primary mb-12 shadow-sm overflow-hidden p-6 flex flex-col gap-6">
            <div>
              <span className="block text-[14px] font-medium text-text-secondary mb-2">Theme</span>
              <div className="flex items-center gap-3">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => dispatch({ type: 'SET_THEME', payload: theme as any })}
                    className={`px-4 py-2 text-[14px] font-medium rounded-lg border capitalize transition-colors ${state.theme === theme ? 'border-text-primary bg-text-primary text-bg-primary' : 'border-border text-text-secondary hover:bg-bg-hover'}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border-light pt-6">
              <span className="block text-[14px] font-medium text-text-secondary mb-2">Accent Color</span>
              <div className="flex items-center gap-3">
                {[
                  { name: 'amber', class: 'bg-amber-500' },
                  { name: 'blue', class: 'bg-blue-500' },
                  { name: 'emerald', class: 'bg-emerald-500' },
                  { name: 'rose', class: 'bg-rose-500' },
                  { name: 'pink', class: 'bg-pink-500' },
                  { name: 'black', class: 'bg-gray-800' },
                ].map(color => (
                  <button
                    key={color.name}
                    onClick={() => dispatch({ type: 'SET_ACCENT', payload: color.name as any })}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${color.class} ${state.accentColor === color.name ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}`}
                    title={color.name}
                  >
                    {state.accentColor === color.name && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Workspace Access Card */}
          <h2 className="text-[18px] font-medium text-text-primary mb-4">Workspace access</h2>
          <div className="border border-border-light rounded-[16px] bg-bg-primary p-6 flex items-center justify-between shadow-sm">
            <span className="text-[14px] text-text-secondary">Remove yourself from the workspace</span>
            <button className="px-4 py-2 bg-[#fee2e2] text-[#ef4444] text-[14px] font-medium rounded-lg hover:bg-red-200 transition-colors active:bg-red-300">
              Leave Workspace
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
