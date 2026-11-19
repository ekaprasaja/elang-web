'use client';

import React from 'react';
import { MemberProfile, Site } from '@/types';
import {
  GraduationCap,
  Briefcase,
  Target,
  Compass,
  Mail,
  Phone,
  Globe,
  Share2,
} from 'lucide-react';

interface MemberProfileProps {
  site: Site;
  profile?: MemberProfile;
}

export const MemberProfileSection: React.FC<MemberProfileProps> = ({ site, profile }) => {
  if (!profile) return null;

  return (
    <section id="profil" className="py-16 bg-[#1A1A1E] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
            Mengenal Lebih Dekat
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Profil, Visi, & Rekam Jejak Pengabdian
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A33D]"></div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Bio & Visi Misi (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-[#C9A33D] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#C9A33D]" />
                Biografi Ringkas
              </h3>
              <p className="text-xs sm:text-sm text-[#F0ECE2]/80 leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </div>

            {/* Visi & Misi */}
            <div className="space-y-4 bg-[#17171A] p-6 rounded-2xl border border-white/10">
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-[#C9A33D]" />
                Visi & Komitmen Pokok
              </h3>
              {profile.visi_personal && (
                <div className="bg-[#C9A33D]/10 border-l-4 border-[#C9A33D] p-3 text-xs sm:text-sm italic text-[#F0ECE2]/90">
                  "{profile.visi_personal}"
                </div>
              )}
              {profile.misi_personal && profile.misi_personal.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-[#C9A33D] uppercase tracking-wider">
                    Pilar Perjuangan:
                  </span>
                  <ul className="space-y-2">
                    {profile.misi_personal.map((m, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F0ECE2]/80">
                        <span className="w-5 h-5 rounded-full bg-[#C9A33D]/20 text-[#C9A33D] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Riwayat & Kontak Sosial (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Riwayat Pendidikan */}
            {profile.riwayat_pendidikan && profile.riwayat_pendidikan.length > 0 && (
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="font-display font-bold text-sm text-[#C9A33D] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Riwayat Pendidikan
                </h4>
                <div className="space-y-2.5">
                  {profile.riwayat_pendidikan.map((edu, idx) => (
                    <div key={idx} className="border-l-2 border-white/20 pl-3 py-0.5">
                      <div className="text-xs font-bold text-white">{edu.jenjang}</div>
                      <div className="text-[11px] text-[#F0ECE2]/70">{edu.institusi}</div>
                      <div className="text-[10px] text-[#C9A33D] font-mono">{edu.tahun}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Riwayat Organisasi */}
            {profile.riwayat_organisasi && profile.riwayat_organisasi.length > 0 && (
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="font-display font-bold text-sm text-[#C9A33D] flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Pengalaman Organisasi
                </h4>
                <div className="space-y-2.5">
                  {profile.riwayat_organisasi.map((org, idx) => (
                    <div key={idx} className="border-l-2 border-white/20 pl-3 py-0.5">
                      <div className="text-xs font-bold text-white">{org.posisi}</div>
                      <div className="text-[11px] text-[#F0ECE2]/70">{org.organisasi}</div>
                      <div className="text-[10px] text-[#C9A33D] font-mono">{org.periode}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Kontak & Media Sosial */}
            <div className="bg-[#17171A] p-5 rounded-2xl border border-white/10 space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-[#C9A33D]">
                Saluran Komunikasi Resmi
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {profile.kontak_email && (
                  <div className="flex items-center gap-2 text-[#F0ECE2]/80">
                    <Mail className="w-3.5 h-3.5 text-[#C9A33D]" />
                    <span className="truncate">{profile.kontak_email}</span>
                  </div>
                )}
                {profile.kontak_wa && (
                  <div className="flex items-center gap-2 text-[#F0ECE2]/80">
                    <Phone className="w-3.5 h-3.5 text-[#C9A33D]" />
                    <span>WhatsApp: {profile.kontak_wa}</span>
                  </div>
                )}
                {profile.kontak_instagram && (
                  <a
                    href={profile.kontak_instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#C9A33D] hover:underline"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Instagram Resmi</span>
                  </a>
                )}
                {profile.kontak_twitter && (
                  <a
                    href={profile.kontak_twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#C9A33D] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>X (Twitter)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
