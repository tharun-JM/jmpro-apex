import { NextResponse } from 'next/server';
import { JM } from '@/data/holdings';

export async function GET() {
  // Simulate internal API latency
  await new Promise((r) => setTimeout(r, 120));
  return NextResponse.json({ holdings: JM, source: 'jmpro', fetchedAt: new Date().toISOString() });
}
