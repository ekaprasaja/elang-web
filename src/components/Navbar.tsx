'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCMS } from '@/context/CMSContext';
import {
  Users,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { sites, notification } = useCMS();
  const [showSitesMenu, setShowSitesMenu] = useState(false);

  const isPortal = pathname === '/';
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/dashboard');

  return (
    <header className="sticky top-0 z-50 bg-[#17171A]/95 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 p-0.5 flex items-center justify-center shadow-lg shadow-[#C9A33D]/20 group-hover:scale-105 transition-transform shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-transparent.webp" alt="Logo Resmi Partai Elang" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base tracking-wide text-white group-hover:text-[#C9A33D] transition-colors">
                  PARTAI ELANG
                </span>
                <span className="text-[10px] bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                  MEMBER CMS
                </span>
              </div>
              <p className="text-[11px] text-[#F0ECE2]/60">Platform Website Personal Anggota & Kader</p>
            </div>
          </Link>
        </div>

        {/* Center / Navigation Links for Public View */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-medium">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isPortal
                ? 'bg-white/10 text-white font-semibold'
                : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
            }`}
          >
            Direktori Kader
          </Link>

          {/* Member Sites Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSitesMenu(!showSitesMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#F0ECE2]/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#C9A33D]" />
              <span>Pilih Website Member</span>
              <ChevronDown className="w-3 h-3 text-[#F0ECE2]/40" />
            </button>

            {showSitesMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-[#1E1E24] border border-white/10 rounded-xl shadow-2xl p-2 z-50 animate-fade-in">
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#C9A33D] px-2 py-1">
                  Situs Anggota Aktif ({sites.length})
                </div>
                {sites.map((s) => (
                  <Link
                    key={s.id}
                    href={`/${s.slug}`}
                    onClick={() => setShowSitesMenu(false)}
                    className="flex flex-col p-2 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white group-hover:text-[#C9A33D]">
                        {s.nama_anggota}
                      </span>
                      <span className="text-[9px] bg-white/10 text-[#F0ECE2]/60 px-1 rounded">
                        No. {s.nomor_urut}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#F0ECE2]/50 truncate">{s.jabatan}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right: Public Link to Member Portal or Clean View */}
        <div className="flex items-center gap-2">
          {isAdmin ? (
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#F0ECE2]/80 border border-white/10 rounded-lg text-xs font-medium transition-all"
            >
              <span>Lihat Web Publik</span>
            </Link>
          ) : (
            <a
              href="https://member.incodegen.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A33D]/10 hover:bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 rounded-lg text-xs font-semibold transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Portal Kader</span>
              <ExternalLink className="w-3 h-3 text-[#C9A33D]/70" />
            </a>
          )}
        </div>
      </div>

      {notification && (
        <div className="bg-[#C9A33D] text-[#17171A] text-xs font-bold py-1 px-4 text-center mt-2 rounded-lg max-w-xl mx-auto shadow-lg animate-fade-in">
          {notification}
        </div>
      )}
    </header>
  );
};
