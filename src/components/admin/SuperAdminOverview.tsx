'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Site, Aspirasi, GlobalPartySettings, AIWritingSettings, SentimentIssue } from '@/types';
import { SiteWizardModal } from './SiteWizardModal';
import {
  Globe,
  Eye,
  MessageSquare,
  Clock,
  Plus,
  ExternalLink,
  Edit,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileText,
  Flame,
  TrendingUp,
  RefreshCw,
  Copy,
  Radio,
} from 'lucide-react';

export const SuperAdminOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [aspirations, setAspirations] = useState<Aspirasi[]>([]);
  const [sentimentIssues, setSentimentIssues] = useState<SentimentIssue[]>([]);
  const [activeTab, setActiveTab] = useState<'sites' | 'sentimen' | 'aspirasi' | 'ai_settings' | 'party_info'>('sites');
  const [copiedIssueId, setCopiedIssueId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  // AI settings state
  const [aiTone, setAiTone] = useState('');
  const [aiPOV, setAiPOV] = useState<'orang_pertama' | 'orang_ketiga'>('orang_pertama');
  const [aiLength, setAiLength] = useState<'singkat' | 'menengah' | 'mendalam'>('menengah');
  const [aiForbidden, setAiForbidden] = useState('');
  const [aiEmphasis, setAiEmphasis] = useState('');
  const [aiSavedNotice, setAiSavedNotice] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, sitesRes, aspRes, aiRes, issuesRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/sites'),
        fetch('/api/aspirasi'),
        fetch('/api/ai/settings'),
        fetch('/api/sentiment/issues'),
      ]);

      const [statsData, sitesData, aspData, aiData, issuesData] = await Promise.all([
        statsRes.json(),
        sitesRes.json(),
        aspRes.json(),
        aiRes.json(),
        issuesRes.json(),
      ]);

      setStats(statsData.stats);
      setSites(sitesData.sites || []);
      setAspirations(aspData.aspirasi || []);
      setSentimentIssues(issuesData.issues || []);

      if (aiData.settings) {
        setAiTone(aiData.settings.tone || '');
        setAiPOV(aiData.settings.sudut_pandang || 'orang_pertama');
        setAiLength(aiData.settings.panjang || 'menengah');
        setAiForbidden(aiData.settings.larangan_kata?.join(', ') || '');
        setAiEmphasis(aiData.settings.penekanan_isu?.join(', ') || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveAISettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/ai/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tone: aiTone,
          sudut_pandang: aiPOV,
          panjang: aiLength,
          larangan_kata: aiForbidden.split(',').map((s) => s.trim()).filter(Boolean),
          penekanan_isu: aiEmphasis.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      setAiSavedNotice(true);
      setTimeout(() => setAiSavedNotice(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateAspirasiStatus = async (id: string, status: 'pending' | 'diproses' | 'selesai') => {
    try {
      await fetch('/api/aspirasi', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E1E24] p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A33D] uppercase">
            <Shield className="w-4 h-4 text-[#C9A33D]" />
            Pusat Komando Digital
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white">
            Dashboard Super Admin Partai Elang
          </h1>
          <p className="text-xs text-[#F0ECE2]/60">
            Kelola seluruh website personal kader, atur panduan redaksi AI terpusat, dan pantau aspirasi masyarakat lintas wilayah.
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#C9A33D]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Situs Member</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E1E24] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F0ECE2]/60">
            <span>Total Website Member</span>
            <Globe className="w-4 h-4 text-[#C9A33D]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-white">
            {stats?.totalSites || sites.length}
          </div>
          <div className="text-[10px] text-emerald-400 font-mono">100% Aktif & Terverifikasi</div>
        </div>

        <div className="bg-[#1E1E24] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F0ECE2]/60">
            <span>Total Kunjungan / Views</span>
            <Eye className="w-4 h-4 text-[#C9A33D]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-white">
            {stats?.totalViews?.toLocaleString() || 1025}
          </div>
          <div className="text-[10px] text-[#C9A33D] font-mono">Akumulasi Seluruh Situs</div>
        </div>

        <div className="bg-[#1E1E24] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F0ECE2]/60">
            <span>Aspirasi Masuk</span>
            <MessageSquare className="w-4 h-4 text-[#C9A33D]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-white">
            {stats?.totalAspirasi || aspirations.length}
          </div>
          <div className="text-[10px] text-[#F0ECE2]/60 font-mono">Dari Seluruh Daerah</div>
        </div>

        <div className="bg-[#1E1E24] p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#F0ECE2]/60">
            <span>Menunggu Tindak Lanjut</span>
            <Clock className="w-4 h-4 text-[#8A2E22]" />
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-amber-400">
            {stats?.pendingAspirasi || aspirations.filter((a) => a.status_tindak_lanjut === 'pending').length}
          </div>
          <div className="text-[10px] text-amber-400/80 font-mono">Perlu Respon Tim Lapangan</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('sites')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'sites'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Daftar Situs Kader ({sites.length})
        </button>
        <button
          onClick={() => setActiveTab('sentimen')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'sentimen'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Radar Isu Elang Sentimen ({sentimentIssues.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('aspirasi')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'aspirasi'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Inbox Aspirasi Terpusat ({aspirations.length})
        </button>
        <button
          onClick={() => setActiveTab('ai_settings')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'ai_settings'
              ? 'bg-[#C9A33D] text-[#17171A] font-bold shadow'
              : 'text-[#F0ECE2]/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Panduan Redaksi AI</span>
        </button>
      </div>

      {/* Tab 1: Daftar Situs Member */}
      {activeTab === 'sites' && (
        <div className="bg-[#1E1E24] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white">
              Situs Anggota Aktif di Platform
            </h3>
            <span className="text-xs text-[#F0ECE2]/50 font-mono">Multi-Tenant Routing: Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#17171A] text-[#F0ECE2]/50 uppercase font-mono border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Nama Anggota & Jabatan</th>
                  <th className="py-3 px-4">Dapil</th>
                  <th className="py-3 px-4">Subdomain / Slug</th>
                  <th className="py-3 px-4 text-center">No. Urut</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sites.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">{s.nama_anggota}</div>
                      <div className="text-[11px] text-[#C9A33D]">{s.jabatan}</div>
                    </td>
                    <td className="py-3.5 px-4 text-[#F0ECE2]/80">{s.dapil}</td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400">
                      /{s.slug}
                      {s.custom_domain && (
                        <div className="text-[10px] text-[#F0ECE2]/40">{s.custom_domain}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      #{s.nomor_urut}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/${s.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Lihat Web</span>
                      </Link>
                      <Link
                        href={`/dashboard/${s.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#C9A33D]/20 hover:bg-[#C9A33D]/30 text-[#C9A33D] border border-[#C9A33D]/40 rounded-lg text-[11px] font-bold"
                      >
                        <Edit className="w-3 h-3" />
                        <span>CMS Kader</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Radar Elang Sentimen */}
      {activeTab === 'sentimen' && (
        <div className="space-y-6">
          <div className="bg-[#1E1E24] p-6 rounded-3xl border border-[#C9A33D]/30 shadow-xl space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-mono font-semibold uppercase">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Sikronisasi Real-Time Elang Sentimen
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-white">
                  Radar Isu Publik & Panduan Narasi Kebijakan
                </h3>
                <p className="text-xs text-[#F0ECE2]/70 max-w-2xl leading-relaxed">
                  Gunakan isu-isu hasil penelusuran <strong>Elang Sentimen</strong> berikut ini sebagai arahan resmi bagi admin dan kader dalam menyusun artikel berita, opini, dan rilis pers, sehingga respons partai senantiasa sinkron dengan denyut aspirasi masyarakat.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchData}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition self-start sm:self-auto font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan Radar</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-[#17171A] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-[#F0ECE2]/50 font-mono uppercase">Total Isu Aktif</span>
                <p className="font-display font-black text-xl text-white">{sentimentIssues.length}</p>
              </div>
              <div className="bg-[#17171A] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-rose-400/80 font-mono uppercase">Sentimen Kritis/Negatif</span>
                <p className="font-display font-black text-xl text-rose-400">
                  {sentimentIssues.filter((i) => i.dominant_sentiment === 'negatif').length} Isu
                </p>
              </div>
              <div className="bg-[#17171A] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-emerald-400/80 font-mono uppercase">Sentimen Positif</span>
                <p className="font-display font-black text-xl text-emerald-400">
                  {sentimentIssues.filter((i) => i.dominant_sentiment === 'positif').length} Isu
                </p>
              </div>
              <div className="bg-[#17171A] p-3.5 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-[#C9A33D] font-mono uppercase">Status Integrasi</span>
                <p className="font-display font-bold text-xs text-emerald-400 flex items-center gap-1 pt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Terhubung Langsung
                </p>
              </div>
            </div>
          </div>

          {/* List of Sentiment Issues */}
          <div className="grid grid-cols-1 gap-4">
            {sentimentIssues.map((issue) => {
              const isNegative = issue.dominant_sentiment === 'negatif';
              const isPositive = issue.dominant_sentiment === 'positif';
              const isCopied = copiedIssueId === issue.id;

              return (
                <div
                  key={issue.id}
                  className="bg-[#1E1E24] p-5 sm:p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border font-semibold ${
                          isNegative
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : isPositive
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isNegative
                          ? 'Sentimen Kritis / Perlu Respon Cepat'
                          : isPositive
                          ? 'Sentimen Positif / Peluang Penguatan'
                          : 'Sentimen Beragam / Dinamis'}
                      </span>
                      <span className="text-[#C9A33D] bg-[#C9A33D]/10 px-2 py-0.5 rounded-full border border-[#C9A33D]/20 font-bold">
                        🔥 {issue.burst_ratio}x Lonjakan Tren
                      </span>
                      <span className="text-[#F0ECE2]/50 bg-white/5 px-2 py-0.5 rounded-full">
                        {issue.mention_count} percakapan publik
                      </span>
                      <span className="text-[#F0ECE2]/40">Wilayah: {issue.region}</span>
                    </div>

                    <span className="text-[10px] text-[#F0ECE2]/40 font-mono">
                      Tanggal: {issue.date}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-display font-black text-lg sm:text-xl text-white">
                      {issue.topic}
                    </h4>
                    <p className="text-xs text-[#F0ECE2]/80 leading-relaxed bg-[#17171A] p-3.5 rounded-xl border border-white/5">
                      <strong>Sorotan Polemik:</strong> {issue.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Recommended Angle */}
                    <div className="bg-[#17171A] p-4 rounded-xl border border-[#C9A33D]/20 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A33D] font-bold flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5" />
                        Rekomendasi Sudut Pandang Partai Elang
                      </span>
                      <p className="text-xs text-[#F0ECE2]/90 leading-relaxed">
                        {issue.recommended_angle}
                      </p>
                    </div>

                    {/* Suggested Points */}
                    <div className="bg-[#17171A] p-4 rounded-xl border border-white/10 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Poin Sikap Resmi (Siap Diadopsi Kader)
                      </span>
                      <ul className="space-y-1.5 text-[11px] text-[#F0ECE2]/80 list-disc list-inside">
                        {issue.suggested_points.map((pt, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px] text-[#F0ECE2]/50">
                      <span>Sampel Media:</span>
                      <span className="text-white italic truncate max-w-md">
                        {issue.sample_headlines[0] || 'Liputan Media Nasional'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `SIKAP RESMI PARTAI ELANG TERKAIT ${issue.topic.toUpperCase()}\n\n` +
                              issue.suggested_points.map((p, i) => `${i + 1}. ${p}`).join('\n')
                          );
                          setCopiedIssueId(issue.id);
                          setTimeout(() => setCopiedIssueId(null), 3000);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs border border-white/10 transition font-medium"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#C9A33D]" />
                        <span>{isCopied ? '✓ Poin Tersalin!' : 'Salin Poin Sikap'}</span>
                      </button>

                      {sites.length > 0 && (
                        <Link
                          href={`/dashboard/${sites[0].slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] text-xs font-bold transition shadow-md shadow-[#C9A33D]/20"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Tulis di CMS Kader ({sites[0].nama_anggota})</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Inbox Aspirasi Terpusat */}
      {activeTab === 'aspirasi' && (
        <div className="bg-[#1E1E24] rounded-2xl border border-white/10 overflow-hidden shadow-xl space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white">
              Rekapitulasi Seluruh Aspirasi Warga Lintas Wilayah
            </h3>
            <span className="text-xs text-[#F0ECE2]/50 font-mono">Realtime Storage</span>
          </div>

          <div className="space-y-3">
            {aspirations.map((asp) => (
              <div
                key={asp.id}
                className="bg-[#17171A] p-4 rounded-xl border border-white/10 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{asp.nama_pengirim}</span>
                    <span className="text-xs text-[#C9A33D] font-mono">({asp.no_hp})</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#F0ECE2]/70">
                      {asp.kategori_isu}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={asp.status_tindak_lanjut}
                      onChange={(e) => handleUpdateAspirasiStatus(asp.id, e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white"
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="diproses">🔄 Sedang Diproses</option>
                      <option value="selesai">✅ Selesai Ditindaklanjuti</option>
                    </select>
                  </div>
                </div>

                <p className="text-xs text-[#F0ECE2]/80 italic bg-white/5 p-3 rounded-lg border-l-2 border-[#C9A33D]">
                  "{asp.isi_aspirasi}"
                </p>

                <div className="text-[10px] text-[#F0ECE2]/40 font-mono flex items-center justify-between">
                  <span>Diterima pada: {new Date(asp.created_at).toLocaleString('id-ID')}</span>
                  <span>ID: {asp.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Panduan Redaksi AI */}
      {activeTab === 'ai_settings' && (
        <div className="bg-[#1E1E24] rounded-2xl border border-white/10 p-6 space-y-6 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A33D]" />
              Pengaturan Redaksi & Guardrail AI Partai Elang
            </h3>
            <p className="text-xs text-[#F0ECE2]/60">
              Admin pusat memegang kendali penuh atas gaya bahasa, sudut pandang, larangan kata sensitif, dan penekanan isu yang digunakan mesin AI saat menghasilkan konten dari catatan kader.
            </p>
          </div>

          {aiSavedNotice && (
            <div className="p-3 bg-emerald-950 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Pengaturan redaksi AI berhasil diperbarui dan berlaku secara global!</span>
            </div>
          )}

          <form onSubmit={handleSaveAISettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Tone & Karakter Bahasa</label>
                <input
                  type="text"
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  placeholder="Otoritatif, Hangat, Merakyat..."
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Sudut Pandang (POV)</label>
                <select
                  value={aiPOV}
                  onChange={(e) => setAiPOV(e.target.value as any)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                >
                  <option value="orang_pertama">Orang Pertama ("Saya mengunjungi...")</option>
                  <option value="orang_ketiga">Orang Ketiga ("[Nama Kader] mengunjungi...")</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-white">Panjang Narasi</label>
                <select
                  value={aiLength}
                  onChange={(e) => setAiLength(e.target.value as any)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                >
                  <option value="singkat">Singkat & To-The-Point (2 paragraf)</option>
                  <option value="menengah">Menengah / Standar Warta (3-4 paragraf)</option>
                  <option value="mendalam">Mendalam / Laporan Kebijakan (5+ paragraf)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">
                Penekanan Isu Strategis (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={aiEmphasis}
                onChange={(e) => setAiEmphasis(e.target.value)}
                placeholder="Pemberdayaan Nelayan, UMKM Pesisir, Beasiswa Pulau, Transparansi Pokir"
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white flex items-center gap-1.5 text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />
                Larangan Kata & Isu Terlarang (Guardrails Ketat)
              </label>
              <textarea
                rows={2}
                value={aiForbidden}
                onChange={(e) => setAiForbidden(e.target.value)}
                placeholder="fitnah, ujaran kebencian, klaim data fiktif, janji tanpa dasar"
                className="w-full bg-[#17171A] border border-red-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 resize-none"
              ></textarea>
              <p className="text-[10px] text-[#F0ECE2]/40 font-mono">
                AI akan secara otomatis menolak generate jika bahan mentah mengandung kata di atas.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
              >
                Simpan Pedoman Redaksi AI
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Site Wizard Modal */}
      <SiteWizardModal
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onSiteCreated={() => fetchData()}
      />
    </div>
  );
};
