import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ewRepository } from '@/lib/repository';
import { MemberHero } from '@/components/member-site/MemberHero';
import { MemberProfileSection } from '@/components/member-site/MemberProfile';
import { MemberProgramsSection } from '@/components/member-site/MemberPrograms';
import { MemberNewsSection } from '@/components/member-site/MemberNews';
import { MemberGallerySection } from '@/components/member-site/MemberGallery';
import { MemberTestimonialsSection } from '@/components/member-site/MemberTestimonials';
import { AspirationForm } from '@/components/member-site/AspirationForm';
import { AboutPartySection } from '@/components/member-site/AboutPartySection';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const site = await ewRepository.getSiteBySlug(slug);
  if (!site) {
    return {
      title: 'Kader Tidak Ditemukan - Partai Elang',
    };
  }

  return {
    title: `${site.nama_anggota} - Laman Resmi Kader Partai Elang`,
    description: `${site.jabatan} • ${site.dapil}. ${site.tagline || ''}`,
    openGraph: {
      title: site.nama_anggota,
      description: site.jabatan,
      images: site.foto_resmi_url ? [site.foto_resmi_url] : [],
    },
  };
}

export default async function MemberSitePage({ params }: Props) {
  const { slug } = await params;

  // Ignore system routes if matched by accident
  if (['admin', 'api', 'dashboard', 'favicon.ico'].includes(slug)) {
    notFound();
  }

  const siteData = await ewRepository.getMemberSiteFullData(slug);
  if (!siteData) {
    notFound();
  }

  const { site, profile, programs, news, gallery, testimonials, globalParty } = siteData;

  return (
    <div className="w-full space-y-0 -mx-4 md:-mx-6 -mt-4 md:-mt-6">
      {/* 1. Campaign Poster Hero */}
      <MemberHero site={site} profile={profile} />

      {/* 2. Biografi & Visi Misi */}
      <MemberProfileSection site={site} profile={profile} />

      {/* 3. Program Kerja & Capaian */}
      <MemberProgramsSection programs={programs} memberName={site.nama_anggota} />

      {/* 4. Berita & Kegiatan */}
      <MemberNewsSection news={news} memberName={site.nama_anggota} />

      {/* 5. Galeri Foto Lapangan */}
      <MemberGallerySection gallery={gallery} />

      {/* 6. Testimoni Warga */}
      <MemberTestimonialsSection testimonials={testimonials} memberName={site.nama_anggota} />

      {/* 7. Formulir Aspirasi Online */}
      <AspirationForm siteId={site.id} memberName={site.nama_anggota} />

      {/* 8. Garis Perjuangan Partai Elang */}
      <AboutPartySection party={globalParty} />
    </div>
  );
}
