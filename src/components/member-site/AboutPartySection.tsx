'use client';

import React from 'react';
import { GlobalPartySettings } from '@/types';
import { Shield, Sparkles, CheckCircle, Globe2, Users, Compass } from 'lucide-react';

interface AboutPartySectionProps {
  party: GlobalPartySettings;
}

export const AboutPartySection: React.FC<AboutPartySectionProps> = ({ party }) => {
  return (
    <section className="py-16 bg-[#141417] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Header & Tagline */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 rounded-full text-xs font-mono font-semibold uppercase">
            <Shield className="w-3.5 h-3.5" />
            {party.party_tagline || 'Gerakan Politik Kebangsaan Untuk Indonesia'}
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Tentang {party.party_name}
          </h2>
          <p className="text-xs sm:text-sm text-[#F0ECE2]/80 leading-relaxed">
            {party.tentang_partai}
          </p>
        </div>

        {/* 3 Karakter / Pilar Gerakan (dari partaielang.id) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1E] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A33D]/10 border border-[#C9A33D]/30 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-[#C9A33D]" />
            </div>
            <div>
              <p className="text-[11px] text-[#F0ECE2]/50 uppercase tracking-wider font-mono">Fokus Kerja</p>
              <p className="font-display font-bold text-base text-white">Kaderisasi</p>
            </div>
          </div>

          <div className="bg-[#1A1A1E] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A33D]/10 border border-[#C9A33D]/30 flex items-center justify-center shrink-0">
              <Globe2 className="w-6 h-6 text-[#C9A33D]" />
            </div>
            <div>
              <p className="text-[11px] text-[#F0ECE2]/50 uppercase tracking-wider font-mono">Jangkauan</p>
              <p className="font-display font-bold text-base text-white">Nasional</p>
            </div>
          </div>

          <div className="bg-[#1A1A1E] p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#C9A33D]/10 border border-[#C9A33D]/30 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6 text-[#C9A33D]" />
            </div>
            <div>
              <p className="text-[11px] text-[#F0ECE2]/50 uppercase tracking-wider font-mono">Karakter Gerakan</p>
              <p className="font-display font-bold text-base text-white">Kolaboratif</p>
            </div>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-[#1A1A1E] p-6 sm:p-8 rounded-2xl border border-[#C9A33D]/30 bg-gradient-to-br from-[#1A1A1E] to-[#1F1F24] space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              <Sparkles className="w-4 h-4 text-[#C9A33D]" />
              Visi Resmi
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              Terwujudnya Cita-cita Perubahan Indonesia
            </h3>
            <p className="text-xs sm:text-sm text-[#F0ECE2]/80 leading-relaxed">
              {party.visi_partai}
            </p>
            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#C9A33D] font-medium">
              <span>Motto: &quot;Bersama, Kita Bisa!&quot;</span>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-[#1A1A1E] p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              <Shield className="w-4 h-4 text-[#C9A33D]" />
              Misi Pokok Perjuangan
            </div>
            <h3 className="font-display font-black text-xl sm:text-2xl text-white">
              4 Arah Perjuangan Kebangsaan
            </h3>
            <ul className="space-y-3">
              {party.misi_partai.map((m, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#F0ECE2]/80 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bergerak Bersama Callout */}
        <div className="rounded-2xl p-6 bg-gradient-to-r from-[#C9A33D]/10 via-amber-500/5 to-transparent border border-[#C9A33D]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-display font-bold text-white text-base">
              Menyatukan Semangat, Menguatkan Indonesia
            </h4>
            <p className="text-xs text-[#F0ECE2]/70 max-w-2xl">
              Kami siap menjadi pelopor perubahan dan garda terdepan dalam memperjuangkan hak-hak rakyat melalui kolaborasi, partisipasi, dan kontribusi nyata.
            </p>
          </div>
          <a
            href="https://partaielang.id/about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shrink-0 transition"
          >
            Info Resmi Partai
          </a>
        </div>
      </div>
    </section>
  );
};
