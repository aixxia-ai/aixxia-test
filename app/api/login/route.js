import { NextResponse } from 'next/server';
import { createSession } from '../../../lib/auth';

const ACCESS_CODE = process.env.ACCESS_CODE || '873104';

export async function POST(request) {
  let code = '';
  try {
    const body = await request.json();
    code = String(body?.code ?? '');
  } catch {}
  if (code !== ACCESS_CODE) {
    return NextResponse.json({ ok: false, error: 'Onjuiste code' }, { status: 401 });
  }
  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set('aixxia_session', token, {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8,
  });
  return res;
}
