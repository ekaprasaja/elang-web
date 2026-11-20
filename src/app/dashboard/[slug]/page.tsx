import React from 'react';
import { MemberSiteEditor } from '@/components/dashboard/MemberSiteEditor';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default async function MemberDashboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="w-full">
      <AdminAuthGuard
        title="CMS Laman Kader"
        subtitle={`Login pengurus/tim sukses untuk mengelola konten laman resmi ${slug}.`}
      >
        <MemberSiteEditor slug={slug} />
      </AdminAuthGuard>
    </div>
  );
}
