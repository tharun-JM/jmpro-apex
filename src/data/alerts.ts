export interface Alert {
  id: string;
  sev: 'high' | 'medium' | 'info';
  ico: string;
  ttl: string;
  desc: string;
}

export const ALERTS: Alert[] = [
  {
    id: 'a1',
    sev: 'high',
    ico: '🔴',
    ttl: 'Financials Sector at 41% — Overweight',
    desc: 'Your combined Financials exposure across JMPro, CDSL & NSDL is 41% — above the 25% safe threshold. HDFC Bank appears in 3 vehicles simultaneously.',
  },
  {
    id: 'a2',
    sev: 'medium',
    ico: '🟡',
    ttl: 'HDFC Bank Overlap Across 3 Vehicles',
    desc: 'HDFC Bank is held directly in JMPro, CDSL demat, and inside HDFC Large Cap Fund via CAMS. Combined effective exposure: ₹2.99 Cr (16.2% of portfolio).',
  },
  {
    id: 'a3',
    sev: 'medium',
    ico: '🟡',
    ttl: 'Redundant Large-Cap MF Holdings',
    desc: 'HDFC Large Cap, Axis Bluechip & SBI Bluechip share 70%+ of top-10 holdings. You are paying 3x expense ratios for the same stocks.',
  },
  {
    id: 'a4',
    sev: 'info',
    ico: '🔵',
    ttl: 'Reliance Industries at 20.5% — Above Limit',
    desc: 'Reliance appears in JMPro (₹3.15Cr) and CDSL (₹0.63Cr). Combined ₹3.78 Cr = 20.5% of total portfolio — above the 15% single-stock recommended limit.',
  },
];
