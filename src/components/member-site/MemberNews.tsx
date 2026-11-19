'use client';

import React, { useState } from 'react';
import { NewsPost } from '@/types';
import { Calendar, Eye, ArrowRight, X, Newspaper } from 'lucide-react';

interface MemberNewsProps {
  news: NewsPost[];
  memberName: string;
}

export const MemberNewsSection: React.FC<MemberNewsProps> = ({ news, memberName }) => {
  const [selectedNews, setSelectedNews] = useState<NewsPost | null>(null);

  if (news.length === 0) return null;

  const mainPost = news[0];
  const sidePosts = news.slice(1, 4);

  return (
    <section id="berita" className="py-16 bg-[#1A1A1E] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              Kabar & Warta Terkini
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Berita, Kegiatan, & Pernyataan Resmi
            </h2>
            <div className="h-0.5 w-16 bg-[#C9A33D]"></div>
          </div>
          <span className="text-xs text-[#F0ECE2]/60">
            Publikasi resmi transparansi kerja lapangan {memberName}
          </span>
        </div>

        {/* Asymmetrical Grid: 1 Big Main Article (7 cols) + Side Articles (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Large Article */}
          <div
            onClick={() => setSelectedNews(mainPost)}
            className="lg:col-span-7 bg-[#17171A] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-[#C9A33D]/60 transition-all shadow-xl"
          >
            {mainPost.cover_image_url && (
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPost.cover_image_url}
                  alt={mainPost.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#8A2E22] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded shadow">
                  {mainPost.kategori}
                </span>
              </div>
            )}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-4 text-[11px] text-[#F0ECE2]/50 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A33D]" />
                  {new Date(mainPost.tanggal_publish).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-[#C9A33D]" />
                  {mainPost.views_count} pembaca
                </span>
              </div>

              <h3 className="font-display font-black text-xl sm:text-2xl text-white group-hover:text-[#C9A33D] transition-colors leading-snug">
                {mainPost.judul}
              </h3>

              <p className="text-xs sm:text-sm text-[#F0ECE2]/70 line-clamp-3 leading-relaxed">
                {mainPost.ringkasan || mainPost.isi.slice(0, 180) + '...'}
              </p>

              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[#C9A33D] group-hover:underline">
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Side Articles Stack */}
          <div className="lg:col-span-5 space-y-4">
            {sidePosts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedNews(post)}
                className="bg-[#17171A] p-4 rounded-xl border border-white/10 hover:border-[#C9A33D]/50 transition-colors cursor-pointer flex gap-4 group"
              >
                {post.cover_image_url && (
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image_url}
                      alt={post.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-mono text-[#C9A33D] uppercase">
                    {post.kategori}
                  </span>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-white group-hover:text-[#C9A33D] transition-colors line-clamp-2 leading-snug">
                    {post.judul}
                  </h4>
                  <div className="text-[10px] text-[#F0ECE2]/40 font-mono">
                    {new Date(post.tanggal_publish).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Article Detail Reader Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1E1E24] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedNews.cover_image_url && (
              <div className="rounded-xl overflow-hidden h-64 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedNews.cover_image_url}
                  alt={selectedNews.judul}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase bg-[#C9A33D]/20 text-[#C9A33D] px-2 py-0.5 rounded">
                {selectedNews.kategori}
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-white">
                {selectedNews.judul}
              </h2>
              <div className="text-xs text-[#F0ECE2]/50 font-mono">
                {new Date(selectedNews.tanggal_publish).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[#F0ECE2]/80 leading-relaxed whitespace-pre-line border-t border-white/10 pt-4">
              {selectedNews.isi}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedNews(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg"
              >
                Tutup Bacaan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
