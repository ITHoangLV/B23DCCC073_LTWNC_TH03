import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

// Layout cho khu vực đã đăng nhập: hiển thị AppHeader với session người dùng
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 bg-slate-50">{children}</main>
      <Footer />
    </div>
  );
}
