import { NextRequest, NextResponse } from 'next/server';
import { EXT } from '@/data/holdings';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src'); // cams | cdsl | nsdl | null = all

  // Simulate registrar API latency
  await new Promise((r) => setTimeout(r, 180));

  const filtered = src ? EXT.filter((h) => h.src === src) : EXT;
  return NextResponse.json({ holdings: filtered, source: src ?? 'all', fetchedAt: new Date().toISOString() });
}
