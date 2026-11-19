# 🦅 Partai Elang Indonesia - Platform Website Member (Multi-Tenant CMS)

Platform web modern berbasis Next.js 15+ dan Supabase PostgreSQL yang memungkinkan **1 Admin Pusat (DPP Partai Elang)** mengelola puluhan hingga ratusan website personal branding anggota, kader, dan calon legislatif secara terpusat dari satu dashboard (*single codebase, multi-tenant*).

---

## 🌟 Fitur Utama

1. **Arsitektur Multi-Tenant Terpusat:**
   - Satu basis kode dan satu basis data melayani banyak situs kader.
   - Akses tenant via:
     - Path-based: `/meireza-endipat-wijaya`, `/suryani-lestari`, `/dr-ahmad-fauzi`
     - Subdomain wildcard: `namaanggota.partaielang.id`
     - Custom domain pribadi (pemetaan CNAME).
   - Penambahan situs kader baru berlangsung instan (< 1 menit) tanpa proses deploy ulang kode.

2. **Desain Visual Representatif (Elang Identity):**
   - Mengusung palet warna otoritatif: **Hitam Elang** (`#17171A`), **Emas Tembaga** (`#C9A33D`), **Tulang/Kertas** (`#F0ECE2`), **Cokelat Batu** (`#6B5B45`), dan **Merah Bata Gelap** (`#8A2E22`).
   - Masthead Hero bergaya poster kampanye resmi dengan tipografi display tegas dan foto kandidat yang proporsional.
   - Grid asimetris untuk rilis warta berita kegiatan.
   - Pull-quote tipografis untuk testimoni warga.

3. **Mesin Generative AI & Redaksi Terpusat (Fase 10a–10d):**
   - **Input Bahan Mentah:** Kader tidak dituntut mengarang artikel rapi — cukup input poin kasar kegiatan di lapangan ("Apa yang terjadi?") dan tanggal.
   - **Guardrail AI:** AI merangkai narasi warta berita, caption media sosial, atau laporan progres program kerja sesuai pedoman redaksi (`ew_ai_writing_settings`: tone, sudut pandang orang pertama/ketiga, panjang narasi, dan larangan kata sensitif/data fiktif).
   - **Mode Draft-Review:** Hasil olahan AI masuk antrian kurasi sebelum diterbitkan resmi ke situs publik.

4. **Formulir Aspirasi Warga Terintegrasi:**
   - Warga dapat menyampaikan masukan, keluhan fasilitas publik, atau permohonan beasiswa langsung di situs kader.
   - Aspirasi otomatis bermuara ke **Inbox Terpusat Super Admin** dan **Inbox Khusus Kader**.
   - Dilengkapi pelacakan status tindak lanjut: *Pending* ➔ *Sedang Diproses* ➔ *Selesai*.

5. **Role-Based Access Control (RBAC):**
   - **Super Admin (Pusat):** Kendali lintas-situs, tambah/hapus situs, aturan redaksi AI global, statistik gabungan seluruh Indonesia.
   - **Admin Situs (Kader):** Mengelola situsnya sendiri (biografi, program kerja, berita, galeri, respon aspirasi).
   - **Publik:** Menjelajahi profil, membaca berita kegiatan, mengirim aspirasi tanpa perlu login.

---

## 🛠️ Stack Teknologi

- **Framework:** Next.js 15+ (App Router, Server Components & Dynamic Route Handlers)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS & Lucide Icons
- **Database:** Supabase PostgreSQL (Tabel terisolasi `ew_*` dengan Row Level Security)
- **Animation:** Canvas Confetti & Framer Motion
- **Deployment:** Vercel

---

## 🚀 Panduan Menjalankan Proyek

### 1. Klon Repositori & Instal Dependensi
```bash
git clone https://github.com/ekaprasaja/elang-web.git
cd elang-web
pnpm install
```

### 2. Konfigurasi Environment Variables
Salin berkas `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```
Isi variabel dengan kredensial Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### 3. Jalankan Server Pengembangan
```bash
pnpm dev
```
Akses melalui browser pada `http://localhost:3000`.

---

## 🔒 Skema Tabel Database (`ew_*`)

- `ew_sites` - Registri situs tenant (slug, nama kader, jabatan, dapil, nomor urut).
- `ew_global_settings` - Pengaturan terpusat manifesto Partai Elang.
- `ew_site_users` - Akses dan peran pengguna (super_admin, admin_situs, editor).
- `ew_profiles_member` - Biografi, visi-misi, riwayat pendidikan & organisasi kader.
- `ew_program_kerja` - Program kerja dan persentase capaian realisasi.
- `ew_news_posts` - Warta berita dan rilis pers resmi.
- `ew_gallery_items` - Dokumentasi visual foto dan video lapangan.
- `ew_aspirasi` - Masukan dan aspirasi warga masyarakat.
- `ew_testimoni` - Kesaksian dan kutipan dukungan warga.
- `ew_ai_writing_settings` - Panduan redaksi dan guardrail konten AI.
- `ew_content_inputs` - Poin catatan kasar bahan mentah dari kader.
- `ew_content_jobs` - Antrian draft olahan mesin AI.

---

## 📜 Lisensi
Hak Cipta © 2026 Dewan Pimpinan Pusat Partai Elang Indonesia.
