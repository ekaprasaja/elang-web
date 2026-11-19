'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Site } from '@/types';
import { Search, MapPin, Award, ExternalLink, ArrowRight, Shield, Sparkles, Edit } from 'lucide-react';

interface MemberDirectoryProps {
  sites: Site[];
}

export const MemberDirectory: React.FC<MemberDirectoryProps> = ({ sites }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDapil, setSelectedDapil] = useState('Semua');

  const dapils = ['Semua', ...Array.from(new Set(sites.map((s) => s.dapil)))];

  const filteredSites = sites.filter((site) => {
    const matchSearch =
      site.nama_anggota.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.dapil.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDapil = selectedDapil === 'Semua' || site.dapil === selectedDapil;
    return matchSearch && matchDapil;
  });

  return (
    <div className="space-y-12">
      {/* Search & Filter Controls */}
      <div className="bg-[#1E1E24] p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#F0ECE2]/40" />
            <input
              type="text"
              placeholder="Cari nama kader, jabatan legislatif, atau daerah pemilihan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#17171A] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#C9A33D]"
            />
          </div>

          <div className="w-full sm:w-auto">
            <select
              value={selectedDapil}
              onChange={(e) => setSelectedDapil(e.target.value)}
              className="w-full sm:w-auto bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
            >
              {dapils.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#F0ECE2]/50 font-mono">
          <span>Menampilkan {filteredSites.length} website kader aktif</span>
          <span className="hidden sm:inline">Multi-Tenant Routing: /nama-anggota</span>
        </div>
      </div>

      {/* Grid of Member Websites */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSites.map((site) => (
          <div
            key={site.id}
            className="group bg-[#1E1E24] rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#C9A33D]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#C9A33D]/10"
          >
            <div>
              {/* Photo & Number Badge */}
              <div className="relative h-64 w-full overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={site.foto_resmi_url || '/images/profiles/arya-pratama.webp'}
                  alt={site.nama_anggota}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-[#C9A33D] text-[#17171A] font-black text-xs font-mono uppercase rounded-lg shadow-md flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    No. {site.nomor_urut}
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#1E1E24] to-transparent">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F0ECE2]/80 bg-[#17171A]/80 backdrop-blur-md px-2 py-0.5 rounded">
                    <MapPin className="w-3 h-3 text-[#C9A33D]" />
                    {site.dapil}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-xl text-white group-hover:text-[#C9A33D] transition-colors leading-snug">
                    {site.nama_anggota}
                  </h3>
                  <p className="text-xs font-semibold text-[#C9A33D]">{site.jabatan}</p>
                </div>

                {site.tagline && (
                  <p className="text-xs text-[#F0ECE2]/70 italic line-clamp-2 border-l-2 border-[#C9A33D]/60 pl-3 py-0.5">
                    "{site.tagline}"
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between gap-2">
              <Link
                href={`/${site.slug}`}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                <span>Lihat Website</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href={`/dashboard/${site.slug}`}
                className="inline-flex items-center justify-center p-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-semibold"
                title="Kelola Konten di CMS Kader"
              >
                <Edit className="w-4 h-4 text-[#C9A33D]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
