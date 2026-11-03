import NextAuth from 'next-auth';
import { authConfig } from '@/auth.config';
import { can } from '@/lib/permissions';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

// Middleware chạy ở Edge - phòng thủ lớp 1
// Lớp 2: trang/layout tự kiểm tra lại
// Lớp 3: Server Action tự kiểm tra lại
export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role as 'user' | 'admin' | undefined;

  const isOnAdmin = nextUrl.pathname.startsWith('/admin');
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

  // Chưa đăng nhập -> redirect login kèm callbackUrl
  if ((isOnDashboard || isOnAdmin) && !isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User thường vào /admin -> redirect 403
  if (isOnAdmin && isLoggedIn && role && !can(role, 'deadline:create')) {
    return NextResponse.redirect(new URL('/403', nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
