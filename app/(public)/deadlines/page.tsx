export const revalidate = 60;

import { getDeadlines, getSubjects } from '@/lib/db';
import DeadlineFilter from '@/components/DeadlineFilter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách Deadline',
  description: 'Tất cả deadline môn học của lớp - lọc theo môn, trạng thái và tìm kiếm',
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  return <div className="site-container page-space"><div className="page-intro"><p className="section-kicker">SẮP XẾP VIỆC HỌC</p><h1>Deadline của lớp</h1><p>Tất cả bài tập, báo cáo và kiểm tra. Tìm nhanh việc cần làm, chủ động thời gian của bạn.</p><span className="page-count">{deadlines.length} deadline · {subjects.length} môn học</span></div><DeadlineFilter deadlines={deadlines} subjects={subjects} /></div>;
}
