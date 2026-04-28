'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';

type Filter = 'all' | 'buy' | 'sell' | 'sip';

export default function OrdersPage() {
  const { orders } = useApp();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = orders.filter((o) => {
    if (filter === 'sip') return o.isSIP;
    if (filter === 'all') return true;
    return o.type === filter && !o.isSIP;
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="sec-title">Orders</div>
          <div className="sec-sub">All orders placed from your portfolio</div>
        </div>
        {orders.length > 0 && (
          <div style={{ background: 'rgba(200,169,81,.08)', border: '1px solid rgba(200,169,81,.2)', borderRadius: 20, padding: '4px 14px', fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>
            {orders.length} Order{orders.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <div className="filter-row">
        {(['all', 'buy', 'sell', 'sip'] as Filter[]).map((f) => (
          <div key={f} className={`fc${filter === f ? ' act' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}{f === 'sip' ? 's' : ''}
          </div>
        ))}
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="placeholder" style={{ padding: '60px 0' }}>
            <div className="big">📋</div>
            <div className="label" style={{ marginTop: 8 }}>No {filter === 'all' ? '' : filter + ' '}orders yet</div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Orders placed from your portfolio will appear here</div>
          </div>
        ) : (
          filtered.map((o) => {
            const isSIP = o.isSIP;
            const isBuy = o.type === 'buy';
            const typeColor = isSIP ? 'var(--gold)' : isBuy ? 'var(--green)' : 'var(--red)';
            const typeBg = isSIP ? 'rgba(200,169,81,.12)' : isBuy ? 'rgba(16,185,129,.12)' : 'rgba(239,68,68,.08)';
            const typeLabel = isSIP ? 'SIP' : isBuy ? 'BUY' : 'SELL';
            const typeIco = isSIP ? '🔄' : isBuy ? '🟢' : '🔴';
            const t = o.time;
            const timeStr = t.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ', ' + t.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

            return (
              <div key={o.id} className="hr" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: typeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{typeIco}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text3)' }}>{timeStr}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: typeColor }}>{typeLabel}</div>
                    <div style={{ fontSize: 10, padding: '1px 8px', borderRadius: 10, background: 'rgba(16,185,129,.08)', color: 'var(--green)', marginTop: 3, display: 'inline-block' }}>{o.status}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, paddingTop: 7, borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)' }}>
                  <span>Source: <strong style={{ color: 'var(--text)' }}>{o.src}</strong></span>
                  {isSIP ? (
                    <span>Monthly SIP: <strong style={{ color: 'var(--gold)', fontFamily: "'DM Mono',monospace" }}>₹{o.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></span>
                  ) : (
                    <>
                      <span>Qty: <strong style={{ color: 'var(--text)' }}>{o.qty}</strong></span>
                      <span>Price: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono',monospace" }}>₹{o.price.toLocaleString('en-IN')}</strong></span>
                      <span style={{ marginLeft: 'auto' }}>Total: <strong style={{ color: 'var(--text)', fontFamily: "'DM Mono',monospace" }}>₹{o.total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong></span>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
