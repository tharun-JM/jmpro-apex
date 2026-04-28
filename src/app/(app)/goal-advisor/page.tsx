'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';
import { fmt } from '@/lib/utils';

interface GoalData { amount: number; years: number; risk?: string; surplus?: number; existingSIP?: boolean; text: string; }
interface Msg { role: 'bot' | 'usr'; html: string; }

const PRODUCTS_MAP = {
  short: [
    { name: 'JM Liquid Fund', split: 0.4, cagr: '6-7%', rationale: 'Capital preservation with liquidity', risk: 'low' },
    { name: 'JM Low Duration Fund', split: 0.3, cagr: '7-8%', rationale: 'Slightly higher yield with low duration risk', risk: 'low' },
    { name: 'JM Arbitrage Fund', split: 0.3, cagr: '7-8%', rationale: 'Tax-efficient equity-like returns', risk: 'low' },
  ],
  medium: [
    { name: 'JM Flexi Cap Fund', split: 0.4, cagr: '14-16%', rationale: 'Diversified across market caps for growth', risk: 'moderate' },
    { name: 'JM Large & Mid Cap Fund', split: 0.35, cagr: '13-15%', rationale: 'Blend of stability and growth', risk: 'moderate' },
    { name: 'JM Value Fund', split: 0.25, cagr: '13-16%', rationale: 'Value-oriented picks for alpha', risk: 'moderate' },
  ],
  long: [
    { name: 'JM Flexi Cap Fund', split: 0.5, cagr: '14-16%', rationale: 'Core allocation for long-term wealth creation', risk: 'moderate' },
    { name: 'JM Multi Cap Fund', split: 0.3, cagr: '13-15%', rationale: 'Diversified multi-cap exposure', risk: 'moderate' },
    { name: 'JM Small Cap Fund', split: 0.2, cagr: '16-20%', rationale: 'High-growth satellite allocation', risk: 'high' },
  ],
  veryLong: [
    { name: 'JM Small Cap Fund', split: 0.4, cagr: '16-20%', rationale: 'Maximum growth potential over 10+ years', risk: 'high' },
    { name: 'JM Flexi Cap Fund', split: 0.6, cagr: '14-16%', rationale: 'Core diversified allocation for stability', risk: 'moderate' },
  ],
};

export default function GoalAdvisorPage() {
  const { logOrder, showToast } = useApp();
  const [msgs, setMsgs] = useState<Msg[]>([{
    role: 'bot',
    html: `👋 Hi! I'm your JMPro Goal Advisor.<br><br>Tell me your financial goal in plain language — for example:<br><br><em>"I want ₹2 Crore for my daughter's education in 8 years"</em><br><em>"I need ₹5 Crore for retirement in 15 years"</em><br><br>I'll analyse your current portfolio and recommend a personalised JM Financial investment plan.`,
  }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [goalData, setGoalData] = useState<GoalData | null>(null);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  function addBot(html: string) {
    setTimeout(() => setMsgs((prev) => [...prev, { role: 'bot', html }]), 800);
  }

  function sendGoal() {
    const q = input.trim();
    if (!q) return;
    setInput('');
    setMsgs((prev) => [...prev, { role: 'usr', html: q }]);

    if (step === 0) {
      const amtMatch = q.match(/₹?\s*([\d,.]+)\s*(cr|crore|lakh|lakhs|l|L|Cr)?/i);
      const yrMatch = q.match(/(\d+)\s*(year|yr|years|yrs)/i);
      let amount = 0, years = 0;
      if (amtMatch) {
        amount = parseFloat(amtMatch[1].replace(/,/g, ''));
        const unit = (amtMatch[2] || '').toLowerCase();
        if (unit.startsWith('cr')) amount *= 10000000;
        else if (unit.startsWith('l')) amount *= 100000;
        else if (amount < 1000) amount *= 10000000;
      }
      if (yrMatch) years = parseInt(yrMatch[1]);
      setGoalData({ amount, years, text: q });
      setStep(1);
      addBot(`Great! I understand your goal:<br><br>🎯 <strong>₹${fmt(amount)}</strong> in <strong>${years} years</strong><br><br>A few more details:<br><br><strong>1. Your risk appetite?</strong><div class="goal-options"><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalRisk',{detail:'conservative'}))">Conservative</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalRisk',{detail:'moderate'}))">Moderate</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalRisk',{detail:'aggressive'}))">Aggressive</button></div>`);
    }
  }

  function selectRisk(risk: string) {
    setGoalData((g) => g ? { ...g, risk } : g);
    setMsgs((prev) => [...prev, { role: 'usr', html: risk.charAt(0).toUpperCase() + risk.slice(1) }]);
    setStep(2);
    addBot(`<strong>2. Monthly investable surplus?</strong><div class="goal-options"><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSurplus',{detail:50000}))">₹50K</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSurplus',{detail:100000}))">₹1L</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSurplus',{detail:200000}))">₹2L</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSurplus',{detail:500000}))">₹5L</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSurplus',{detail:1000000}))">₹10L+</button></div>`);
  }

  function selectSurplus(surplus: number) {
    setGoalData((g) => g ? { ...g, surplus } : g);
    setMsgs((prev) => [...prev, { role: 'usr', html: `₹${fmt(surplus)}/month` }]);
    setStep(3);
    addBot(`<strong>3. Existing SIPs for this goal?</strong><div class="goal-options"><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSIP',{detail:true}))">Yes</button><button class="goal-opt" onclick="document.dispatchEvent(new CustomEvent('goalSIP',{detail:false}))">No</button></div>`);
  }

  function generateRec(data: GoalData) {
    const cagr = data.risk === 'conservative' ? 0.10 : data.risk === 'moderate' ? 0.14 : 0.17;
    const shortfall = data.amount * 0.4;
    const r = cagr / 12;
    const n = data.years * 12;
    const sipNeeded = shortfall > 0 ? Math.round(shortfall / ((Math.pow(1 + r, n) - 1) / r)) : 0;
    const products = data.years <= 2 ? PRODUCTS_MAP.short : data.years <= 5 ? PRODUCTS_MAP.medium : data.years <= 10 ? PRODUCTS_MAP.long : PRODUCTS_MAP.veryLong;

    const recs = products.map((p) => ({ ...p, sip: Math.round(sipNeeded * p.split) }));

    let html = `<div class="gap-card"><div style="font-size:14px;font-weight:600;margin-bottom:8px">📊 Portfolio Gap Analysis</div><div class="gap-row"><span style="color:var(--text2)">Goal Target</span><span style="font-weight:600;font-family:'DM Mono',monospace">₹${fmt(data.amount)}</span></div><div class="gap-row"><span style="color:var(--text2)">Time Horizon</span><span style="font-weight:600">${data.years} years</span></div><div class="gap-row"><span style="color:var(--text2)">Risk Profile</span><span style="font-weight:600;text-transform:capitalize">${data.risk}</span></div><div class="gap-row"><span style="color:var(--text2)">Est. Monthly SIP Needed</span><span style="font-weight:600;color:var(--gold);font-family:'DM Mono',monospace">₹${fmt(sipNeeded)}</span></div></div><div style="font-size:14px;font-weight:600;margin:12px 0 8px">Recommended JM Financial Products:</div>`;
    recs.forEach((p) => {
      html += `<div class="rec-card"><div class="rec-name">${p.name}</div><div class="rec-meta">Risk: ${p.risk} · Expected CAGR: ${p.cagr}</div><div class="rec-row"><span style="color:var(--text2)">Suggested Monthly SIP</span><span style="font-weight:600;color:var(--gold);font-family:'DM Mono',monospace">₹${fmt(p.sip)}</span></div><div class="rec-row"><span style="color:var(--text2)">Rationale</span><span style="color:var(--text2)">${p.rationale}</span></div><button class="rec-invest" onclick="document.dispatchEvent(new CustomEvent('placeSIP',{detail:{name:'${p.name}',sip:${p.sip}}}))">Invest Now →</button><div class="rec-disclaimer">Mutual fund investments are subject to market risks.</div></div>`;
    });
    setMsgs((prev) => [...prev, { role: 'bot', html }]);
  }

  useEffect(() => {
    function onRisk(e: Event) { selectRisk((e as CustomEvent).detail); }
    function onSurplus(e: Event) { selectSurplus((e as CustomEvent).detail); }
    function onSIP(e: Event) {
      const has = (e as CustomEvent).detail;
      setGoalData((g) => {
        if (!g) return g;
        const updated = { ...g, existingSIP: has };
        setMsgs((prev) => [...prev, { role: 'usr', html: has ? 'Yes' : 'No' }]);
        setTimeout(() => generateRec(updated), 1000);
        return updated;
      });
      setStep(4);
    }
    function onPlaceSIP(e: Event) {
      const { name, sip } = (e as CustomEvent).detail;
      logOrder({ type: 'buy', name, qty: 1, price: sip, total: sip, src: 'CAMS', sec: 'Mutual Fund', status: 'SIP Initiated', isSIP: true });
      showToast('🎯', 'SIP Initiated', `₹${fmt(sip)}/month SIP started in ${name}. View in Orders tab.`);
    }
    document.addEventListener('goalRisk', onRisk);
    document.addEventListener('goalSurplus', onSurplus);
    document.addEventListener('goalSIP', onSIP);
    document.addEventListener('placeSIP', onPlaceSIP);
    return () => {
      document.removeEventListener('goalRisk', onRisk);
      document.removeEventListener('goalSurplus', onSurplus);
      document.removeEventListener('goalSIP', onSIP);
      document.removeEventListener('placeSIP', onPlaceSIP);
    };
  }, []);

  return (
    <div className="goal-chat" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="goal-msgs" ref={msgsRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`goal-m ${m.role}`} dangerouslySetInnerHTML={{ __html: m.html }} />
        ))}
      </div>
      <div className="goal-input-row">
        <input
          className="goal-input"
          placeholder="Type your financial goal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendGoal()}
        />
        <button className="goal-send" onClick={sendGoal}>Send</button>
      </div>
    </div>
  );
}
