import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';

// Layout công khai: dùng PublicHeader (không gọi auth()/cookies),
// đảm bảo các route con giữ nguyên khả năng SSG và ISR
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
