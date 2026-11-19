import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#121214] text-[#F0ECE2]/70 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Identity */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦅</span>
            <span className="font-display font-bold text-white text-base tracking-wide">
              PARTAI ELANG INDONESIA
            </span>
          </div>
          <p className="text-xs text-[#F0ECE2]/60 max-w-md leading-relaxed">
            Gerakan politik modern berdaulat maritim. Menghadirkan kepemimpinan berintegritas dan memperjuangkan keadilan sosial bagi seluruh masyarakat kepulauan dan pesisir nusantara.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-[10px] bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 px-2 py-0.5 rounded font-mono">
              Multi-Tenant CMS v1.0
            </span>
            <span className="text-[10px] text-[#F0ECE2]/40">
              Satu Platform, Ratusan Etalase Kader
            </span>
          </div>
        </div>

        {/* Col 2: Navigasi */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#C9A33D]">
            Navigasi Platform
          </h4>
          <ul className="space-y-1.5 text-xs text-[#F0ECE2]/70">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Direktori Anggota / Kader
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Dashboard Super Admin Pusat
              </Link>
            </li>
            <li>
              <a href="#aspirasi" className="hover:text-white transition-colors">
                Kirim Aspirasi Masyarakat
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Pusat Informasi */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#C9A33D]">
            Sekretariat DPP / DPD
          </h4>
          <p className="text-[11px] text-[#F0ECE2]/60">
            Jl. Hang Tuah No. 45, Batam Centre, Kota Batam, Kepulauan Riau
          </p>
          <p className="text-[11px] text-[#F0ECE2]/60">
            Email: <span className="text-white">sekretariat@partaielang.id</span>
          </p>
          <p className="text-[11px] text-[#F0ECE2]/60">
            Call Center: <span className="text-white">0811-7788-9900</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F0ECE2]/40">
        <div>© 2026 Dewan Pimpinan Pusat Partai Elang Indonesia. Hak Cipta Dilindungi.</div>
        <div className="flex items-center gap-4">
          <span>Kerahasiaan Data Terjamin</span>
          <span>•</span>
          <span>Infrastruktur Cloud Vercel & Supabase</span>
        </div>
      </div>
    </footer>
  );
};
