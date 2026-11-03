import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

// Font hỗ trợ tiếng Việt với subset vietnamese
const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
  variable: '--font-be-vietnam',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Class Deadline Hub',
    default: 'Class Deadline Hub - Cổng Deadline Lớp',
  },
  description: 'Quản lý deadline môn học của lớp PTIT - xem, theo dõi và đánh dấu deadline đã hoàn thành.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: 'Class Deadline Hub',
    title: 'Class Deadline Hub - Cổng Deadline Lớp',
    description: 'Quản lý deadline môn học của lớp PTIT',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'Class Deadline Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Class Deadline Hub',
    description: 'Quản lý deadline môn học của lớp PTIT',
    images: ['/og-default.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${beVietnamPro.className} bg-white text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
