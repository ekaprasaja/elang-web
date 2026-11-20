import React from 'react';
import { SuperAdminOverview } from '@/components/admin/SuperAdminOverview';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export const metadata = {
  title: 'Super Admin Pusat - Platform Website Member Partai Elang',
  description: 'Pusat kendali multi-tenant website anggota Partai Elang Indonesia.',
};

export default function AdminPage() {
  return (
    <div className="w-full">
      <AdminAuthGuard
        title="Super Admin Pusat"
        subtitle="Akses khusus pengurus DPP Partai Elang untuk manajemen website kader se-Indonesia."
      >
        <SuperAdminOverview />
      </AdminAuthGuard>
    </div>
  );
}
