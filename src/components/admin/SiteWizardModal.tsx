'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles, Check } from 'lucide-react';
import { Site } from '@/types';

interface SiteWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSiteCreated: () => void;
}

export const SiteWizardModal: React.FC<SiteWizardModalProps> = ({ isOpen, onClose, onSiteCreated }) => {
  const [nama, setNama] = useState('');
  const [jabatan, setJabatan] = useState('Calon Anggota DPRD');
  const [dapil, setDapil] = useState('Kepulauan Riau');
  const [nomorUrut, setNomorUrut] = useState(1);
  const [tagline, setTagline] = useState('Mengabdi untuk Kedaulatan Rakyat & Daerah Pesisir');
  const [temaAksen, setTemaAksen] = useState('#C9A33D');
  const [fotoUrl, setFotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const accentOptions = [
    { label: 'Emas Tembaga (Resmi)', value: '#C9A33D' },
    { label: 'Amber Surya', value: '#D97706' },
    { label: 'Zamrud Pesisir', value: '#059669' },
    { label: 'Biru Samudera', value: '#0284C7' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) {
      setErrorMsg('Nama anggota wajib diisi');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const slug = nama
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama_anggota: nama,
          slug,
          jabatan,
          dapil,
          nomor_urut: Number(nomorUrut),
          tagline,
          tema_aksen: temaAksen,
          foto_resmi_url: fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal membuat situs');
      }

      onSiteCreated();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memproses pembuatan situs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1E1E24] border border-white/20 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white bg-white/10 rounded-full"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A33D] uppercase">
            <Sparkles className="w-4 h-4" />
            Multi-Tenant Site Builder
          </div>
          <h3 className="font-display font-black text-xl text-white">
            Buat Website Member Baru
          </h3>
          <p className="text-xs text-[#F0ECE2]/60">
            Situs akan langsung aktif dengan subdomain, halaman profil, dan template standar Partai Elang dalam hitungan detik.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/80 border border-red-500/40 rounded-xl text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">
              Nama Lengkap & Gelar Kader <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ir. Herman Suwandi, M.M."
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C9A33D]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">
                Jabatan / Status Pencalonan
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">
                Daerah Pemilihan (Dapil)
              </label>
              <input
                type="text"
                required
                value={dapil}
                onChange={(e) => setDapil(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">
                Nomor Urut Resmi
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={nomorUrut}
                onChange={(e) => setNomorUrut(Number(e.target.value))}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white">
                Warna Aksen Terkurasi
              </label>
              <select
                value={temaAksen}
                onChange={(e) => setTemaAksen(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
              >
                {accentOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">
              Slogan / Tagline Pengabdian
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white">
              URL Foto Resmi (Opsional)
            </label>
            <input
              type="url"
              placeholder="https://... (Biarkan kosong untuk foto placeholder)"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#C9A33D]"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#C9A33D] hover:bg-amber-500 text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#C9A33D]/20 disabled:opacity-50"
            >
              {loading ? 'Menerbitkan...' : 'Terbitkan Situs Baru'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
