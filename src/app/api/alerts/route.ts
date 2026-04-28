import { NextResponse } from 'next/server';
import { ALERTS } from '@/data/alerts';

export async function GET() {
  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ alerts: ALERTS, count: ALERTS.length });
}
