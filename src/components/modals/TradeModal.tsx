'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { fmt } from '@/lib/utils';

export default function TradeModal() {
  const { tradeModal, closeTrade, logOrder, showToast } = useApp();
  const { open, holding, type } = tradeModal;
  const [curType, setCurType] = useState<'buy' | 'sell'>(type);
  const [qty, setQty] = useState(10);

  useEffect(() => { setCurType(type); setQty(10); }, [open, type]);

  if (!open || !holding) return null;

  const total = qty * holding.p;
  const isBuy = curType === 'buy';

  async function execTrade() {
    if (!holding) return;
    const name = holding.n.split('—')[0].trim();
    closeTrade();
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: curType, name, qty, price: holding.p, total: qty * holding.p,
          src: holding.src === 'jm' ? 'JMPro' : holding.src.toUpperCase(),
          sec: holding.sec ?? '—', status: 'Executed',
        }),
      });
    } catch { /* optimistic — still log locally */ }
    logOrder({
      type: curType, name, qty, price: holding.p, total: qty * holding.p,
      src: holding.src === 'jm' ? 'JMPro' : holding.src.toUpperCase(),
      sec: holding.sec ?? '—', status: 'Executed', isSIP: false,
    });
    showToast(isBuy ? '✅' : '💸', `Order ${isBuy ? 'Placed' : 'Executed'}`,
      `${isBuy ? 'Bought' : 'Sold'} ${qty} units of ${name} @ ₹${holding.p.toLocaleString('en-IN')}`);
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && closeTrade()}>
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">{isBuy ? '📈 Buy Order' : '📉 Sell Order'}</div>
          <button className="modal-x" onClick={closeTrade}>×</button>
        </div>
        <div className="m-hinfo">
          <div className="m-hname">{holding.n}</div>
          <div className="m-hmeta">CMP: ₹{holding.p.toLocaleString('en-IN')} · Held: {holding.qty.toLocaleString('en-IN')} units</div>
        </div>
        <div className="ttabs">
          <div className={`ttab buy${curType === 'buy' ? ' act' : ''}`} onClick={() => setCurType('buy')}>Buy</div>
          <div className={`ttab sell${curType === 'sell' ? ' act' : ''}`} onClick={() => setCurType('sell')}>Sell</div>
        </div>
        <div className="qty-row">
          <span className="qty-lbl">Qty</span>
          <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <input
            className="qty-in"
            type="number"
            value={qty}
            min={1}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          />
          <button className="qty-btn" onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <div className="t-sum">
          <div className="t-sum-r"><span>Price</span><span>₹{holding.p.toLocaleString('en-IN')}</span></div>
          <div className="t-sum-r"><span>Quantity</span><span>{qty.toLocaleString('en-IN')}</span></div>
          <div className="t-sum-r"><span>Brokerage</span><span>₹20</span></div>
          <div className="t-sum-r"><span>Total</span><span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
        </div>
        <button className={`btn-exec ${curType}`} onClick={execTrade}>
          Place {isBuy ? 'Buy' : 'Sell'} Order
        </button>
      </div>
    </div>
  );
}
