import { getDeadlines, getSubjects } from '@/lib/db';
import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);

  const subjectUrls: MetadataRoute.Sitemap = subjects.map((s) => ({
    url: `${siteUrl}/subjects/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const deadlineUrls: MetadataRoute.Sitemap = deadlines.map((d) => ({
    url: `${siteUrl}/deadlines/${d.id}`,
    lastModified: new Date(d.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/deadlines`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/subjects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...subjectUrls,
    ...deadlineUrls,
  ];
}

