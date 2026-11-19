'use client';

import React from 'react';
import { Testimoni } from '@/types';
import { Quote } from 'lucide-react';

interface MemberTestimonialsProps {
  testimonials: Testimoni[];
  memberName: string;
}

export const MemberTestimonialsSection: React.FC<MemberTestimonialsProps> = ({ testimonials, memberName }) => {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 bg-[#1A1A1E] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
            Suara Warga
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
            Kesaksian & Harapan Masyarakat
          </h2>
          <div className="h-0.5 w-16 bg-[#C9A33D]"></div>
        </div>

        {/* Pull-Quote Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-[#17171A] p-8 rounded-2xl border-l-4 border-[#C9A33D] relative flex flex-col justify-between space-y-6 shadow-xl"
            >
              <Quote className="w-8 h-8 text-[#C9A33D]/30 absolute top-4 right-4" />

              <blockquote className="font-display text-base sm:text-lg italic text-[#F0ECE2]/90 leading-relaxed z-10">
                "{t.isi}"
              </blockquote>

              <div className="flex items-center gap-3.5 pt-4 border-t border-white/10">
                {t.foto_url && (
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-white/10 shrink-0 border border-[#C9A33D]/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.foto_url || '/images/testimonials/pak-rusli.webp'}
                      alt={t.nama}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-display font-bold text-sm text-white">{t.nama}</div>
                  <div className="text-[11px] text-[#C9A33D] font-mono">{t.peran_profesi}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
