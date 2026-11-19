'use client';

import React from 'react';
import { Site, MemberProfile } from '@/types';
import { Shield, MapPin, Send, ArrowRight, Award } from 'lucide-react';

interface MemberHeroProps {
  site: Site;
  profile?: MemberProfile;
}

export const MemberHero: React.FC<MemberHeroProps> = ({ site, profile }) => {
  return (
    <section className="relative overflow-hidden bg-[#17171A] text-[#F0ECE2] pt-8 pb-16 md:py-20 border-b border-white/10">
      {/* Background Subtle Gradient & Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5 flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-transparent.webp" alt="Partai Elang Watermark" className="w-96 h-96 object-contain" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text / Poster Masthead: 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C9A33D] text-[#17171A] font-black text-xs uppercase tracking-wider rounded-md shadow-md">
                <Award className="w-3.5 h-3.5" />
                NOMOR URUT {site.nomor_urut}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-[#F0ECE2]/90 text-xs font-semibold rounded-md border border-white/15">
                <MapPin className="w-3 h-3 text-[#C9A33D]" />
                {site.dapil}
              </span>
            </div>

            {/* Candidate Name - Large Campaign Poster Display Typography */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
                {site.nama_anggota}
              </h1>
              <div className="h-1 w-24 bg-[#C9A33D]"></div>
              <p className="text-sm sm:text-base font-medium text-[#C9A33D] tracking-wide pt-1">
                {site.jabatan}
              </p>
            </div>

            {/* Tagline & Bio Lead */}
            <div className="space-y-4 max-w-xl">
              {site.tagline && (
                <p className="text-base sm:text-lg italic font-display text-[#F0ECE2]/90 border-l-2 border-[#C9A33D] pl-4 py-1 leading-snug">
                  "{site.tagline}"
                </p>
              )}
              {profile?.bio && (
                <p className="text-xs sm:text-sm text-[#F0ECE2]/70 leading-relaxed line-clamp-3">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#aspirasi"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8A2E22] hover:bg-[#a63729] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#8A2E22]/30 transition-all hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>Sampaikan Aspirasi</span>
              </a>
              <a
                href="#program"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs rounded-xl border border-white/15 transition-all hover:border-[#C9A33D]"
              >
                <span>Program Kerja</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C9A33D]" />
              </a>
            </div>
          </div>

          {/* Right Candidate Portrait: 5 cols with Overlap Effect */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Gold border frame */}
              <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-[#C9A33D]/40 via-transparent to-[#C9A33D]/20 blur-sm"></div>
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#C9A33D]/60 bg-[#1E1E24] shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.foto_resmi_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'}
                  alt={site.nama_anggota}
                  className="w-full h-[420px] object-cover object-top hover:scale-105 transition-transform duration-700"
                />

                {/* Bottom Overlay Badge */}
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-[#17171A] via-[#17171A]/80 to-transparent">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#F0ECE2]">
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-[#C9A33D]" />
                      Partai Elang Indonesia
                    </span>
                    <span className="text-[#C9A33D] font-mono font-bold">Resmi & Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
