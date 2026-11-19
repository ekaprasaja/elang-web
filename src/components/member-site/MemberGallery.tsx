'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/types';
import { Image as ImageIcon, X, Calendar } from 'lucide-react';

interface MemberGalleryProps {
  gallery: GalleryItem[];
}

export const MemberGallerySection: React.FC<MemberGalleryProps> = ({ gallery }) => {
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  if (gallery.length === 0) return null;

  const categories = ['Semua', ...Array.from(new Set(gallery.map((g) => g.kategori_acara)))];

  const filteredItems = activeCategory === 'Semua'
    ? gallery
    : gallery.filter((g) => g.kategori_acara === activeCategory);

  return (
    <section id="galeri" className="py-16 bg-[#17171A] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D]">
              Dokumentasi Visual
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Galeri Foto & Rekam Kegiatan Lapangan
            </h2>
            <div className="h-0.5 w-16 bg-[#C9A33D]"></div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#C9A33D] text-[#17171A] shadow-md font-bold'
                    : 'bg-white/5 text-[#F0ECE2]/70 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group bg-[#1E1E24] rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-[#C9A33D]/60 transition-all shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.media_url}
                  alt={item.judul}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#17171A]/80 backdrop-blur-md text-[10px] text-[#C9A33D] font-mono font-semibold px-2 py-0.5 rounded">
                  {item.kategori_acara}
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <div className="text-[10px] text-[#F0ECE2]/50 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#C9A33D]" />
                  {item.tanggal}
                </div>
                <h4 className="font-display font-bold text-sm text-white group-hover:text-[#C9A33D] transition-colors line-clamp-1">
                  {item.judul}
                </h4>
                {item.caption && (
                  <p className="text-xs text-[#F0ECE2]/60 line-clamp-2">
                    {item.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="max-w-4xl w-full bg-[#1E1E24] rounded-2xl border border-white/20 overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-black/50 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedItem.media_url}
                alt={selectedItem.judul}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-6 space-y-2 bg-[#17171A]">
              <span className="text-[10px] font-mono text-[#C9A33D] uppercase bg-[#C9A33D]/10 px-2 py-0.5 rounded">
                {selectedItem.kategori_acara} • {selectedItem.tanggal}
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                {selectedItem.judul}
              </h3>
              {selectedItem.caption && (
                <p className="text-xs text-[#F0ECE2]/80 leading-relaxed">
                  {selectedItem.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
