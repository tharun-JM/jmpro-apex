'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/store';

const AI_SUGGESTIONS = [
  ['⚠️ What are my concentration risks?', '💰 Highest tax exposure today?', '🎯 Where to invest ₹50L?'],
  ['📈 Compare JMPro vs CAMS performance', '⏱️ Holdings closest to LTCG crossover', '🔄 Rebalancing roadmap'],
  ['🏦 Should I sell Reliance now?', '📊 My overall XIRR breakdown', '💡 Tax harvesting opportunities this FY'],
  ['🎯 Build a goal plan for ₹2 Cr in 8 years', '⚡ Explain Financials sector alert', '📉 Which holdings have unrealised losses?'],
  ['🔵 Are my 3 large-cap MFs redundant?', '💼 Best allocation for ₹1 Cr surplus', '🔔 Set tax reminder for JM Flexi Cap'],
];

interface Msg { role: 'bot' | 'usr'; html: string; }

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function aiResp(q: string): string {
  const l = q.toLowerCase().trim();
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|namaste|hii+|sup)/i.test(l))
    return pick([
      `👋 Good to see you, Meenal! Your portfolio is at <strong>₹18.42 Cr</strong> today — up <strong>+₹1.24L</strong> since yesterday.<br><br>I'm tracking 4 active alerts. Want a quick summary or something specific?`,
      `Hello Meenal! Markets are mixed today — Nifty flat but your Reliance position is up 1.2%.<br><br>Quick heads up: JM Flexi Cap crosses LTCG in just <strong>18 days</strong>. What can I help you with?`
    ]);
  if (/total|portfolio|overview|summary|wealth|net worth|holdings/i.test(l))
    return `📊 <strong>Portfolio Overview — Meenal Tiwari</strong><br><br><table style="width:100%;font-size:12px"><tr><td style="color:var(--text2);padding:3px 0">Total Wealth</td><td style="text-align:right;font-weight:600;color:var(--gold);font-family:'DM Mono',monospace">₹18.42 Cr</td></tr><tr><td style="color:var(--text2);padding:3px 0">JMPro Holdings</td><td style="text-align:right;font-weight:600;font-family:'DM Mono',monospace">₹12.07 Cr (65.5%)</td></tr><tr><td style="color:var(--text2);padding:3px 0">CAMS Mutual Funds</td><td style="text-align:right;font-weight:600;font-family:'DM Mono',monospace">₹3.82 Cr (20.7%)</td></tr><tr><td style="color:var(--text2);padding:3px 0">CDSL / NSDL Demat</td><td style="text-align:right;font-weight:600;font-family:'DM Mono',monospace">₹2.53 Cr (13.7%)</td></tr><tr><td style="color:var(--text2);padding:3px 0">Overall XIRR</td><td style="text-align:right;font-weight:600;color:var(--green)">19.8% p.a.</td></tr><tr><td style="color:var(--text2);padding:3px 0">Active Alerts</td><td style="text-align:right;font-weight:600;color:var(--amber)">4 (2 HIGH, 2 MEDIUM)</td></tr></table><br>Your equity-to-MF mix is <strong>64:36</strong>. Want a rebalancing plan?`;
  if (/xirr|return|cagr|performance|gain|profit/i.test(l))
    return `📈 <strong>Returns Breakdown:</strong><br><br>• JMPro portfolio XIRR: <strong style="color:var(--green)">24.6%</strong><br>• CAMS Mutual Funds XIRR: <strong style="color:var(--green)">16.3%</strong><br>• CDSL / NSDL XIRR: <strong style="color:var(--green)">14.8%</strong><br>• <strong>Overall Portfolio XIRR: 19.8%</strong>`;
  if (/concentrat|overlap|diversif|sector|risk|alert|exposure/i.test(l))
    return `⚠️ <strong>4 Active Concentration Alerts:</strong><br><br>🔴 <strong>HIGH — Financials sector at 41%</strong><br>HDFC Bank held in JMPro, CDSL, and 2 CAMS funds.<br><br>🔴 <strong>HIGH — Reliance at 20.5% single-stock</strong><br>₹3.78 Cr across JMPro + CDSL.<br><br>🟡 <strong>MEDIUM — HDFC Bank overlap (3 vehicles)</strong><br>Effective exposure: ₹29.9L = 16.2%.<br><br>💡 Trim Reliance after 4 months (LTCG), merge large-cap funds.`;
  if (/tax|stcg|ltcg|harvest|sell.*today|redeem|liability/i.test(l))
    return `💰 <strong>Tax Position — FY 2025-26:</strong><br><br>• STCG: ₹3.84L @ 20% → tax <strong style="color:var(--red)">₹76,800</strong><br>• LTCG: ₹2.70L @ 12.5% → tax <strong style="color:var(--green)">₹33,750</strong><br><br><strong>⏱ Time-sensitive:</strong><br>• JM Flexi Cap — wait <strong>18 days</strong> → saves <strong style="color:var(--green)">₹1.14L</strong><br>• Infosys — wait <strong>30 days</strong> → saves <strong style="color:var(--green)">₹27,625</strong>`;
  if (/reliance|ril/i.test(l))
    return `⚡ <strong>Reliance Industries:</strong><br><br>JMPro: 1,500 shares = ₹3.15 Cr<br>CDSL: 300 shares = ₹0.63 Cr<br>Combined: <strong>₹3.78 Cr = 20.5%</strong> ⚠️<br><br>💡 Hold 4 months for LTCG, then trim 400 shares.`;
  if (/hdfc bank|hdfcbank/i.test(l))
    return `🏦 <strong>HDFC Bank:</strong><br><br>JMPro: 1,200 shares = ₹18.5L (STCG, 7 months)<br>CDSL: 350 shares = ₹5.4L (LTCG ✓)<br>CAMS via HDFC Large Cap: ~₹6L<br><br>Combined: <strong>₹29.9L = 16.2%</strong> ⚠️`;
  if (/rebalanc|restructure/i.test(l))
    return `⚖️ <strong>Rebalancing Roadmap:</strong><br><br><strong>Step 1 (18 days):</strong> Wait for JM Flexi Cap LTCG → redeem ₹15L → JM Short Duration Fund.<br><strong>Step 2 (4 months):</strong> After Reliance LTCG, trim 400 shares.<br><strong>Step 3:</strong> Consolidate 3 large-cap MFs → single JM Flexi Cap SIP.`;
  if (/invest|deploy|surplus|lump.?sum|₹\d|crore|lakh/i.test(l)) {
    const amt = l.match(/₹?\s*([\d,.]+)\s*(cr|crore|l|lakh)?/i);
    const amtStr = amt ? amt[0] : 'your surplus';
    return `🎯 <strong>Deployment Plan for ${amtStr}:</strong><br><br>• <strong>40% → JM Short Duration Fund</strong><br>• <strong>35% → JM Flexi Cap Fund</strong><br>• <strong>25% → JM Arbitrage Fund</strong>`;
  }
  return pick([
    `I'm analysing your <strong>₹18.42 Crore</strong> portfolio (12 holdings across 4 platforms).<br><br>Ask me about tax, concentration risk, or where to invest next.`,
    `Good question. I'm connected to your JMPro, CAMS, CDSL, and NSDL data.<br><br>Try: "What's my tax if I sell Reliance today?" or "Am I too concentrated in Financials?"`
  ]);
}

export default function AIPanel() {
  const { aiOpen, toggleAI } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', html: '👋 Hi Meenal! I\'m your JMPro AI Advisor.<br><br>I can see your <strong>₹18.42 Crore</strong> portfolio across all connected accounts. I\'ve detected <strong>4 active alerts</strong>.<br><br>What would you like to explore?' }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [suggIdx, setSuggIdx] = useState(0);
  const msgsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, thinking]);

  async function send(q?: string) {
    const text = (q ?? input).trim();
    if (!text) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'usr', html: text }]);
    setThinking(true);
    await new Promise((r) => setTimeout(r, 1300));
    setThinking(false);
    setMessages((prev) => [...prev, { role: 'bot', html: aiResp(text) }]);
    setSuggIdx((i) => i + 1);
  }

  const currentSuggs = AI_SUGGESTIONS[suggIdx % AI_SUGGESTIONS.length];

  return (
    <>
      <button className={`ai-tog${aiOpen ? ' hidden' : ''}`} id="ai-tog" onClick={toggleAI} style={{ display: aiOpen ? 'none' : undefined }}>
        <span className="ai-tog-ico">✦</span>
        <span className="ai-tog-lbl">AI</span>
      </button>

      <div className={`ai-panel${aiOpen ? ' open' : ''}`}>
        <div className="ai-ph">
          <div className="ai-av">✦</div>
          <div className="ai-pt">
            <strong>JMPro AI Advisor</strong>
            <span>Online</span>
          </div>
          <button className="ai-x" onClick={toggleAI}>×</button>
        </div>

        <div className="ai-msgs" ref={msgsRef}>
          {messages.map((m, i) => (
            <div key={i} className={`ai-m ${m.role}`} dangerouslySetInnerHTML={{ __html: m.html }} />
          ))}
          {thinking && (
            <div className="ai-m bot">
              <div className="ai-think"><span /><span /><span /></div>
            </div>
          )}
          {!thinking && (
            <div className="ai-sugg-block">
              {currentSuggs.map((s) => (
                <button key={s} className="ai-sq" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}
        </div>

        <div className="ai-in-row">
          <textarea
            className="ai-in"
            rows={1}
            placeholder="Ask about your portfolio…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            style={{ height: 'auto' }}
          />
          <button className="ai-send" onClick={() => send()}>↑</button>
        </div>
      </div>
    </>
  );
}
