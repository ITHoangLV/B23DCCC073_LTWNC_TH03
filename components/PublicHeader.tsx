import Link from 'next/link';
import Brand from '@/components/Brand';
import SiteNavigation from '@/components/SiteNavigation';

// Header công khai không đọc session để giữ khả năng render tĩnh.
export default function PublicHeader() {
  return <header className="reference-header"><div className="site-container header-content"><Brand /><SiteNavigation /><Link href="/login" className="button-primary header-login">Đăng nhập</Link></div></header>;
}
