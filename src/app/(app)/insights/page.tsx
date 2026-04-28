'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/data/alerts';
import { SectorBar } from '@/data/sectors';

export default function InsightsPage() {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sectors, setSectors] = useState<SectorBar[]>([]);

  useEffect(() => {
    fetch('/api/alerts').then((r) => r.json()).then((d) => setAlerts(d.alerts));
    fetch('/api/insights/sectors').then((r) => r.json()).then((d) => setSectors(d.sectors));
  }, []);

  return (
    <div className="screen-page">
      <div className="page-header">
        <div className="page-title">AI Insights</div>
        <div style={{ marginLeft: 'auto', background: 'rgba(200,169,81,.08)', border: '1px solid rgba(200,169,81,.2)', borderRadius: 20, padding: '4px 14px', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
          {alerts.length} Active Alerts
        </div>
      </div>

      <div className="sector-chart">
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Sector Concentration</div>
        {sectors.map((s) => (
          <div key={s.name} className="sector-bar-row">
            <div className="sb-label">{s.name}</div>
            <div className="sb-track">
              <div className="sb-threshold" />
              <div className={`sb-fill ${s.level}`} style={{ width: `${s.pct}%` }}>{s.pct}%</div>
            </div>
          </div>
        ))}
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 10 }}>Dashed line = 25% safe threshold</div>
      </div>

      <div>
        {alerts.map((a) => (
          <div key={a.id} className="insight-card">
            <div className={`ic-sev ${a.sev}`} />
            <div className="ic-body">
              <div className="ic-sev-badge" style={{ color: a.sev === 'high' ? 'var(--red)' : a.sev === 'medium' ? 'var(--amber)' : 'var(--blue)' }}>
                {a.sev.toUpperCase()}
              </div>
              <div className="ic-title">{a.ttl}</div>
              <div className="ic-desc">{a.desc}</div>
              <div className="ic-action" onClick={() => router.push('/goal-advisor')}>
                Get advice from Goal Advisor →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
