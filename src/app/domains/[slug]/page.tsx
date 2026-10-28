import { notFound } from 'next/navigation';
import { getAllDomains, getDomainBySlug } from '@/data/domains';
import DomainTimelineClient from '@/components/DomainTimelineClient';
import { Metadata } from 'next';

export function generateStaticParams() {
  return getAllDomains().map((domain) => ({
    slug: domain.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);

  if (!domain) {
    return { title: 'Domain Roadmap | PathFinder' };
  }

  return {
    title: `${domain.name} Roadmap | PathFinder`,
    description: domain.shortDescription,
  };
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = getDomainBySlug(slug);

  if (!domain) {
    notFound();
  }

  return <DomainTimelineClient domain={domain} />;
}
