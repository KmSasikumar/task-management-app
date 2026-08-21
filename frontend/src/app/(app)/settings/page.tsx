'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import Avatar from '@/components/ui/Avatar';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [name, setName] = useState(state.user.name);
  const [email, setEmail] = useState(state.user.email);
  const [title, setTitle] = useState(state.user.title || '');
  const [username, setUsername] = useState(state.user.username || '');

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    dispatch({ type: 'UPDATE_USER', payload: { name, email, title, username } });
  }

  function handleLogout() {
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-text-primary mb-6">Profile Settings</h1>
      
      <div className="bg-bg-primary border border-border rounded-xl p-6 mb-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar userId={state.user.id} size="xl" className="mb-4" />
          <button className="text-sm font-medium text-accent hover:underline">Change Avatar</button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Job Title</label>
              <input 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                className="w-full px-3 py-2 text-sm bg-bg-secondary border border-border rounded-lg focus:outline-none focus:border-accent text-text-primary"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border mt-6">
            <button type="submit" className="px-5 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="bg-bg-primary border border-red-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-text-secondary mb-4">Log out of your account on this device.</p>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
