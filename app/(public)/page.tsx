import Link from 'next/link';
import { ArrowRight, Clock3 } from 'lucide-react';
import { getSubjects, getDeadlines } from '@/lib/db';
import CalendarIllustration from '@/components/CalendarIllustration';
import SubjectCard from '@/components/SubjectCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Class Deadline Hub - Theo dõi deadline môn học của lớp PTIT',
};

export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const now = new Date();
  const upcoming = deadlines.filter((d) => new Date(d.dueDate) >= now && new Date(d.dueDate).getTime() <= now.getTime() + 7 * 86400000);

  return (
    <div className="reference-home">
      <section className="reference-hero site-container">
        <div className="hero-copy">
          <p className="section-kicker"><span /> CÙNG LỚP CHỦ ĐỘNG MỖI NGÀY</p>
          <h1>Mọi deadline của lớp,<br />ở cùng <span>một chỗ.</span></h1>
          <p>Tra cứu hạn nộp bài tập, báo cáo và kiểm tra của các môn học. Đăng nhập để đánh dấu những việc đã xong.</p>
          <div className="hero-actions">
            <Link href="/deadlines" className="button-primary">Xem deadline <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/dashboard" className="button-text">Dashboard của tôi <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="hero-caption"><span className="caption-check">✓</span> Ít bỏ lỡ hơn. Thêm chủ động hơn.</div>
        </div>
        <CalendarIllustration className="hero-illustration" />
      </section>

      <section className="site-container home-courses">
        <div className="reference-section-heading"><div><p className="section-kicker">HỌC KỲ CỦA BẠN</p><h2>Môn học</h2></div><Link href="/subjects">Tất cả môn học <ArrowRight size={14} aria-hidden="true" /></Link></div>
        <div className="grid md:grid-cols-2 gap-4">{subjects.map((subject, index) => <SubjectCard key={subject.id} subject={subject} index={index} count={deadlines.filter((d) => d.subjectId === subject.id).length} compact />)}</div>
        {subjects.length === 0 && <div className="empty-panel">Chưa có môn học. Thông tin sẽ được cập nhật tại đây.</div>}
      </section>

      <section className="site-container home-upcoming">
        <div className="reference-section-heading"><div><p className="section-kicker">SẮP ĐẾN HẠN</p><h2>Tập trung cho tuần này</h2></div><Link href="/deadlines">Xem deadline <ArrowRight size={14} aria-hidden="true" /></Link></div>
        {upcoming.length ? <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{upcoming.slice(0, 6).map((deadline) => <Link className="upcoming-card" href={'/deadlines/' + deadline.id} key={deadline.id}><p className="text-xs text-slate-500 mb-3">{subjects.find((s) => s.id === deadline.subjectId)?.name}</p><h3 className="text-base font-semibold text-slate-900 leading-relaxed mb-5">{deadline.title}</h3><div className="flex justify-between items-center gap-3"><span className="deadline-chip"><Clock3 size={12} aria-hidden="true" />Còn {Math.ceil((new Date(deadline.dueDate).getTime() - now.getTime()) / 86400000)} ngày</span><ArrowRight size={15} className="text-slate-400" aria-hidden="true" /></div></Link>)}</div> : <div className="empty-panel"><span className="empty-check" aria-hidden="true">✓</span><div><h3>Tuần này chưa có deadline sắp tới</h3><p>Bạn có thể xem toàn bộ bài tập trong danh sách deadline của lớp.</p></div><Link href="/deadlines" className="button-text">Xem danh sách →</Link></div>}
      </section>

      <section className="site-container pb-14"><div className="reference-cta"><div><p className="section-kicker">KHÔNG GIAN CÁ NHÂN</p><h2>Hoàn thành từng việc. Tiến bộ mỗi ngày.</h2><p>Đăng nhập để lưu tiến độ học tập của riêng bạn.</p></div><Link href="/login" className="button-primary">Bắt đầu ngay <ArrowRight size={16} aria-hidden="true" /></Link></div></section>
    </div>
  );
}
