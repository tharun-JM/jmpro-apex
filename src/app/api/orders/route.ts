import { NextRequest, NextResponse } from 'next/server';

// In-memory store — resets on server restart (demo only)
// Replace with a real DB (e.g. Prisma + SQLite) for persistence
const ordersStore: {
  id: string;
  type: string;
  name: string;
  qty: number;
  price: number;
  total: number;
  src: string;
  sec: string;
  status: string;
  time: string;
  isSIP: boolean;
}[] = [];

export async function GET() {
  return NextResponse.json({ orders: ordersStore });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, name, qty, price, total, src, sec, status, isSIP } = body;

  if (!name || !type) {
    return NextResponse.json({ error: 'name and type required' }, { status: 400 });
  }

  const order = {
    id: 'ORD' + Date.now(),
    type: isSIP ? 'sip' : type,
    name,
    qty: qty ?? 1,
    price: price ?? 0,
    total: total ?? 0,
    src: src ?? 'JMPro',
    sec: sec ?? '—',
    status: status ?? (isSIP ? 'SIP Initiated' : 'Executed'),
    time: new Date().toISOString(),
    isSIP: !!isSIP,
  };

  ordersStore.unshift(order);
  return NextResponse.json({ success: true, order }, { status: 201 });
}
