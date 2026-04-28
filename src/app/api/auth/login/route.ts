import { NextRequest, NextResponse } from 'next/server';

const DEMO_USERS = [
  { email: 'meenal.tiwari@jmfinancial.in', password: 'demo1234', name: 'Meenal Tiwari', initials: 'MT' },
];

export async function POST(req: NextRequest) {
  const { credential, password } = await req.json();

  if (!credential || !password) {
    return NextResponse.json({ error: 'Credential and password required' }, { status: 400 });
  }

  const user = DEMO_USERS.find(
    (u) => (u.email === credential) && u.password === password
  );

  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: { name: user.name, email: user.email, initials: user.initials },
  });
}
