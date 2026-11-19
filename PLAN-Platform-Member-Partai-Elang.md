# PLAN.md — Platform Website Member Partai Elang (Multi-Tenant CMS)

> Acuan: PRD-Platform-Member-Partai-Elang.md. Stack: Next.js (App Router) + Vercel, Supabase (Postgres/Auth/Storage/Realtime). Dikerjakan oleh Google Antigravity.

## Fase 0 — Setup Project
- Inisialisasi project Next.js (App Router, TypeScript, Tailwind CSS)
- Setup repo, deploy awal ke Vercel
- Buat project Supabase baru, catat URL & anon/service key, simpan di `.env`
- Install shadcn/ui, Framer Motion

## Fase 1 — Skema Database & Multi-Tenant Foundation
- Buat tabel: `sites`, `site_users`, `profiles_member`, `program_kerja`, `news_posts`, `gallery_items`, `aspirasi`, `testimoni`, `site_stats`
- Tambah kolom `site_id` (foreign key ke `sites`) di semua tabel konten
- Aktifkan Row Level Security (RLS) di semua tabel:
  - `super_admin` role → bypass semua, akses semua baris
  - `admin_situs` → hanya baris dengan `site_id` yang ada di `site_users` miliknya
  - Publik (anon) → hanya baca `news_posts`/`gallery_items`/`program_kerja` dengan status `published`, dan boleh `INSERT` ke `aspirasi` dan `testimoni` (tanpa bisa baca punya orang lain)
- Buat fungsi/trigger untuk auto-update `site_stats` saat ada page view / aspirasi baru (atau increment sederhana via API route)

## Fase 2 — Routing Multi-Tenant
- Buat Next.js middleware untuk resolve tenant:
  - Baca hostname → cek subdomain (`namaanggota.partaielang.id`) → ambil `site_slug`
  - Fallback: baca path (`/namaanggota`) jika wildcard subdomain belum aktif di DNS/Vercel
  - Cek juga tabel `sites.custom_domain` untuk anggota yang pakai domain sendiri
  - Set `site_id` ke header/context yang bisa dibaca oleh halaman & API route
- Setup wildcard domain di Vercel (`*.partaielang.id`) — catat sebagai task infra terpisah (DNS di luar kendali kode)
- Buat halaman 404 khusus untuk slug yang tidak ditemukan

## Fase 3 — Autentikasi & Role
- Setup Supabase Auth (email/password untuk admin & admin situs — publik tidak perlu login)
- Buat tabel `site_users` dengan role enum: `super_admin`, `admin_situs`, `editor`
- Middleware proteksi route `/admin/*` dan `/dashboard/*` sesuai role
- Super Admin hanya bisa dibuat manual (seed awal), tidak ada self-registration

## Fase 4 — Dashboard Admin Pusat (Super Admin)
- Halaman daftar semua situs: nama, slug, status (aktif/draft), jumlah pengunjung, jumlah aspirasi belum ditindaklanjuti
- Form "Buat Situs Baru": nama anggota, slug (auto-generate + bisa edit), pilih tema warna dari palet terkurasi, upload logo/foto profil awal
- Halaman kelola user: undang admin situs baru (email + pilih situs yang diampu), ubah role, hapus akses
- Halaman "Pengaturan Global": logo partai, info "Tentang Partai Elang" yang tampil di semua situs (disimpan di 1 baris khusus/table `global_settings`)
- Inbox Aspirasi Terpusat: tabel semua aspirasi lintas situs, filter per situs/kategori/status, tandai "sudah ditindaklanjuti"

## Fase 5 — Dashboard Admin Situs (per Anggota)
- Scoped hanya ke `site_id` miliknya (ditegakkan lewat RLS, bukan cuma UI)
- CRUD: Profil & Biografi, Program Kerja (+progress %), Berita (draft/publish), Galeri (upload foto/video + kategori), Testimoni (approve/reject submission publik kalau ada)
- Inbox Aspirasi khusus situsnya sendiri
- Preview langsung ("Lihat situs saya") sebelum publish

## Fase 6 — Website Publik per Member (Render Tenant)
Render dinamis berdasarkan `site_id` dari middleware:
- Hero/Beranda — foto, nama, jabatan, tagline, CTA
- Halaman Profil & Biografi
- Halaman Visi-Misi & Program Kerja (list + progress bar)
- Halaman/Section Berita & Kegiatan (list + detail per artikel)
- Galeri (grid + lightbox, filter kategori)
- Halaman "Tentang Partai Elang" (ambil dari `global_settings`)
- Form Aspirasi & Kontak (insert ke tabel `aspirasi` dengan `site_id` otomatis)
- Section Testimoni
- Footer dengan link medsos member + logo partai

## Fase 7 — Desain Visual & Komponen
- Bangun design system dasar: palet warna aksen terkurasi (3-5 pilihan, bukan bebas), tipografi (1 font display + 1 font sans), spacing scale
- Komponen reusable: Hero, Card Berita, Card Program Kerja, Galeri Grid+Lightbox, Form Aspirasi, Navbar responsive (hamburger di mobile), Footer
- Animasi scroll-reveal (Framer Motion) pada section utama — fade/slide saat masuk viewport
- Uji responsive di breakpoint mobile/tablet/desktop untuk setiap komponen
- Optimasi gambar: pakai `next/image`, upload lewat Supabase Storage dengan resize otomatis

## Fase 8 — SEO & Performa
- Meta tag dinamis per situs (title, description, og:image dari foto profil member)
- Sitemap otomatis per tenant (`/sitemap.xml` generate dari daftar situs aktif)
- Lazy-load galeri & gambar di luar viewport
- Target Lighthouse mobile score > 85

## Fase 9 — Statistik & Analytics
- Tracking page view sederhana (insert ke `site_stats` via API route saat halaman publik diakses, atau pakai Vercel Analytics)
- Dashboard admin pusat: grafik jumlah pengunjung & aspirasi per situs per bulan
- Dashboard admin situs: statistik ringkas situsnya sendiri saja

## Fase 10 — Realtime (opsional, nice-to-have)
- Notifikasi realtime di dashboard admin situs saat ada aspirasi baru masuk (Supabase Realtime subscribe ke tabel `aspirasi` dengan filter `site_id`)

## Fase 10a — Input Bahan Mentah dari Anggota
- Buat tabel `content_inputs`: site_id, kategori (kunjungan/reses/sosial/dll), poin-poin bebas (text array atau textarea), foto/video upload, tanggal kegiatan, status (belum diproses/sudah diproses)
- Form input super ringan di dashboard admin situs — cukup poin kasar, tanpa tuntutan menulis rapi, upload foto langsung dari form yang sama
- List riwayat input yang sudah/belum diproses AI

## Fase 10b — Pengaturan Penulisan AI (Admin Pusat)
- Buat tabel `ai_writing_settings`: tone, sudut_pandang, panjang, penekanan_isu, larangan_kata (jsonb/array), site_id nullable (null = default global)
- Halaman admin pusat "Pengaturan Penulisan AI": edit setting global, dan opsional override per situs
- Resolusi setting saat generate: pakai override situs jika ada, fallback ke global

## Fase 10c — Mesin Generate Konten (AI Pipeline)
- Buat tabel `content_jobs`: content_input_id, site_id, jenis_konten (berita/caption/progress/bio), status (pending/generated/reviewed/published), hasil_draft (text), reviewed_by, published_at
- Integrasi API LLM (pilih provider saat implementasi) dengan prompt template per jenis konten:
  - Template "Berita Kegiatan" — input poin + foto → judul + isi artikel
  - Template "Caption Galeri" — input poin + foto → caption singkat
  - Template "Progress Program Kerja" — input poin update → paragraf narasi progress
  - Template "Bio/Profil" — input poin riwayat (sekali di awal) → paragraf bio
- Setiap prompt WAJIB menyisipkan `ai_writing_settings` yang resolved (tone, sudut pandang, panjang, larangan kata) dan **instruksi eksplisit: jangan mengarang angka/kutipan/fakta yang tidak ada di input**
- Job generate dipicu: manual ("Generate Sekarang" di dashboard admin situs) atau otomatis oleh scheduler (Fase 10d)

## Fase 10d — Mode Publish & Penjadwalan
- Buat tabel `publish_schedules`: site_id, hari/jam jadwal, mode (`draft_review` atau `auto_publish`)
- Scheduler (Vercel Cron atau Supabase Edge Function terjadwal) berjalan sesuai jadwal per situs:
  - Ambil `content_inputs` berstatus belum diproses milik situs tsb
  - Kalau kosong → skip, tidak generate konten kosong
  - Kalau ada → jalankan Fase 10c untuk tiap input, hasilkan `content_job` berstatus `generated`
  - Jika mode `draft_review` → biarkan di antrian review, kirim notifikasi ke admin situs
  - Jika mode `auto_publish` → langsung publish ke `news_posts`/`gallery_items`/`program_kerja`, set `content_job.status = published`
- Dashboard admin situs: antrian review — lihat draft AI, edit manual kalau perlu, tombol Approve & Terbitkan / Tolak
- Dashboard admin pusat: pantau semua jadwal & riwayat publish lintas situs (kapan digenerate, siapa review, kapan terbit)

## Fase 11 — Polish & QA
- Uji RLS: pastikan admin situs A tidak bisa akses/edit data situs B (uji manual + otomatis)
- Uji routing: subdomain, path fallback, dan custom domain ketiganya resolve ke situs yang benar
- Uji form aspirasi & testimoni dari sisi publik (tanpa login)
- Uji responsive end-to-end di 3 device utama
- Smoke test: buat situs baru dari dashboard admin pusat → isi konten dari dashboard admin situs → cek tampil benar di URL publik

## Catatan Penting untuk Antigravity
1. **RLS adalah pagar keamanan utama**, bukan hanya pengecekan di UI — setiap tabel konten wajib ada `site_id` + policy yang menegakkan isolasi antar situs.
2. **Jangan bangun deploy terpisah per anggota** — ini satu basis kode, satu database, dipisahkan logis lewat `site_id`. Menambah anggota baru = insert baris baru di `sites`, bukan deploy baru.
3. Wildcard subdomain butuh setup DNS di luar kode (di registrar domain + Vercel domain settings) — kalau belum siap saat development, gunakan path-based routing (`/namaanggota`) sebagai mode kerja sementara, middleware harus mendukung kedua mode.
4. Palet warna aksen per situs **dibatasi** (3-5 pilihan terkurasi), bukan color picker bebas — supaya semua situs tetap terlihat "satu keluarga" brand Partai Elang.
5. **AI tidak boleh mengarang fakta** — setiap prompt generate wajib membatasi AI hanya menyusun ulang/merapikan apa yang ada di `content_inputs`, bukan menambah angka/kutipan/klaim baru. Ini guardrail wajib, bukan opsional.
6. **Default mode publish adalah draft-review**, bukan auto-publish — auto-publish hanya diaktifkan admin pusat secara sadar per situs, dan sebaiknya hanya untuk jenis konten berisiko rendah (caption galeri), bukan berita/klaim program kerja.
