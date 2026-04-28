import { NextRequest, NextResponse } from 'next/server';
import { TAX_DATA } from '@/data/tax';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  await new Promise((r) => setTimeout(r, 100));

  if (id) {
    const entry = TAX_DATA.find((t) => t.id === id);
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(entry);
  }

  const summary = {
    stcgRealised: 384000,
    ltcgRealised: 270000,
    unrealisedRisk: 842000,
    taxHarvested: 114000,
    totalLiability: 654000,
    fy: '2025-26',
  };

  return NextResponse.json({ summary, entries: TAX_DATA });
}
