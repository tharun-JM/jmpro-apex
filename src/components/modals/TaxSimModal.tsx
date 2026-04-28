'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { TAX_DATA, TaxEntry } from '@/data/tax';
import { fmt } from '@/lib/utils';

export default function TaxSimModal() {
  const { taxSimModal, closeTaxSim, openTrade, showToast } = useApp();
  const { open, holdingId } = taxSimModal;
  const [selectedId, setSelectedId] = useState(holdingId ?? '');
  const [entry, setEntry] = useState<TaxEntry | null>(null);

  useEffect(() => {
    if (!open) return;
    const id = holdingId ?? '';
    setSelectedId(id);
    setEntry(id ? TAX_DATA.find((t) => t.id === id) ?? null : null);
  }, [open, holdingId]);

  if (!open) return null;

  function selectEntry(id: string) {
    setSelectedId(id);
    setEntry(TAX_DATA.find((t) => t.id === id) ?? null);
  }

  function setReminder(name: string, days: number) {
    closeTaxSim();
    showToast('🔔', 'Reminder Set',
      `You'll be reminded about ${name.split('—')[0].trim()} in ${days} days when it crosses LTCG threshold.`);
  }

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && closeTaxSim()}>
      <div className="modal tax-sim-modal">
        <div className="modal-hdr">
          <div className="modal-title">⚡ Tax Simulator</div>
          <button className="modal-x" onClick={closeTaxSim}>×</button>
        </div>

        {!holdingId && (
          <div className="fg">
            <label>Select Holding</label>
            <select className="aa-select" value={selectedId} onChange={(e) => selectEntry(e.target.value)}>
              <option value="">— Choose a holding —</option>
              {TAX_DATA.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        )}

        {entry && (
          <>
            <div className="m-hinfo">
              <div className="m-hname">{entry.name}</div>
              <div className="m-hmeta">Held: {entry.hp} · Classification: {entry.classification}</div>
            </div>
            <div className="ts-row"><span className="ts-lbl">Unrealised Gain</span><span className="ts-val" style={{ color: 'var(--green)' }}>₹{fmt(entry.gain)}</span></div>
            <div className="ts-row"><span className="ts-lbl">Tax Rate</span><span className="ts-val">{entry.classification} @ {entry.taxRate * 100}%</span></div>
            <div className="ts-row"><span className="ts-lbl">Tax if Sold Today</span><span className="ts-val" style={{ color: 'var(--red)' }}>₹{fmt(entry.taxToday)}</span></div>

            {entry.daysToLTCG !== null && entry.classification === 'STCG' ? (
              <>
                <div className="ts-save-box">
                  <div className="ts-save-title">Wait {entry.daysToLTCG} Days — Save ₹{fmt(entry.saving!)}</div>
                  <div className="ts-save-desc">
                    This holding crosses LTCG threshold in {entry.daysToLTCG} days.
                    Tax drops from ₹{fmt(entry.taxToday)} (STCG {entry.taxRate * 100}%) to ₹{fmt(entry.taxAfterLTCG!)} (LTCG 12.5%).
                  </div>
                </div>
                <div className="ts-actions">
                  <button className="btn-reminder" onClick={() => setReminder(entry.name, entry.daysToLTCG!)}>🔔 Set Reminder</button>
                  <button className="btn-sell-now" onClick={() => { closeTaxSim(); /* open trade */ }}>Sell Now</button>
                </div>
              </>
            ) : (
              <div style={{ marginTop: 12, padding: 10, background: 'rgba(16,185,129,.07)', borderRadius: 8, fontSize: 13, color: 'var(--green)' }}>
                ✓ Already LTCG — no benefit from waiting further.
              </div>
            )}
            <div className="ts-disclaimer">Tax estimates are indicative. Consult your CA for final liability.</div>
          </>
        )}
      </div>
    </div>
  );
}
