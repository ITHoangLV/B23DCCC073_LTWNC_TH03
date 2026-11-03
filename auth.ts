import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { getUserByEmail } from '@/lib/db';
import { z } from 'zod';
import type { Role } from '@/lib/permissions';
import type { Provider } from 'next-auth/providers';

// Schema validate đầu vào đăng nhập
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const providers: Provider[] = [
  Credentials({
    async authorize(credentials) {
      // Validate đầu vào
      const parsed = loginSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const { email, password } = parsed.data;
      const user = await getUserByEmail(email);
      if (!user) return null;

      // Kiểm tra mật khẩu với bcrypt
      const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordsMatch) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Exclude<Role, 'guest'>,
      };
    },
  }),
];

// Bonus: Kích hoạt GitHub OAuth nếu có cấu hình biến môi trường
if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      profile(profile) {
        return {
          id: `github:${profile.id}`,
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: 'user' as const, // Mặc định role 'user' cho tài khoản GitHub mới
        };
      },
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    // Đưa id và role vào JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = (user.id as string) ?? token.sub;
        token.role = (user as { role?: Exclude<Role, 'guest'> }).role ?? 'user';
      }
      return token;
    },
    // Đưa id và role từ token vào session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
