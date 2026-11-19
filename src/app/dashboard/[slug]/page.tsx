import React from 'react';
import { MemberSiteEditor } from '@/components/dashboard/MemberSiteEditor';

export default async function MemberDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="w-full">
      <MemberSiteEditor slug={slug} />
    </div>
  );
}
