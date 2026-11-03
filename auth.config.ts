import type { NextAuthConfig } from 'next-auth';

// Cấu hình nhẹ dùng được ở Edge runtime (middleware)
// Không import bcrypt hay Node.js modules ở đây
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    // Proxy cũng cần role từ JWT để chặn trang quản trị trước khi render.
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    // Kiểm soát redirect sau đăng nhập
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnDashboard || isOnAdmin) {
        return isLoggedIn; // redirect to login if not authenticated
      }
      return true;
    },
  },
  providers: [], // Providers được khai báo ở auth.ts
};
