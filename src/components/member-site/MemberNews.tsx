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

        {/* Dynamic Responsive Layout Based on Article Count */}
        {news.length === 1 ? (
          /* Single Article: Full 12-col Expansive Horizontal Showcase */
          <div
            onClick={() => setSelectedNews(mainPost)}
            className="w-full bg-[#17171A] rounded-3xl border border-white/10 overflow-hidden group cursor-pointer hover:border-[#C9A33D]/60 transition-all shadow-2xl grid grid-cols-1 lg:grid-cols-12 items-stretch"
          >
            <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[380px] w-full overflow-hidden bg-black/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainPost.cover_image_url || '/images/articles/aspirasi-pesisir.webp'}
                alt={mainPost.judul}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <span className="absolute top-4 left-4 bg-[#8A2E22] text-white text-[11px] font-mono font-bold uppercase px-3.5 py-1.5 rounded-lg shadow-xl tracking-wider">
                {mainPost.kategori}
              </span>
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-gradient-to-br from-[#1E1E24] to-[#17171A]">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-[#F0ECE2]/50 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C9A33D]" />
                    {new Date(mainPost.tanggal_publish).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#C9A33D]" />
                    {mainPost.views_count} pembaca
                  </span>
                </div>

                <h3 className="font-display font-black text-xl sm:text-2xl text-white group-hover:text-[#C9A33D] transition-colors leading-snug">
                  {mainPost.judul}
                </h3>

                <p className="text-xs sm:text-sm text-[#F0ECE2]/70 line-clamp-4 leading-relaxed">
                  {mainPost.ringkasan || mainPost.isi.slice(0, 220) + '...'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-[#C9A33D] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
                  Baca Rilis Lengkap <ArrowRight className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono text-[#F0ECE2]/40 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  Publikasi Terverifikasi
                </span>
              </div>
            </div>
          </div>
        ) : news.length === 2 ? (
          /* Two Articles: Balanced 2-Column Grid (6 cols + 6 cols) */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedNews(item)}
                className="bg-[#17171A] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-[#C9A33D]/60 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-black/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image_url || '/images/articles/aspirasi-pesisir.webp'}
                      alt={item.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-[#8A2E22] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded shadow">
                      {item.kategori}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-[#F0ECE2]/50 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A33D]" />
                        {new Date(item.tanggal_publish).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-[#C9A33D]" />
                        {item.views_count} pembaca
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg sm:text-xl text-white group-hover:text-[#C9A33D] transition-colors leading-snug">
                      {item.judul}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#F0ECE2]/70 line-clamp-3 leading-relaxed">
                      {item.ringkasan || item.isi.slice(0, 160) + '...'}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#C9A33D] group-hover:underline">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Three or More Articles: Asymmetrical 7 / 5 Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main Large Article */}
            <div
              onClick={() => setSelectedNews(mainPost)}
              className="lg:col-span-7 bg-[#17171A] rounded-2xl border border-white/10 overflow-hidden group cursor-pointer hover:border-[#C9A33D]/60 transition-all shadow-xl"
            >
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mainPost.cover_image_url || '/images/articles/aspirasi-pesisir.webp'}
                  alt={mainPost.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-[#8A2E22] text-white text-[10px] font-mono font-bold uppercase px-3 py-1 rounded shadow">
                  {mainPost.kategori}
                </span>
              </div>
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
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image_url || '/images/articles/aspirasi-pesisir.webp'}
                      alt={post.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
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
        )}
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

            <div className="rounded-xl overflow-hidden h-64 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedNews.cover_image_url || '/images/articles/aspirasi-pesisir.webp'}
                alt={selectedNews.judul}
                className="w-full h-full object-cover"
              />
            </div>

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
