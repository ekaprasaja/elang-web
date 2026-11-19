import React from 'react';
import Link from 'next/link';
import { Phone, Mail, Globe, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#121214] text-[#F0ECE2]/70 text-xs py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Identity */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 p-0.5 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-transparent.webp" alt="Logo Partai Elang" className="w-full h-full object-contain" />
            </div>
            <span className="font-display font-bold text-white text-base tracking-wide">
              PARTAI ELANG
            </span>
          </div>
          <p className="text-xs text-[#F0ECE2]/70 max-w-md leading-relaxed">
            Gerakan Politik Kebangsaan Untuk Indonesia. Hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[10px] bg-[#C9A33D]/20 text-[#C9A33D] border border-[#C9A33D]/30 px-2.5 py-0.5 rounded font-mono font-medium">
              Fokus: Kaderisasi
            </span>
            <span className="text-[10px] bg-white/5 text-[#F0ECE2]/70 border border-white/10 px-2.5 py-0.5 rounded font-mono">
              Jangkauan: Nasional
            </span>
            <span className="text-[10px] bg-white/5 text-[#F0ECE2]/70 border border-white/10 px-2.5 py-0.5 rounded font-mono">
              Karakter: Kolaboratif
            </span>
          </div>
        </div>

        {/* Col 2: Navigasi */}
        <div className="space-y-2">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#C9A33D]">
            Navigasi Platform
          </h4>
          <ul className="space-y-2 text-xs text-[#F0ECE2]/70">
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
              <a href="https://partaielang.id/about" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#C9A33D]" />
                Website Resmi Partai Elang
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Pusat Informasi */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-white uppercase text-[11px] tracking-wider text-[#C9A33D]">
            Kontak & Informasi Resmi
          </h4>
          <p className="text-[11px] text-[#F0ECE2]/70 flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#C9A33D] shrink-0" />
            <span>Contact Admin: <strong className="text-white font-mono">085 8175 99550</strong></span>
          </p>
          <p className="text-[11px] text-[#F0ECE2]/70 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#C9A33D] shrink-0" />
            <span>Email: <span className="text-white">kontak@partaielang.id</span></span>
          </p>
          <p className="text-[11px] text-[#F0ECE2]/70 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#C9A33D] shrink-0" />
            <span>Website: <a href="https://partaielang.id" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-[#C9A33D]">partaielang.id</a></span>
          </p>
          <p className="text-[10px] text-[#F0ECE2]/50 pt-1 leading-normal">
            Untuk informasi lebih lanjut mengenai Partai Elang, Anda dapat menghubungi kami melalui website official maupun media sosial resmi.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#F0ECE2]/40">
        <div>© 2026 Partai Elang. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#C9A33D]" /> Bersama, Kita Bisa!
          </span>
          <span>•</span>
          <span>Infrastruktur Cloud Terintegrasi</span>
        </div>
      </div>
    </footer>
  );
};
