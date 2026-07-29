import { NextResponse } from 'next/server';
import { verifySession } from './lib/auth';

export async function middleware(request) {
  const token = request.cookies.get('aixxia_session')?.value;
  const ok = await verifySession(token);
  if (!ok) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('denied', '1');
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/board/:path*'] };
