'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface AspirationFormProps {
  siteId: string;
  memberName: string;
}

export const AspirationForm: React.FC<AspirationFormProps> = ({ siteId, memberName }) => {
  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [email, setEmail] = useState('');
  const [kategori, setKategori] = useState('Ekonomi Nelayan & Pesisir');
  const [isi, setIsi] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !noHp || !isi) {
      setErrorMsg('Nama, nomor WhatsApp/telepon, dan isi aspirasi wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/aspirasi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: siteId,
          nama_pengirim: nama,
          no_hp: noHp,
          email,
          kategori_isu: kategori,
          isi_aspirasi: isi,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim aspirasi');
      }

      // Trigger Confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.8 },
      });

      setSuccessMsg(`Terima kasih Bapak/Ibu ${nama}. Aspirasi Anda telah diteruskan ke tim kerja ${memberName} dan tercatat resmi.`);
      setNama('');
      setNoHp('');
      setEmail('');
      setIsi('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem saat mengirim aspirasi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="aspirasi" className="py-16 bg-[#17171A] text-[#F0ECE2] border-b border-white/10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#1E1E24] rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="space-y-2 text-center">
            <span className="text-xs uppercase font-mono tracking-widest text-[#C9A33D] inline-flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" />
              Ruang Komunikasi Warga
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Sampaikan Aspirasi & Keluhan Daerah Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#F0ECE2]/70 max-w-xl mx-auto">
              Setiap masukan, persoalan infrastruktur, permohonan pendampingan, atau usulan kebijakan akan diproses dan ditindaklanjuti secara berkala oleh tim {memberName}.
            </p>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-950/80 border border-red-500/40 rounded-xl flex items-center gap-3 text-xs text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F0ECE2]/90">
                  Nama Lengkap Warga <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F0ECE2]/30 focus:outline-none focus:border-[#C9A33D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F0ECE2]/90">
                  Nomor WhatsApp / HP Aktif <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0812xxxxxxxx"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F0ECE2]/30 focus:outline-none focus:border-[#C9A33D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F0ECE2]/90">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-[#F0ECE2]/30 focus:outline-none focus:border-[#C9A33D]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F0ECE2]/90">
                  Kategori Isu / Persoalan <span className="text-red-400">*</span>
                </label>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A33D]"
                >
                  <option value="Ekonomi Nelayan & Pesisir">Ekonomi Nelayan & Pesisir</option>
                  <option value="Infrastruktur & Jembatan Pulau">Infrastruktur & Jembatan Pulau</option>
                  <option value="Pendidikan & Beasiswa Anak Pulau">Pendidikan & Beasiswa Anak Pulau</option>
                  <option value="Kesehatan & Ambulans Laut">Kesehatan & Ambulans Laut</option>
                  <option value="Bantuan Modal UMKM">Bantuan Modal UMKM</option>
                  <option value="Legalitas Tanah & Kampung Tua">Legalitas Tanah & Kampung Tua</option>
                  <option value="Aspirasi Umum / Lainnya">Aspirasi Umum / Lainnya</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F0ECE2]/90">
                Uraian Aspirasi / Detail Persoalan <span className="text-red-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan secara jelas persoalan di wilayah Anda, lokasi RT/RW atau nama pulau, dan harapan solusi..."
                value={isi}
                onChange={(e) => setIsi(e.target.value)}
                className="w-full bg-[#17171A] border border-white/15 rounded-xl p-4 text-xs text-white placeholder-[#F0ECE2]/30 focus:outline-none focus:border-[#C9A33D] resize-none"
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-[#F0ECE2]/50">
                🔒 Data kontak Anda dirahasiakan dan hanya digunakan untuk tindak lanjut aspirasi.
              </span>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#8A2E22] hover:bg-[#a63729] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-[#8A2E22]/30 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Mengirim...' : 'Kirim Aspirasi Sekarang'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
