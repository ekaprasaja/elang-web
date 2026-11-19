'use client';

import React from 'react';
import { GlobalPartySettings } from '@/types';
import { Shield, Anchor, CheckCircle } from 'lucide-react';

interface AboutPartySectionProps {
  party: GlobalPartySettings;
}

export const AboutPartySection: React.FC<AboutPartySectionProps> = ({ party }) => {
  return (
    <section className="py-16 bg-[#141417] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
            <Shield className="w-4 h-4 text-[#C9A33D]" />
            Garis Perjuangan Partai
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Tentang {party.party_name}
          </h2>
          <p className="text-xs sm:text-sm text-[#F0ECE2]/70 leading-relaxed">
            {party.tentang_partai}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Visi */}
          <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-display font-bold text-base text-[#C9A33D] flex items-center gap-2">
              <Anchor className="w-4 h-4" />
              Visi Kebangsaan & Kemaritiman
            </h3>
            <p className="text-xs text-[#F0ECE2]/80 leading-relaxed">
              {party.visi_partai}
            </p>
          </div>

          {/* Misi */}
          <div className="bg-[#1A1A1E] p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C9A33D]" />
              Misi Pokok Perjuangan
            </h3>
            <ul className="space-y-2">
              {party.misi_partai.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F0ECE2]/70">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C9A33D] shrink-0 mt-0.5" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
