import { NextRequest, NextResponse } from 'next/server';

// Simulates fetching from CAMS, CDSL, NSDL with realistic per-source delays
export async function POST(req: NextRequest) {
  const { pan } = await req.json();

  if (!pan || pan.length !== 10) {
    return NextResponse.json({ error: 'Invalid PAN. Must be 10 characters.' }, { status: 400 });
  }

  // Simulate network delay for aggregation
  await new Promise((r) => setTimeout(r, 800));

  return NextResponse.json({
    success: true,
    pan: pan.toUpperCase(),
    name: 'Meenal Tiwari',
    sources: {
      jmpro: { fetched: 5, label: '5 JMPro holdings' },
      cams: { fetched: 6, label: '6 MF schemes fetched' },
      cdsl: { fetched: 9, label: '9 equity holdings' },
      nsdl: { fetched: 3, label: '3 equity holdings' },
    },
    syncedAt: new Date().toISOString(),
  });
}
