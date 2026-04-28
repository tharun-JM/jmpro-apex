'use client';

import { useRouter } from 'next/navigation';

const cards = [
  { cls: 'hni', icon: '👑', title: 'JMPro HNI Wealth', desc: '360° view of all your holdings — equity, mutual funds and more — with live tax intelligence and AI advisor.', badge: '✦ New · For ₹5Cr+ investors', href: '/hni' },
  { cls: '', icon: '📊', title: 'Research Center', desc: 'JM Research recommendations, target prices and analyst reports across 400+ stocks.', href: null },
  { cls: '', icon: '⚡', title: 'Options Strategy Builder', desc: 'Build, backtest and execute multi-leg options strategies with live P&L simulation.', href: null },
  { cls: '', icon: '🎯', title: 'Goal Planner', desc: 'Set financial goals and get a personalised SIP plan built around JM\'s top-rated funds.', href: '/goal-advisor' },
  { cls: '', icon: '📈', title: 'JM PMS', desc: 'Access JM\'s Portfolio Management Strategies. Minimum ₹50L. Track performance in real time.', href: null },
  { cls: '', icon: '🏦', title: 'Fixed Income Desk', desc: 'Bonds, NCDs and SGBs curated by JM\'s fixed income team with yield comparisons.', href: null },
];

const iconMap: Record<string, string> = {
  '👑': 'ic-gold', '📊': 'ic-blue', '⚡': 'ic-green', '🎯': 'ic-purple', '📈': 'ic-gold', '🏦': 'ic-blue',
};

export default function DiscoverPage() {
  const router = useRouter();
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
      <div className="sec-title">Discover</div>
      <div className="sec-sub">Explore premium tools built for serious investors</div>
      <div className="disc-grid">
        {cards.map((c) => (
          <div key={c.title} className={`dc ${c.cls}`} onClick={() => c.href && router.push(c.href)}>
            <div className={`dc-icon ${iconMap[c.icon]}`}>{c.icon}</div>
            <div className="dc-title">{c.title}</div>
            <div className="dc-desc">{c.desc}</div>
            {c.badge && <div className="dc-badge">{c.badge}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
