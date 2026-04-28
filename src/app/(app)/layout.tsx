'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import Toasts from '@/components/Toasts';
import TradeModal from '@/components/modals/TradeModal';
import TaxSimModal from '@/components/modals/TaxSimModal';
import AddAssetModal from '@/components/modals/AddAssetModal';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { loggedIn } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loggedIn) router.replace('/');
  }, [loggedIn, router]);

  if (!loggedIn) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TopBar />
      <div className="app-body">{children}</div>
      <BottomNav />
      <TradeModal />
      <TaxSimModal />
      <AddAssetModal />
      <Toasts />
    </div>
  );
}
