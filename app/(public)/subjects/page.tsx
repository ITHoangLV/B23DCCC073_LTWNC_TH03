import { getSubjects, getDeadlines } from '@/lib/db';
import SubjectCard from '@/components/SubjectCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Môn học',
  description: 'Danh sách các môn học và deadline tương ứng của lớp PTIT',
};

export default async function SubjectsPage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  return <div className="site-container page-space"><div className="page-intro"><p className="section-kicker">HỌC KỲ CỦA BẠN</p><h1>Môn học của lớp</h1><p>Tìm môn học, xem giảng viên và theo dõi những hạn nộp liên quan.</p><span className="page-count">{subjects.length} môn học</span></div><div className="grid md:grid-cols-2 gap-5">{subjects.map((subject, index) => <SubjectCard key={subject.id} subject={subject} index={index} count={deadlines.filter((d) => d.subjectId === subject.id).length} />)}</div>{subjects.length === 0 && <div className="empty-panel">Chưa có môn học. Thông tin sẽ được cập nhật tại đây.</div>}</div>;
}
