import Link from 'next/link';
import Brand from '@/components/Brand';

export default function Footer() {
  return <footer className="reference-footer"><div className="site-container footer-content"><div><Brand /><p>Mọi deadline của lớp, ở cùng một chỗ.</p></div><nav aria-label="Liên kết cuối trang"><Link href="/deadlines">Deadline</Link><Link href="/subjects">Môn học</Link><Link href="/dashboard">Dashboard</Link></nav><p>© {new Date().getFullYear()} · PTIT</p></div></footer>;
}
