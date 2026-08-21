'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!state.isLoggedIn && pathname !== '/login') {
      router.push('/login');
    }
  }, [state.isLoggedIn, pathname, router]);

  if (!state.isLoggedIn) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
