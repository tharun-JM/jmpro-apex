'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Holding } from '@/data/holdings';
import { Alert } from '@/data/alerts';
import HoldingRow from '@/components/HoldingRow';
import AIPanel from '@/components/AIPanel';
import { fmt } from '@/lib/utils';

type Tab = 'current' | 'invested' | 'tax';
type ExtFilter = 'all' | 'mf' | 'eq';

export default function HNIPage() {
  const router = useRouter();
  const { panConnected, connectPan, openAddAsset, openTaxSim, selfAssets, deleteSelfAsset } = useApp();

  const [tab, setTab] = useState<Tab>('current');
  const [extFilter, setExtFilter] = useState<ExtFilter>('all');
  const [panFormOpen, setPanFormOpen] = useState(false);
  const [panValue, setPanValue] = useState('');
  const [apiLoading, setApiLoading] = useState(false);
  const [apiSteps, setApiSteps] = useState({ cams: 'pend', cdsl: 'pend', nsdl: 'pend', jm: 'pend' });
  const [apiLabels, setApiLabels] = useState({ cams: '', cdsl: '', nsdl: '', jm: '' });
  const [jmHoldings, setJmHoldings] = useState<Holding[]>([]);
  const [extHoldings, setExtHoldings] = useState<Holding[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [calcOpen, setCalcOpen] = useState(false);

  useEffect(() => {
    fetch('/api/holdings/jmpro').then((r) => r.json()).then((d) => setJmHoldings(d.holdings));
  }, []);

  async function fetchHoldings() {
    const val = panValue.trim().toUpperCase();
    if (val.length < 10) { alert('Please enter a valid 10-character PAN'); return; }

    setPanFormOpen(false);
    setApiLoading(true);

    const steps: { key: 'cams' | 'cdsl' | 'nsdl' | 'jm'; ms: number; label: string }[] = [
      { key: 'cams', ms: 700, label: '✓ 6 MF schemes fetched' },
      { key: 'cdsl', ms: 600, label: '✓ 9 equity holdings' },
      { key: 'nsdl', ms: 500, label: '✓ 3 equity holdings' },
      { key: 'jm', ms: 400, label: '✓ 5 JMPro holdings' },
    ];

    for (const s of steps) {
      setApiSteps((p) => ({ ...p, [s.key]: 'spin' }));
      setApiLabels((p) => ({ ...p, [s.key]: 'Connecting…' }));
      await new Promise((r) => setTimeout(r, s.ms));
      setApiSteps((p) => ({ ...p, [s.key]: 'done' }));
      setApiLabels((p) => ({ ...p, [s.key]: s.label }));
    }

    await new Promise((r) => setTimeout(r, 350));
    setApiLoading(false);
    connectPan();

    const [extRes, alertRes] = await Promise.all([
      fetch('/api/holdings/external').then((r) => r.json()),
      fetch('/api/alerts').then((r) => r.json()),
    ]);
    setExtHoldings(extRes.holdings);
    await new Promise((r) => setTimeout(r, 600));
    setAlerts(alertRes.alerts);
  }

  const filteredExt = extHoldings.filter((h) => extFilter === 'all' || h.t === extFilter);
  const typeLabels: Record<string, string> = { fd: 'Fixed Deposit', real_estate: 'Real Estate', unlisted_shares: 'Unlisted Shares', other: 'Other' };

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
      <div className="hni-main">
        {/* Alert banner */}
        {panConnected && alerts.length > 0 && (
          <div className="alert-banner" onClick={() => router.push('/insights')} style={{ marginBottom: 16, borderRadius: 10 }}>
            <div className="alert-banner-ico">🔴</div>
            <div className="alert-banner-text">Financials Sector at 41% — above 25% safe threshold</div>
            <div className="alert-banner-arrow">→ View Insights</div>
          </div>
        )}

        <div className="hni-badge-row">
          <button className="back-btn" onClick={() => router.push('/discover')}>← Back</button>
          <div className="hni-badge">👑 JMPro HNI Wealth</div>
        </div>
        <div className="hni-title">Your Wealth, Unified</div>
        <div className="hni-sub">360° view across JMPro, CAMS, CDSL &amp; NSDL — all in one place</div>

        {/* Tabs */}
        <div className="stabs">
          {(['current', 'invested', 'tax'] as Tab[]).map((t) => (
            <div key={t} className={`stab${tab === t ? ' act' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}{t === 'current' ? ' Value' : ''}
            </div>
          ))}
        </div>

        {/* TAB: CURRENT */}
        {tab === 'current' && (
          <>
            {!panConnected ? (
              <div className="scards">
                <div className="sc" style={{ borderColor: 'rgba(16,185,129,.2)' }}>
                  <div className="sc-lbl">JMPro Current Value</div>
                  <div className="sc-val gold">₹11.52 Cr</div>
                  <div className="sc-chg"><span className="pos">↑ ₹84K this month</span></div>
                </div>
                <div className="sc" style={{ borderColor: 'rgba(16,185,129,.2)' }}>
                  <div className="sc-lbl">JMPro Gain</div>
                  <div className="sc-val green">₹31.58L</div>
                  <div className="sc-chg" style={{ color: 'var(--green)' }}>+27.4% overall</div>
                </div>
                <div className="sc" style={{ borderColor: 'rgba(16,185,129,.2)' }}>
                  <div className="sc-lbl">JMPro XIRR</div>
                  <div className="sc-val">21.3%</div>
                  <div className="sc-chg">Annualised return</div>
                </div>
              </div>
            ) : (
              <div className="scards">
                <div className="sc"><div className="sc-lbl">Total Wealth</div><div className="sc-val gold">₹18.42 Cr</div><div className="sc-chg"><span className="pos">↑ ₹1.2L this month</span></div></div>
                <div className="sc"><div className="sc-lbl">Overall Gain</div><div className="sc-val green">₹45.78L</div><div className="sc-chg" style={{ color: 'var(--green)' }}>+33.1% overall</div></div>
                <div className="sc"><div className="sc-lbl">XIRR (Overall)</div><div className="sc-val">19.8%</div><div className="sc-chg">Annualised return</div></div>
              </div>
            )}

            {/* PAN Section */}
            <div className="pan-sec">
              {!panConnected ? (
                <div>
                  <div className="unify" onClick={() => setPanFormOpen(true)}>
                    <div className="unify-icon">🔗</div>
                    <div className="unify-text"><strong>See all your holdings in one place</strong><span>Connect CAMS, CDSL &amp; NSDL using your PAN card</span></div>
                    <div className="unify-arrow">→</div>
                  </div>
                  {panFormOpen && (
                    <div className="pan-form">
                      <div className="pan-form-title" style={{ marginTop: 16 }}>Connect Your Accounts</div>
                      <div className="pan-form-sub">Enter your PAN to fetch mutual fund holdings from CAMS and equity holdings from CDSL/NSDL</div>
                      <div className="pan-row">
                        <input className="pan-in" type="text" placeholder="ABCDE1234F" maxLength={10} value={panValue} onChange={(e) => setPanValue(e.target.value.toUpperCase())} />
                        <button className="btn-fetch" onClick={fetchHoldings}>Fetch Holdings</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="pan-conn">
                  <div className="pan-conn-icon">✅</div>
                  <div className="pan-conn-info">
                    <strong>ABCDE1234F — Meenal Tiwari</strong>
                    <div className="src-chips">
                      <span className="src jm">JMPro</span><span className="src cams">CAMS</span><span className="src cdsl">CDSL</span><span className="src nsdl">NSDL</span>
                    </div>
                  </div>
                  <div className="pan-sync">Last synced: Just now</div>
                </div>
              )}
            </div>

            {/* API Loading */}
            {apiLoading && (
              <div className="api-load">
                <div className="api-load-title">Fetching your holdings across all platforms…</div>
                {(['cams', 'cdsl', 'nsdl', 'jm'] as const).map((key) => {
                  const labels = { cams: 'CAMS API — Mutual Fund holdings (6 schemes)', cdsl: 'CDSL API — Demat equity holdings', nsdl: 'NSDL API — Demat equity holdings', jm: 'JMPro Engine — Your JM trades & holdings' };
                  return (
                    <div key={key} className="api-step">
                      <div className={`step-ico ${apiSteps[key]}`}>{apiSteps[key] === 'done' ? '✓' : apiSteps[key] === 'spin' ? '⟳' : '⏳'}</div>
                      <div className="step-lbl">{labels[key]}</div>
                      <div className={`step-st ${apiSteps[key]}`}>{apiLabels[key]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="alert-area">
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text2)' }}>⚠️ {alerts.length} Active Alerts Detected</div>
                {alerts.filter((a) => !dismissedAlerts.has(a.id)).map((a) => (
                  <div key={a.id} className={`al ${a.sev}`}>
                    <div className="al-icon">{a.ico}</div>
                    <div className="al-body">
                      <div className="al-sev">{a.sev.toUpperCase()}</div>
                      <div className="al-title">{a.ttl}</div>
                      <div className="al-desc">{a.desc}</div>
                    </div>
                    <button className="al-x" onClick={() => setDismissedAlerts((s) => new Set([...s, a.id]))}>×</button>
                  </div>
                ))}
              </div>
            )}

            {/* Holdings */}
            {panConnected && (
              <div>
                <div className="sec-div"><div className="sec-div-line" /><div className="sec-div-lbl">🟢 Your JMPro Holdings</div><div className="sec-div-line" /></div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Stocks &amp; MFs held directly through JMPro</div>
                {jmHoldings.map((h) => <HoldingRow key={h.id} h={h} isJM={true} />)}

                <div className="sec-div" style={{ marginTop: 24 }}><div className="sec-div-line" /><div className="sec-div-lbl">🔗 External Holdings via CAMS / CDSL / NSDL</div><div className="sec-div-line" /></div>
                <div className="filter-row">
                  {(['all', 'mf', 'eq'] as ExtFilter[]).map((f) => (
                    <div key={f} className={`fc${extFilter === f ? ' act' : ''}`} onClick={() => setExtFilter(f)}>
                      {f === 'all' ? 'All' : f === 'mf' ? 'Mutual Funds' : 'Equity'}
                    </div>
                  ))}
                </div>
                {filteredExt.map((h) => <HoldingRow key={h.id} h={h} isJM={false} />)}

                <div className="sec-div" style={{ marginTop: 24 }}><div className="sec-div-line" /><div className="sec-div-lbl">🏠 Self-Declared Assets</div><div className="sec-div-line" /></div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--text3)', flex: 1 }}>FDs, real estate, unlisted shares — manually added</div>
                  <button className="btn-fetch" onClick={openAddAsset} style={{ padding: '5px 14px', fontSize: 12 }}>+ Add Asset</button>
                </div>
                {selfAssets.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text3)', fontSize: 12 }}>No self-declared assets. Click "Add Asset" to include FDs, real estate, etc.</div>
                ) : (
                  selfAssets.map((a) => (
                    <div key={a.id} className="sd-item">
                      <div className="sd-info">
                        <div className="sd-name">{a.name}</div>
                        <div className="sd-type">{typeLabels[a.type] || a.type}{a.institution ? ' · ' + a.institution : ''}</div>
                      </div>
                      <div className="sd-val">₹{fmt(a.value)}</div>
                      <button className="sd-del" onClick={() => deleteSelfAsset(a.id)}>×</button>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}

        {/* TAB: INVESTED */}
        {tab === 'invested' && (
          <>
            <div className="scards">
              <div className="sc"><div className="sc-lbl">Total Invested</div><div className="sc-val gold">₹13.84 Cr</div><div className="sc-chg">Across all instruments</div></div>
              <div className="sc"><div className="sc-lbl">JMPro Direct</div><div className="sc-val">₹7.20 Cr</div><div className="sc-chg" style={{ color: 'var(--green)' }}>↑ 28.3% returns</div></div>
              <div className="sc"><div className="sc-lbl">External Holdings</div><div className="sc-val">₹6.64 Cr</div><div className="sc-chg" style={{ color: 'var(--green)' }}>↑ 24.1% returns</div></div>
            </div>
            <div className="inv-bars">
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Investment Breakdown</div>
              {[
                { label: 'JMPro Equity', val: '₹5.20 Cr', pct: 75, color: 'var(--green)' },
                { label: 'JMPro MF', val: '₹2.00 Cr', pct: 29, color: 'var(--gold)' },
                { label: 'CDSL/NSDL Equity', val: '₹4.00 Cr', pct: 58, color: 'var(--blue)' },
                { label: 'CAMS Mutual Funds', val: '₹2.64 Cr', pct: 38, color: 'var(--purple)' },
              ].map((row) => (
                <div key={row.label} className="ibar">
                  <div className="ibar-dot" style={{ background: row.color }} />
                  <div className="ibar-lbl">{row.label}</div>
                  <div className="ibar-val">{row.val}</div>
                  <div className="ibar-track"><div className="ibar-fill" style={{ width: `${row.pct}%`, background: row.color }} /></div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* TAB: TAX */}
        {tab === 'tax' && (
          <>
            <div className="tax-grid">
              <div className="txc"><div className="txc-lbl">STCG Realised FY26</div><div className="txc-val" style={{ color: 'var(--red)' }}>₹3.84L</div></div>
              <div className="txc"><div className="txc-lbl">LTCG Realised FY26</div><div className="txc-val" style={{ color: 'var(--green)' }}>₹2.70L</div></div>
              <div className="txc"><div className="txc-lbl">Unrealised Tax Risk</div><div className="txc-val" style={{ color: 'var(--amber)' }}>₹8.42L</div></div>
              <div className="txc"><div className="txc-lbl">Saved (Harvesting)</div><div className="txc-val" style={{ color: 'var(--green)' }}>₹1.14L</div></div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Holdings with Tax Impact</div>
            {[
              { name: 'JM Flexi Cap Fund — JMPro', meta: 'Held: 10m 8d · Gain: ₹54.8L', tax: '₹3.84L', type: 'STCG', id: 'j1' },
              { name: 'HDFC Bank Ltd — CDSL', meta: 'Held: 13 months · Gain: ₹32L', tax: '₹2.70L', type: 'LTCG', id: 'e4' },
              { name: 'Reliance Industries — JMPro', meta: 'Held: 8 months · Gain: ₹48.2L', tax: '₹9.64L', type: 'STCG', id: 'j2' },
            ].map((row) => (
              <div key={row.id} className="txr">
                <div className="txr-info"><div className="txr-name">{row.name}</div><div className="txr-meta">{row.meta}</div></div>
                <div className="txr-right">
                  <div className="txr-tax" style={{ color: row.type === 'STCG' ? 'var(--red)' : 'var(--green)' }}>Tax: {row.tax}</div>
                  <div className={`txr-type ${row.type.toLowerCase()}`}>{row.type === 'STCG' ? '⚡' : '✓'} {row.type} {row.type === 'STCG' ? '20%' : '12.5%'}</div>
                </div>
              </div>
            ))}
            <div className="tax-tip">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gold)', marginBottom: 4 }}>💡 Wait 18 Days — Save ₹1.14L</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>JM Flexi Cap Fund crosses LTCG threshold in 18 days. Tax drops from ₹3.84L (STCG 20%) to ₹2.70L (LTCG 12.5%).</div>
            </div>
          </>
        )}

        {/* Calc Panel */}
        <div style={{ marginTop: 32, borderTop: '1px solid var(--border)', paddingTop: 28 }}>
          <div onClick={() => setCalcOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'rgba(200,169,81,.1)', border: '1px solid rgba(200,169,81,.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔢</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-.2px' }}>How Everything is Calculated</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 1 }}>Full methodology — data sources, formulas, aggregation logic</div>
              </div>
            </div>
            <div style={{ fontSize: 18, color: 'var(--text3)', transition: 'transform .3s', transform: calcOpen ? 'rotate(180deg)' : '' }}>▼</div>
          </div>
          {calcOpen && (
            <div style={{ marginTop: 20 }}>
              <div className="calc-section">
                <div className="calc-sec-title">① Portfolio Aggregation</div>
                <div className="calc-sec-sub">Your ₹18.42 Crore total is assembled from 4 independent data sources.</div>
                <div className="calc-formula">
                  <div className="cf-title">Aggregation Formula</div>
                  <div className="cf-eq">Total Wealth = Σ(JMPro current values) + Σ(CAMS NAV × units) + Σ(CDSL qty × LTP) + Σ(NSDL qty × LTP) + Σ(self-declared values)</div>
                  <div className="cf-result">= ₹12.07 Cr + ₹3.82 Cr + ₹2.13 Cr + ₹0.40 Cr + ₹0 = <strong>₹18.42 Cr</strong></div>
                </div>
              </div>
              <div className="calc-section">
                <div className="calc-sec-title">② Tax Engine — STCG / LTCG Rules (FY 2025-26)</div>
                <div className="calc-tax-rules">
                  <div className="calc-rule-row"><div className="crr-asset">Equity / Equity MF</div><div className="crr-condition">Held &lt; 12 months</div><div className="crr-type stcg">STCG</div><div className="crr-rate">20%</div></div>
                  <div className="calc-rule-row"><div className="crr-asset">Equity / Equity MF</div><div className="crr-condition">Held ≥ 12 months</div><div className="crr-type ltcg">LTCG</div><div className="crr-rate">12.5% (above ₹1.25L exemption)</div></div>
                  <div className="calc-rule-row"><div className="crr-asset">Debt MF</div><div className="crr-condition">Any holding period</div><div className="crr-type" style={{ background: 'rgba(168,85,247,.12)', color: 'var(--purple)' }}>Slab</div><div className="crr-rate">Income tax slab rate</div></div>
                </div>
              </div>
              <div className="calc-section" style={{ borderBottom: 'none' }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', padding: '12px 16px', background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.12)', borderRadius: 10, lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text)' }}>⚠️ Disclaimer</strong> — All calculations shown here are indicative and for demo purposes only. Tax figures use seeded dummy data. XIRR, CAGR, and portfolio values are simulated. Please consult your JM Relationship Manager before investing.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AIPanel />
    </div>
  );
}
