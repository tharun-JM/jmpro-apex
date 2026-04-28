'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/store';
import { fmt } from '@/lib/utils';

interface TaxSummary { stcgRealised: number; ltcgRealised: number; unrealisedRisk: number; taxHarvested: number; totalLiability: number; fy: string; }

export default function TaxPlannerPage() {
  const { openTaxSim } = useApp();
  const [summary, setSummary] = useState<TaxSummary | null>(null);

  useEffect(() => {
    fetch('/api/tax').then((r) => r.json()).then((d) => setSummary(d.summary));
  }, []);

  if (!summary) return <div className="screen-page"><div style={{ color: 'var(--text3)', fontSize: 13 }}>Loading…</div></div>;

  return (
    <div className="screen-page">
      <div className="page-header">
        <div className="page-title">Tax Planner — FY {summary.fy}</div>
      </div>

      <div className="fy-bar">
        <div className="fy-card"><div className="fy-card-lbl">STCG Realised</div><div className="fy-card-val" style={{ color: 'var(--red)' }}>₹{fmt(summary.stcgRealised)}</div></div>
        <div className="fy-card"><div className="fy-card-lbl">LTCG Realised</div><div className="fy-card-val" style={{ color: 'var(--green)' }}>₹{fmt(summary.ltcgRealised)}</div></div>
        <div className="fy-card"><div className="fy-card-lbl">Unrealised Risk</div><div className="fy-card-val" style={{ color: 'var(--amber)' }}>₹{fmt(summary.unrealisedRisk)}</div></div>
        <div className="fy-card"><div className="fy-card-lbl">Tax Harvested</div><div className="fy-card-val" style={{ color: 'var(--green)' }}>₹{fmt(summary.taxHarvested)}</div></div>
        <div className="fy-card"><div className="fy-card-lbl">Total Liability</div><div className="fy-card-val" style={{ color: 'var(--red)' }}>₹{fmt(summary.totalLiability)}</div></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Tax Scenario Cards</div>
        <button className="btn-fetch" onClick={() => openTaxSim(null)} style={{ padding: '8px 16px', fontSize: 13 }}>Simulate a Trade</button>
      </div>

      <div className="scenario-card best">
        <div className="best-badge">Best Outcome</div>
        <div className="scenario-name">JM Flexi Cap Fund — Direct Growth</div>
        <div className="scenario-meta">Held: 10m 8d · Gain: ₹54.8L · Currently STCG</div>
        <div className="scenario-compare">
          <div className="sc-box"><div className="sc-box-lbl">Sell Today</div><div className="sc-box-val" style={{ color: 'var(--red)' }}>₹3.84L tax</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>STCG @ 20%</div></div>
          <div className="sc-box"><div className="sc-box-lbl">Wait 18 Days</div><div className="sc-box-val" style={{ color: 'var(--green)' }}>₹2.70L tax</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>LTCG @ 12.5%</div></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>Save ₹1.14L by waiting 18 days</div>
      </div>

      <div className="scenario-card">
        <div className="scenario-name">Reliance Industries Ltd</div>
        <div className="scenario-meta">Held: 8 months · Gain: ₹48.2L · Currently STCG</div>
        <div className="scenario-compare">
          <div className="sc-box"><div className="sc-box-lbl">Sell Today</div><div className="sc-box-val" style={{ color: 'var(--red)' }}>₹9.64L tax</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>STCG @ 20%</div></div>
          <div className="sc-box"><div className="sc-box-lbl">Wait 4 Months</div><div className="sc-box-val" style={{ color: 'var(--green)' }}>₹4.78L tax</div><div style={{ fontSize: 11, color: 'var(--text3)' }}>LTCG @ 12.5%</div></div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>Save ₹4.86L by waiting 4 months</div>
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, margin: '24px 0 12px' }}>LTCG Countdown — Within 30 Days</div>
      <div className="countdown-item">
        <div className="cd-days"><div className="cd-days-num">18</div><div className="cd-days-lbl">days</div></div>
        <div className="cd-info"><div className="cd-name">JM Flexi Cap Fund — Direct Growth</div><div className="cd-saving">Save ₹1.14L if you wait</div></div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 16, fontStyle: 'italic' }}>Tax estimates are indicative. Consult your CA for final liability.</div>
    </div>
  );
}
