import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import type { Subject } from '@/lib/types';

export default function SubjectCard({ subject, count, index, compact = false }: { subject: Subject; count: number; index: number; compact?: boolean }) {
  return (
    <Link href={'/subjects/' + subject.slug} className={'course-card course-tone-' + index % 4 + (compact ? ' course-card-compact' : '')}>
      <div className="flex justify-between items-start gap-4">
        <div><p className="course-number">MÔN HỌC / {String(index + 1).padStart(2, '0')}</p><h3>{subject.name}</h3><p className="course-teacher">{subject.teacher}</p></div>
        <ArrowUpRight className="course-arrow w-4 h-4 shrink-0" aria-hidden="true" />
      </div>
      {!compact && <p className="course-description">{subject.description}</p>}
      <div className="course-meta"><span className="inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />{count} deadline</span><span>Xem môn học →</span></div>
    </Link>
  );
}
