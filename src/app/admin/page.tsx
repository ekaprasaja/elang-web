import React from 'react';
import { SuperAdminOverview } from '@/components/admin/SuperAdminOverview';

export const metadata = {
  title: 'Super Admin Pusat - Platform Website Member Partai Elang',
  description: 'Pusat kendali multi-tenant website anggota Partai Elang Indonesia.',
};

export default function AdminPage() {
  return (
    <div className="w-full">
      <SuperAdminOverview />
    </div>
  );
}
