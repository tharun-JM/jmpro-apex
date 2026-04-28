import { NextResponse } from 'next/server';
import { JM, EXT } from '@/data/holdings';

export async function GET() {
  await new Promise((r) => setTimeout(r, 100));

  const jmTotal = JM.reduce((s, h) => s + h.cv, 0);
  const extTotal = EXT.reduce((s, h) => s + h.cv, 0);
  const total = jmTotal + extTotal;

  const jmGain = JM.reduce((s, h) => s + h.g, 0);
  const extGain = EXT.reduce((s, h) => s + h.g, 0);
  const totalGain = jmGain + extGain;

  const jmInvested = JM.reduce((s, h) => s + h.iv, 0);
  const extInvested = EXT.reduce((s, h) => s + h.iv, 0);
  const totalInvested = jmInvested + extInvested;

  const gainPct = ((totalGain / totalInvested) * 100).toFixed(1);

  return NextResponse.json({
    total,
    totalGain,
    gainPct: parseFloat(gainPct),
    xirr: 19.8,
    jmpro: { value: jmTotal, gain: jmGain, xirr: 24.6, count: JM.length },
    external: { value: extTotal, gain: extGain, xirr: 16.3, count: EXT.length },
    monthlyChange: 120000,
    fetchedAt: new Date().toISOString(),
  });
}
