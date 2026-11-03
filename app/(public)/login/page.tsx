import { redirect } from 'next/navigation';
import { auth, signIn } from '@/auth';
import type { Metadata } from 'next';
import { AuthError } from 'next-auth';
import CalendarIllustration from '@/components/CalendarIllustration';
import { 
  Lock, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  LogIn, 
  AlertCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = callbackUrl?.startsWith('/') && !callbackUrl.startsWith('//') && !callbackUrl.includes('\\')
    ? callbackUrl
    : '/dashboard';
  const githubEnabled = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);

  // Đã đăng nhập -> redirect
  const session = await auth();
  if (session?.user) {
    redirect(redirectTo);
  }

  const errorMessages: Record<string, string> = {
    CredentialsSignin: 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.',
    OAuthSignin: 'Không thể bắt đầu đăng nhập GitHub. Vui lòng thử lại.',
    OAuthCallbackError: 'Không thể hoàn tất đăng nhập GitHub. Vui lòng thử lại.',
    AccessDenied: 'Bạn chưa cấp quyền đăng nhập. Vui lòng thử lại.',
    default: 'Đã xảy ra lỗi. Vui lòng thử lại.',
  };

  const errorMessage = error ? (errorMessages[error] ?? errorMessages.default) : null;

  return (
    <div className="login-page bg-mesh-gradient min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full grid lg:grid-cols-12 gap-8 items-stretch">
        <aside className="login-reference-story lg:col-span-6">
          <CalendarIllustration className="login-illustration" />
          <p className="section-kicker">HỌC TẬP CHỦ ĐỘNG HƠN</p>
          <h2>Một nơi cho mọi deadline.<br />Một bước gần hơn đến mục tiêu.</h2>
          <p>Đăng nhập để theo dõi bài tập và đánh dấu những việc đã hoàn thành. Cả lớp cùng tiến bộ, mỗi ngày một chút.</p>
          <div className="login-story-features"><span><CheckCircle2 size={15} /> Lưu tiến độ cá nhân</span><span><ShieldCheck size={15} /> Đăng nhập an toàn</span></div>
        </aside>

        {/* Right Side: Login Form Card */}
        <div className="login-form-panel lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col justify-center">
          <div className="mb-6">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
              CỔNG ĐĂNG NHẬP
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dùng tài khoản của lớp hoặc đăng nhập với GitHub.
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            action={async (formData: FormData) => {
              'use server';
              try {
                await signIn('credentials', {
                  email: formData.get('email'),
                  password: formData.get('password'),
                  redirectTo,
                });
              } catch (e) {
                if (e instanceof AuthError) {
                  const params = new URLSearchParams({
                    error: e.type,
                    ...(callbackUrl ? { callbackUrl } : {}),
                  });
                  redirect('/login?' + params.toString());
                }
                throw e;
              }
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email sinh viên
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="sv@ptit.edu.vn"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-semibold py-3 px-4 rounded-xl shadow-xs shadow-brand-600/25 hover:shadow-md hover:shadow-brand-600/30 transition-all text-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập</span>
            </button>
          </form>

          {githubEnabled && (
            <>
              <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>hoặc</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <form action={async () => {
                'use server';
                try {
                  await signIn('github', { redirectTo });
                } catch (e) {
                  if (e instanceof AuthError) {
                    const params = new URLSearchParams({ error: e.type, callbackUrl: redirectTo });
                    redirect('/login?' + params.toString());
                  }
                  throw e;
                }
              }}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 .75a11.25 11.25 0 0 0-3.558 21.923c.563.103.768-.244.768-.542v-2.096c-3.13.68-3.791-1.328-3.791-1.328-.512-1.3-1.25-1.646-1.25-1.646-1.023-.7.078-.686.078-.686 1.13.08 1.725 1.16 1.725 1.16 1.005 1.723 2.637 1.225 3.28.937.102-.728.393-1.225.715-1.507-2.499-.284-5.126-1.25-5.126-5.563 0-1.23.44-2.233 1.16-3.02-.117-.285-.503-1.43.11-2.98 0 0 .945-.303 3.095 1.153A10.78 10.78 0 0 1 12 6.176c.956.004 1.918.13 2.817.379 2.148-1.456 3.091-1.153 3.091-1.153.615 1.55.229 2.695.112 2.98.722.787 1.158 1.79 1.158 3.02 0 4.324-2.631 5.276-5.138 5.555.404.35.764 1.042.764 2.1v3.074c0 .3.203.65.774.54A11.251 11.251 0 0 0 12 .75Z" />
                  </svg>
                  Đăng nhập với GitHub
                </button>
              </form>
            </>
          )}

          {/* Demo Credentials Box */}
          <div className="mt-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Tài khoản trải nghiệm mẫu</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
              <div className="p-2 rounded-lg bg-white border border-slate-200/70">
                <span className="font-semibold text-rose-600 block mb-0.5">Lớp trưởng:</span>
                <span className="font-mono text-[11px] block">admin@ptit.edu.vn</span>
                <span className="font-mono text-[11px] text-slate-400">admin123</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-slate-200/70">
                <span className="font-semibold text-brand-600 block mb-0.5">Sinh viên:</span>
                <span className="font-mono text-[11px] block">sv@ptit.edu.vn</span>
                <span className="font-mono text-[11px] text-slate-400">sv123456</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
