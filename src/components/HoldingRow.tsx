'use client';

import { Holding } from '@/data/holdings';
import { useApp } from '@/lib/store';
import { fmt } from '@/lib/utils';

export default function HoldingRow({ h, isJM }: { h: Holding; isJM: boolean }) {
  const { openTrade, openTaxSim } = useApp();
  const gCls = h.g >= 0 ? 'pos' : 'neg';
  const gSign = h.g >= 0 ? '+' : '';
  const ab = h.hasAl || h.tax ? 'ab' : '';
  const jc = isJM ? 'jm-h' : '';

  return (
    <div className={`hr ${ab} ${jc}`}>
      <div className="hr-top">
        <div className={`h-dot ${h.t}`} />
        <div className="h-name">{h.n}</div>
        <span className={`h-src ${h.src}`}>{h.src.toUpperCase()}</span>
        <div className="h-val">₹{fmt(h.cv)}</div>
      </div>
      <div className="hr-bot">
        <span className="h-det">Held: {h.hp}</span>
        <span className="h-det">·</span>
        <span className="h-det">Qty: {h.qty.toLocaleString('en-IN')}</span>
        <span className={`h-gain ${gCls}`}>
          {gSign}₹{fmt(h.g)} ({gSign}{h.gp}%)
        </span>
        {h.tax && (
          <span
            className="h-chip"
            onClick={(e) => { e.stopPropagation(); openTaxSim(h.id); }}
          >
            ⚡ {h.tax}
          </span>
        )}
        {h.hasAl && !h.tax && (
          <span className="h-chip" style={{ cursor: 'default' }}>⚠️ Alert</span>
        )}
        <div className="h-acts">
          <button className="btn-buy" onClick={() => openTrade(h, 'buy')}>Buy</button>
          <button className="btn-sell" onClick={() => openTrade(h, 'sell')}>Sell</button>
        </div>
      </div>
    </div>
  );
}
