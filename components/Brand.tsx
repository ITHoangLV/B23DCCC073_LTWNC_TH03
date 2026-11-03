import Link from 'next/link';
import { CalendarCheck2 } from 'lucide-react';

export default function Brand() {
  return <Link href="/" className="site-brand" aria-label="Class Deadline Hub — Trang chủ"><span className="brand-symbol"><CalendarCheck2 size={20} strokeWidth={2} aria-hidden="true" /></span><span>Class Deadline Hub<small>HỌC VIỆN PTIT</small></span></Link>;
}
