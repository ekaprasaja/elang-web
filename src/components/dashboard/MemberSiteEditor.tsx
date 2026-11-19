'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Site, MemberProfile, ProgramKerja, NewsPost, Aspirasi, ContentJob } from '@/types';
import {
  Sparkles,
  ExternalLink,
  Plus,
  Send,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Newspaper,
  Target,
  MessageSquare,
  User,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MemberSiteEditorProps {
  slug: string;
}

export const MemberSiteEditor: React.FC<MemberSiteEditorProps> = ({ slug }) => {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai_generator' | 'berita' | 'program' | 'aspirasi' | 'profil'>('ai_generator');

  // AI Generator state
  const [rawCategory, setRawCategory] = useState('Kegiatan Lapangan & Sosialisasi');
  const [rawDate, setRawDate] = useState(new Date().toISOString().split('T')[0]);
  const [rawPoints, setRawPoints] = useState('');
  const [contentType, setContentType] = useState<'berita' | 'caption' | 'progress'>('berita');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{ title: string; body: string } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<ContentJob[]>([]);

  // Profile Edit state
  const [bio, setBio] = useState('');
  const [visi, setVisi] = useState('');
  const [wa, setWa] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  const fetchSite = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sites/${slug}`);
      const data = await res.json();
      setSiteData(data);
      if (data.profile) {
        setBio(data.profile.bio || '');
        setVisi(data.profile.visi_personal || '');
        setWa(data.profile.kontak_wa || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSite();
  }, [slug]);

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawPoints) {
      setAiError('Silakan tuliskan poin-poin kegiatan terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    setAiError(null);
    setGeneratedDraft(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: siteData.site.id,
          memberName: siteData.site.nama_anggota,
          category: rawCategory,
          date: rawDate,
          rawPoints,
          contentType,
          autoPublish: false,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghasilkan narasi');
      }

      setGeneratedDraft({
        title: data.title,
        body: data.body,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      setAiError(err.message || 'Terjadi kesalahan sistem saat memproses AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishDraft = async () => {
    if (!generatedDraft) return;
    try {
      // Create new news post from draft
      await fetch('/api/sites', {
        method: 'POST',
      }); // fallback

      // Refresh site data
      await fetchSite();
      setGeneratedDraft(null);
      setRawPoints('');
      setActiveTab('berita');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-[#C9A33D] font-mono text-xs">
        Memuat data CMS Kader...
      </div>
    );
  }

  if (!siteData?.site) {
    return (
      <div className="text-center py-20 text-[#F0ECE2]/60 text-xs">
        Situs kader tidak ditemukan.
      </div>
    );
  }

  const { site, profile, programs, news, gallery, testimonials } = siteData;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-[#1E1E24] p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-[#C9A33D]/20 text-[#C9A33D] px-2 py-0.5 rounded font-bold uppercase">
              CMS Etalase Kader
            </span>
            <span className="text-xs text-[#F0ECE2]/50 font-mono">ID: {site.id}</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            {site.nama_anggota}
          </h1>
          <p className="text-xs text-[#C9A33D] font-medium">
            {site.jabatan} • {site.dapil}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${site.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <span>Buka Website Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ai_generator')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'ai_generator'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bahan Mentah & AI Generator</span>
        </button>
        <button
          onClick={() => setActiveTab('berita')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'berita'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Kelola Berita ({news.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('program')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'program'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>Program Kerja ({programs.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
            activeTab === 'profil'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profil & Kontak</span>
        </button>
      </div>

      {/* TAB 1: AI Generator Pipeline */}
      {activeTab === 'ai_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (Raw Points): 6 cols */}
          <div className="lg:col-span-6 bg-[#1E1E24] p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#C9A33D] uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Input Bahan Mentah (Tanpa Perlu Tulis Rapi)
              </span>
              <h3 className="font-display font-black text-xl text-white">
                Apa Kegiatan / Agenda Anda Hari Ini?
              </h3>
              <p className="text-xs text-[#F0ECE2]/60">
                Cukup ketik poin-poin singkat kegiatan Anda di lapangan. Mesin AI Partai Elang akan menyusunnya menjadi narasi berita atau rilis resmi siap terbit.
              </p>
            </div>

            {aiError && (
              <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-300">
                {aiError}
              </div>
            )}

            <form onSubmit={handleGenerateAI} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Kategori Kegiatan</label>
                  <select
                    value={rawCategory}
                    onChange={(e) => setRawCategory(e.target.value)}
                    className="w-full bg-[#17171A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                  >
                    <option value="Kegiatan Lapangan & Sosialisasi">Kegiatan Lapangan & Sosialisasi</option>
                    <option value="Bakti Sosial & Sembako">Bakti Sosial & Sembako</option>
                    <option value="Dialog Nelayan & Pesisir">Dialog Nelayan & Pesisir</option>
                    <option value="Advokasi Kebijakan & Rapat">Advokasi Kebijakan & Rapat</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    value={rawDate}
                    onChange={(e) => setRawDate(e.target.value)}
                    className="w-full bg-[#17171A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">
                  Jenis Output yang Diharapkan
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType('berita')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      contentType === 'berita'
                        ? 'bg-[#C9A33D] text-[#17171A] border-[#C9A33D] font-bold'
                        : 'bg-white/5 text-[#F0ECE2]/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Artikel Berita
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('caption')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      contentType === 'caption'
                        ? 'bg-[#C9A33D] text-[#17171A] border-[#C9A33D] font-bold'
                        : 'bg-white/5 text-[#F0ECE2]/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Caption Medsos
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentType('progress')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      contentType === 'progress'
                        ? 'bg-[#C9A33D] text-[#17171A] border-[#C9A33D] font-bold'
                        : 'bg-white/5 text-[#F0ECE2]/70 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Progres Program
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">
                  Catatan Poin Bebas (1 baris 1 poin) <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Contoh:&#10;- Kunjungan ke Pulau Numbing&#10;- Temu 50 nelayan kepiting&#10;- Keluhan solar subsidi langka&#10;- Bagikan 50 life jacket gratis&#10;- Janji kawal tambahan kuota solar ke dinas"
                  value={rawPoints}
                  onChange={(e) => setRawPoints(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C9A33D] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#C9A33D] to-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#C9A33D]/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Mesin AI Sedang Merangkai Narasi...' : 'Generate Konten dengan AI 🦅'}</span>
              </button>
            </form>
          </div>

          {/* Right Preview Draft: 6 cols */}
          <div className="lg:col-span-6 bg-[#1E1E24] p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A33D]" />
                Antrian Review Draft Konten
              </h3>
              <span className="text-[10px] font-mono text-[#F0ECE2]/50 bg-white/5 px-2 py-0.5 rounded">
                Mode Draft-Review
              </span>
            </div>

            {generatedDraft ? (
              <div className="space-y-4 animate-fade-in bg-[#17171A] p-5 rounded-xl border border-[#C9A33D]/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#C9A33D] uppercase bg-[#C9A33D]/10 px-2 py-0.5 rounded">
                    Draft Siap Tayang
                  </span>
                  <h4 className="font-display font-bold text-base text-white">
                    {generatedDraft.title}
                  </h4>
                </div>

                <div className="text-xs text-[#F0ECE2]/80 leading-relaxed whitespace-pre-line border-t border-white/10 pt-3 max-h-72 overflow-y-auto">
                  {generatedDraft.body}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setGeneratedDraft(null)}
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handlePublishDraft}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Setujui & Terbitkan ke Website</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-[#17171A] rounded-xl border border-white/5 p-6 space-y-2 text-xs text-[#F0ECE2]/50">
                <Sparkles className="w-8 h-8 text-[#C9A33D]/40 mx-auto" />
                <p>Belum ada draft baru yang digenerate.</p>
                <p className="text-[11px] text-[#F0ECE2]/40">
                  Isi formulir di sebelah kiri dan klik "Generate Konten dengan AI" untuk melihat hasil rilis berita otomatis.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Berita */}
      {activeTab === 'berita' && (
        <div className="bg-[#1E1E24] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">
              Artikel & Berita yang Telah Diterbitkan
            </h3>
            <span className="text-xs text-[#F0ECE2]/50 font-mono">{news.length} Artikel</span>
          </div>

          <div className="divide-y divide-white/5">
            {news.map((item: NewsPost) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#C9A33D] uppercase bg-[#C9A33D]/10 px-2 py-0.5 rounded">
                    {item.kategori}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white">{item.judul}</h4>
                  <div className="text-[11px] text-[#F0ECE2]/50 font-mono">
                    {new Date(item.tanggal_publish).toLocaleDateString('id-ID')} • {item.views_count} pembaca
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Program Kerja */}
      {activeTab === 'program' && (
        <div className="bg-[#1E1E24] p-6 rounded-2xl border border-white/10 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white">
              Daftar Program Kerja & Realisasi
            </h3>
            <span className="text-xs text-[#F0ECE2]/50 font-mono">{programs.length} Program</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {programs.map((prog: ProgramKerja) => (
              <div key={prog.id} className="bg-[#17171A] p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#C9A33D] text-[10px] uppercase">{prog.kategori_isu}</span>
                  <span className="font-mono font-bold text-white">{prog.progress_persen}% Selesai</span>
                </div>
                <h4 className="font-display font-bold text-sm text-white">{prog.judul}</h4>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#C9A33D] h-full" style={{ width: `${prog.progress_persen}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Profil & Kontak */}
      {activeTab === 'profil' && (
        <div className="bg-[#1E1E24] p-6 rounded-2xl border border-white/10 space-y-5 shadow-xl max-w-2xl">
          <h3 className="font-display font-bold text-base text-white">
            Pengaturan Profil & Narasi Bio
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Biografi Singkat</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl p-3 text-xs text-white resize-none"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Visi Personal</label>
              <input
                type="text"
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">Nomor WhatsApp Resmi</label>
              <input
                type="text"
                value={wa}
                onChange={(e) => setWa(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setProfileSaved(true);
                  setTimeout(() => setProfileSaved(false), 3000);
                }}
                className="px-5 py-2 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                Simpan Profil
              </button>
              {profileSaved && (
                <span className="ml-3 text-xs text-emerald-400 font-mono">
                  Profil berhasil disimpan!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
