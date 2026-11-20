import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect administrative mutation APIs
  const isProtectedAdminApi =
    (pathname.startsWith('/api/sites') && request.method !== 'GET') ||
    pathname.startsWith('/api/ai/');

  if (isProtectedAdminApi) {
    const adminSession = request.cookies.get('ew_admin_session')?.value;
    const authHeader = request.headers.get('authorization');

    if (adminSession !== 'authenticated' && !authHeader) {
      return NextResponse.json(
        { error: 'Akses tidak sah: Operasi ini membutuhkan otentikasi administrator.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/sites/:path*',
    '/api/ai/:path*',
  ],
};
