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
            Partai Elang • Bersama, Kita Bisa!
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
            Gerakan Politik Kebangsaan Untuk Indonesia
          </h1>

          <p className="text-sm sm:text-base text-[#F0ECE2]/80 leading-relaxed">
            Partai Elang hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia melalui kolaborasi, partisipasi, dan kontribusi nyata.
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#F0ECE2]/60">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#C9A33D]">Fokus: Kaderisasi</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Jangkauan: Nasional</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">Karakter: Kolaboratif</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#direktori"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#C9A33D]/20 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Jelajahi Profil Kader ({sites.length})</span>
            </a>
            <a
              href="https://member.incodegen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all"
            >
              <span>Gabung Jadi Kader</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C9A33D]" />
            </a>
          </div>
        </div>

        {/* Watermark Logo */}
        <div className="absolute right-6 bottom-4 opacity-10 pointer-events-none select-none w-72 h-72 hidden lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-transparent.webp" alt="Partai Elang Watermark" className="w-full h-full object-contain" />
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
