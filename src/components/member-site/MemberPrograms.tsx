'use client';

import React from 'react';
import { ProgramKerja } from '@/types';
import { CheckCircle2, Clock, Zap, Target } from 'lucide-react';

interface MemberProgramsProps {
  programs: ProgramKerja[];
  memberName: string;
}

export const MemberProgramsSection: React.FC<MemberProgramsProps> = ({ programs, memberName }) => {
  return (
    <section id="program" className="py-16 bg-[#17171A] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              Agenda Nyata & Transparansi
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Program Kerja & Realisasi Lapangan
            </h2>
            <div className="h-0.5 w-16 bg-[#C9A33D]"></div>
          </div>
          <p className="text-xs sm:text-sm text-[#F0ECE2]/60 max-w-md">
            Komitmen konkret yang diperjuangkan {memberName} untuk masyarakat daerah pemilihan secara terukur dan berkelanjutan.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-xs text-[#F0ECE2]/50">
            Belum ada program kerja yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => {
              const isAchieved = prog.status === 'TERCAPAI' || prog.progress_persen === 100;
              return (
                <div
                  key={prog.id}
                  className="bg-[#1E1E24] rounded-2xl border border-white/10 p-6 flex flex-col justify-between space-y-4 hover:border-[#C9A33D]/50 transition-colors shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono uppercase bg-[#C9A33D]/10 text-[#C9A33D] px-2.5 py-1 rounded-md border border-[#C9A33D]/20">
                        {prog.kategori_isu}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isAchieved
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isAchieved ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {prog.status}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white leading-snug">
                      {prog.judul}
                    </h3>

                    {prog.deskripsi && (
                      <p className="text-xs text-[#F0ECE2]/70 leading-relaxed">
                        {prog.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {prog.target && (
                      <div className="flex items-center justify-between text-[11px] text-[#F0ECE2]/60">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3 text-[#C9A33D]" />
                          Target:
                        </span>
                        <span className="font-medium text-white">{prog.target}</span>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[10px] uppercase font-mono text-[#F0ECE2]/50">Realisasi</span>
                        <span className="text-xs font-bold text-[#C9A33D] font-mono">
                          {prog.progress_persen}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#C9A33D] to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(prog.progress_persen, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
