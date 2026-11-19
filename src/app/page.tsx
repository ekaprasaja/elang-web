import React from 'react';
import { ewRepository } from '@/lib/repository';
import { MemberDirectory } from '@/components/portal/MemberDirectory';
import { Shield, Users, Sparkles, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  const sites = await ewRepository.getAllSites();
  const globalParty = await ewRepository.getGlobalSettings();

  return (
    <div className="space-y-16 py-6 animate-fade-in">
      {/* Hero Portal Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E1E24] via-[#17171A] to-[#121214] border border-white/10 p-8 sm:p-14 shadow-2xl">
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 rounded-full text-xs font-mono font-semibold uppercase">
            <Shield className="w-3.5 h-3.5" />
            Portal Resmi Fraksi & Kader Partai Elang
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
            Kedaulatan Maritim & Pengabdian Nyata untuk Rakyat
          </h1>

          <p className="text-sm sm:text-base text-[#F0ECE2]/70 leading-relaxed">
            Selamat datang di direktori resmi website personal branding anggota dan kader Partai Elang. Telusuri profil, kawal realisasi program kerja, pantau dokumentasi kegiatan lapangan, dan sampaikan aspirasi Anda secara langsung.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#C9A33D]/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kelola di Super Admin</span>
            </Link>
            <a
              href="#direktori"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all"
            >
              <span>Telusuri Website Kader ({sites.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A33D]" />
            </a>
          </div>
        </div>

        {/* Subtle Watermark */}
        <div className="absolute right-4 bottom-2 opacity-5 pointer-events-none select-none text-[320px] font-black font-display hidden lg:block">
          🦅
        </div>
      </section>

      {/* Directory Section */}
      <section id="direktori" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              Etalase Representasi Publik
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
              Direktori Website Anggota & Calon Legislatif
            </h2>
          </div>
          <span className="text-xs text-[#F0ECE2]/60 font-mono">
            Tersinkronisasi Real-Time dengan Supabase
          </span>
        </div>

        <MemberDirectory sites={sites} />
      </section>
    </div>
  );
}
