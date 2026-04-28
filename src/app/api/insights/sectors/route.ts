import { NextResponse } from 'next/server';
import { SECTORS } from '@/data/sectors';

export async function GET() {
  await new Promise((r) => setTimeout(r, 80));
  return NextResponse.json({ sectors: SECTORS, threshold: 25 });
}
