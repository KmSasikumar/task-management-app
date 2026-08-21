'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';
import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !state.isLoggedIn && pathname !== '/login') {
      router.push('/login');
    }
  }, [mounted, state.isLoggedIn, pathname, router]);

  if (!mounted || !state.isLoggedIn) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      {pathname !== '/settings' && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
