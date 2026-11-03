import { ImageResponse } from 'next/og';
import { getDeadlineById, getSubjects } from '@/lib/db';

export const runtime = 'nodejs';
export const alt = 'Deadline Open Graph Image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OgImage({ params }: Props) {
  const { id } = await params;
  const [deadline, subjects] = await Promise.all([
    getDeadlineById(id),
    getSubjects(),
  ]);

  const subject = deadline ? subjects.find((s) => s.id === deadline.subjectId) : null;
  const dueDate = deadline
    ? new Date(deadline.dueDate).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  // Nạp font hỗ trợ tiếng Việt (Be Vietnam Pro) nếu có mạng, có fallback
  let fontOptions: { fonts?: { name: string; data: ArrayBuffer; weight: 400 | 700; style: 'normal' }[] } = {};
  try {
    const fontRes = await fetch(
      'https://raw.githubusercontent.com/google/fonts/main/ofl/bevietnampro/BeVietnamPro-Bold.ttf',
      { signal: AbortSignal.timeout(2000) }
    );
    if (fontRes.ok) {
      const fontData = await fontRes.arrayBuffer();
      fontOptions = {
        fonts: [
          {
            name: 'Be Vietnam Pro',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      };
    }
  } catch {
    // Không có mạng -> fallback về hệ thống font mặc định
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
          padding: 64,
          fontFamily: fontOptions.fonts ? 'Be Vietnam Pro, sans-serif' : 'sans-serif',
        }}
      >
        {/* Badge môn học */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: 100,
            padding: '8px 20px',
            marginBottom: 24,
            width: 'fit-content',
          }}
        >
          <span style={{ color: 'white', fontSize: 20, fontWeight: 700 }}>
            📚 {subject?.name ?? 'Class Deadline Hub'}
          </span>
        </div>

        {/* Tiêu đề deadline */}
        <div
          style={{
            color: 'white',
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.25,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {deadline?.title ?? 'Deadline Môn Học'}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: 24, fontWeight: 600 }}>
            📅 Class Deadline Hub • PTIT
          </div>
          {dueDate && (
            <div
              style={{
                background: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 14,
                padding: '12px 28px',
                color: 'white',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              Hạn nộp: {dueDate}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...fontOptions,
    }
  );
}
