'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Holding } from '@/data/holdings';

export interface Order {
  id: string;
  type: 'buy' | 'sell' | 'sip';
  name: string;
  qty: number;
  price: number;
  total: number;
  src: string;
  sec: string;
  status: string;
  time: Date;
  isSIP: boolean;
}

export interface SelfAsset {
  id: string;
  type: 'fd' | 'real_estate' | 'unlisted_shares' | 'other';
  name: string;
  value: number;
  institution?: string;
  maturityDate?: string;
}

export interface Toast {
  id: string;
  ico: string;
  title: string;
  msg: string;
  time: string;
  isAlert?: boolean;
}

interface TradeModalState {
  open: boolean;
  holding: Holding | null;
  type: 'buy' | 'sell';
}

interface TaxSimModalState {
  open: boolean;
  holdingId: string | null;
}

interface AppState {
  loggedIn: boolean;
  panConnected: boolean;
  aiOpen: boolean;
  orders: Order[];
  selfAssets: SelfAsset[];
  toasts: Toast[];
  tradeModal: TradeModalState;
  taxSimModal: TaxSimModalState;
  addAssetModal: boolean;

  login: () => void;
  connectPan: () => void;
  toggleAI: () => void;
  logOrder: (o: Omit<Order, 'id' | 'time'>) => void;
  addSelfAsset: (a: Omit<SelfAsset, 'id'>) => void;
  deleteSelfAsset: (id: string) => void;
  showToast: (ico: string, title: string, msg: string, time?: string, isAlert?: boolean) => void;
  dismissToast: (id: string) => void;
  openTrade: (holding: Holding, type: 'buy' | 'sell') => void;
  closeTrade: () => void;
  openTaxSim: (holdingId: string | null) => void;
  closeTaxSim: () => void;
  openAddAsset: () => void;
  closeAddAsset: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [panConnected, setPanConnected] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selfAssets, setSelfAssets] = useState<SelfAsset[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [tradeModal, setTradeModal] = useState<TradeModalState>({ open: false, holding: null, type: 'buy' });
  const [taxSimModal, setTaxSimModal] = useState<TaxSimModalState>({ open: false, holdingId: null });
  const [addAssetModal, setAddAssetModal] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jmpro_self_assets');
      if (saved) setSelfAssets(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const login = useCallback(() => setLoggedIn(true), []);
  const connectPan = useCallback(() => setPanConnected(true), []);
  const toggleAI = useCallback(() => setAiOpen((v) => !v), []);

  const logOrder = useCallback((o: Omit<Order, 'id' | 'time'>) => {
    const order: Order = { ...o, id: 'ORD' + Date.now(), time: new Date() };
    setOrders((prev) => [order, ...prev]);
  }, []);

  const addSelfAsset = useCallback((a: Omit<SelfAsset, 'id'>) => {
    const asset: SelfAsset = { ...a, id: 'sd_' + Date.now() };
    setSelfAssets((prev) => {
      const next = [...prev, asset];
      try { localStorage.setItem('jmpro_self_assets', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const deleteSelfAsset = useCallback((id: string) => {
    setSelfAssets((prev) => {
      const next = prev.filter((a) => a.id !== id);
      try { localStorage.setItem('jmpro_self_assets', JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const showToast = useCallback((ico: string, title: string, msg: string, time = 'just now', isAlert = false) => {
    const id = 't' + Date.now();
    const toast: Toast = { id, ico, title, msg, time, isAlert };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openTrade = useCallback((holding: Holding, type: 'buy' | 'sell') => {
    setTradeModal({ open: true, holding, type });
  }, []);

  const closeTrade = useCallback(() => {
    setTradeModal({ open: false, holding: null, type: 'buy' });
  }, []);

  const openTaxSim = useCallback((holdingId: string | null) => {
    setTaxSimModal({ open: true, holdingId });
  }, []);

  const closeTaxSim = useCallback(() => {
    setTaxSimModal({ open: false, holdingId: null });
  }, []);

  const openAddAsset = useCallback(() => setAddAssetModal(true), []);
  const closeAddAsset = useCallback(() => setAddAssetModal(false), []);

  return (
    <AppContext.Provider value={{
      loggedIn, panConnected, aiOpen, orders, selfAssets, toasts,
      tradeModal, taxSimModal, addAssetModal,
      login, connectPan, toggleAI, logOrder,
      addSelfAsset, deleteSelfAsset, showToast, dismissToast,
      openTrade, closeTrade, openTaxSim, closeTaxSim,
      openAddAsset, closeAddAsset,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
