# PRD — Platform Website Member Partai Elang (Multi-Tenant CMS)

## 1. Ringkasan

Platform berbasis web yang memungkinkan **1 admin pusat** mengelola **banyak website personal-branding anggota Partai Elang** dari satu dashboard terpusat (CMS multi-tenant). Setiap anggota partai mendapat website pribadinya sendiri (subdomain atau custom domain) yang berfungsi sebagai media image/brand untuk dirinya dan partai — tanpa admin pusat harus membangun/mengelola kode terpisah untuk setiap anggota.

Dibangun dengan Next.js (Vercel) + Supabase, dikerjakan oleh Google Antigravity.

## 2. Latar Belakang & Masalah

- Partai Elang punya banyak anggota/kader yang masing-masing butuh citra digital personal (profil, program kerja, berita kegiatan, aspirasi masyarakat).
- Membuatkan website terpisah untuk setiap anggota secara manual tidak efisien — butuh deploy, maintenance, dan update konten yang berulang.
- Solusinya: **satu platform, satu basis kode, banyak situs** — setiap anggota punya "etalase" sendiri, tapi semuanya dikelola dari satu dashboard admin.
- Desain harus terlihat profesional, modern, dan terpercaya — bukan template generik — karena ini representasi citra politik.

## 3. Lingkup

**Masuk lingkup:**
- Dashboard admin pusat (super admin) untuk membuat, mengatur, dan memantau banyak website member
- Setiap website member punya konten yang bisa diedit sendiri (oleh admin pusat, atau didelegasikan ke tim/anggota ybs — role diatur admin)
- Template/desain visual yang konsisten tapi bisa disesuaikan warna/foto per anggota
- Form aspirasi masyarakat per situs, masuk ke satu dashboard terpusat
- Statistik pengunjung & aspirasi lintas-situs untuk admin pusat

**Belum masuk lingkup (fase ini):**
- Integrasi pembayaran/donasi
- Aplikasi mobile native
- Multi-partai (platform ini khusus Partai Elang, bukan SaaS lintas-partai)
- Verifikasi NIK/KTP (tidak relevan untuk website publik)

## 4. Peran Pengguna & Hak Akses

| Role | Hak Akses |
|---|---|
| **Super Admin** (pusat partai) | Buat/hapus situs member baru, kelola semua konten semua situs, kelola user & role, lihat statistik & aspirasi lintas-situs, atur tema global |
| **Admin Situs** (per anggota — bisa anggota sendiri atau tim medsos-nya) | Kelola konten situsnya sendiri saja (berita, galeri, profil, program kerja), lihat aspirasi masuk ke situsnya, tidak bisa akses situs lain |
| **Editor** (opsional, dibuat oleh Admin Situs) | Hanya bisa tulis/edit draft berita & galeri, tidak bisa publish/ubah setting |
| **Publik** (pengunjung) | Lihat situs, kirim aspirasi, tidak perlu login |

## 5. Arsitektur Multi-Tenant

- Setiap anggota = 1 "tenant" dengan `site_slug` unik → diakses lewat:
  - Subdomain: `namaanggota.partaielang.id`, **atau**
  - Path: `partaielang.id/namaanggota` (fallback kalau wildcard subdomain belum siap), **atau**
  - Custom domain milik anggota sendiri (opsional, map via CNAME)
- Next.js middleware membaca domain/subdomain/path request → resolve ke `site_id` → render konten sesuai tenant tersebut
- Semua tenant berbagi 1 basis kode & 1 database (Supabase), dipisahkan lewat `site_id` + Row Level Security (RLS) — bukan deploy terpisah per anggota

## 6. Model Data (Garis Besar)

- `sites` — id, slug, nama_anggota, jabatan, custom_domain, tema_warna, logo_url, status (aktif/draft), created_at
- `site_users` — relasi user ↔ site ↔ role (admin_situs / editor)
- `profiles_member` — bio, foto, riwayat, visi personal, link medsos (per site)
- `program_kerja` — judul, deskripsi, kategori isu, progress (per site)
- `news_posts` — judul, isi, foto/video, tanggal publish, status draft/published (per site)
- `gallery_items` — foto/video, kategori acara (per site)
- `aspirasi` — nama pengirim, kontak, kategori isu, isi, status tindak lanjut, site_id (asal situs)
- `testimoni` — nama, isi, foto (opsional), per site
- `site_stats` — page views, jumlah aspirasi per bulan (agregat untuk dashboard admin pusat)
- `content_inputs` — bahan mentah dari anggota (poin kegiatan, foto, kategori, tanggal), site_id, status (belum diproses/sudah diproses)
- `content_jobs` — status pipeline AI per draft (pending → generated → reviewed/approved → published), relasi ke `content_inputs` & hasil akhirnya (news_posts/gallery_items/program_kerja)
- `ai_writing_settings` — tone, sudut pandang, panjang, penekanan isu, larangan kata/isu (global + override per site_id)
- `publish_schedules` — jadwal auto-publish per site_id (hari/jam, mode draft-review vs auto-publish)

Semua tabel konten per-site memiliki RLS: Admin Situs hanya bisa akses baris dengan `site_id` miliknya; Super Admin bisa akses semua.

## 7. Fitur Detail — Dashboard Admin Pusat (CMS)

1. **Manajemen Situs** — buat situs anggota baru (isi nama, slug, pilih tema warna, upload logo/foto) dalam hitungan menit, tanpa deploy manual
2. **Manajemen User & Role** — undang admin situs per anggota, atur siapa bisa edit apa
3. **Monitor Lintas-Situs** — tabel ringkas semua situs: status aktif, jumlah pengunjung, jumlah aspirasi belum ditindaklanjuti
4. **Inbox Aspirasi Terpusat** — semua aspirasi dari semua situs masuk ke satu tempat, bisa difilter per situs/kategori/status
5. **Template & Tema** — kelola beberapa varian desain/tema yang bisa dipilih tiap situs (tetap konsisten brand partai, beda aksen warna/foto)
6. **Pengaturan Global** — logo & info Partai Elang yang tampil di semua situs (footer, halaman "Tentang Partai")

## 8. Fitur Detail — Website Publik per Member

(Mengacu isi/fitur yang sudah disepakati sebelumnya)

1. Hero/Beranda — foto resmi, nama, jabatan, tagline, CTA
2. Profil & Biografi
3. Visi, Misi & Program Kerja (dengan progress/realisasi)
4. Berita & Kegiatan (feed, bisa update sendiri lewat CMS)
5. Galeri foto/video per kategori
6. Tentang Partai Elang (konten global dari admin pusat)
7. Form Aspirasi & Kontak
8. Testimoni masyarakat
9. Integrasi media sosial (feed + share button)
10. Peta sebaran kegiatan/posko (opsional per situs)
11. Statistik transparansi (realisasi program, jumlah aspirasi ditindaklanjuti)

## 9. Desain & UI/UX — Arahan Visual

**Prinsip desain:** digali dari subjeknya sendiri (identitas "Elang" — berat, otoritatif, bukan ringan ala startup), bukan template kartu-SaaS generik. Satu momen berani di hero, tenang di sekitarnya.

### Token Desain

**Warna (dasar, dipakai konsisten di semua situs):**
| Token | Hex | Peran |
|---|---|---|
| Hitam Elang | `#17171A` | dasar teks utama, section gelap |
| Emas Tembaga | `#C9A33D` | aksen utama — garis, highlight nama, ikon |
| Tulang/Kertas | `#F0ECE2` | latar terang utama |
| Cokelat Batu | `#6B5B45` | teks sekunder, caption |
| Merah Bata Gelap | `#8A2E22` | 1 aksen urgensi — tombol CTA aspirasi/kontak saja, dipakai sangat jarang |

Variasi antar situs anggota **bukan** skema warna berbeda-beda, hanya pergeseran tipis pada elemen aksen sekunder (misal warna garis bawah nama di hero) — identitas inti hitam-emas-tulang tetap sama di semua situs supaya terlihat "satu keluarga" Partai Elang.

**Tipografi:** satu display slab-serif tegas & berbobot besar untuk nama/judul (kesan pemimpin, bukan startup) + satu grotesque sans netral untuk body/UI — kontras tegas, maksimal 2 keluarga font. Panjang baris body < 80 karakter.

**Layout:**
- **Hero:** masthead ala poster kampanye — nama dipasang besar, tumpang-tindih tepi foto (bukan terpusat rapi dalam kotak terpisah)
- **Berita/Kegiatan:** grid asimetris (1 artikel utama besar + beberapa kecil di sampingnya), bukan kartu seragam berulang dengan shadow yang sama
- **Testimoni:** pull-quote besar sebagai elemen tipografis, bukan kartu+avatar+shadow
- **Program Kerja:** nomor urut (01/02/03) **hanya** dipakai jika kontennya memang tahapan/timeline sekuensial; kalau bukan, pakai label kategori biasa
- Pembatas antar-section pakai garis tipis (hairline), bukan shadow lembut seragam di semua elemen

**Motion:** satu urutan reveal terorkestrasi saat hero pertama kali muncul (bukan fade-slide berulang di setiap section saat scroll). Transisi hover pada elemen interaktif tetap ada tapi halus dan tidak seragam-template.

**Foto/Visual:** foto diperlakukan sebagai materi utama (gaya dokumenter/poster kampanye), bukan ilustrasi dekoratif. Galeri grid + lightbox, foto hero di-crop responsif.

**Komponen & aksesibilitas:** Tailwind CSS (komponen custom sesuai token di atas, bukan styling default shadcn/ui tanpa modifikasi), Framer Motion untuk 1 momen hero saja. Tetap harus responsive penuh ke mobile, focus state keyboard terlihat, hormati preferensi reduced-motion, kontras warna teruji aman dibaca.

## 10. Arsitektur Teknis

- **Frontend:** Next.js (App Router), Vercel, multi-tenant routing via middleware (subdomain/path/custom domain)
- **Backend/DB:** Supabase (Postgres, Auth, Storage untuk foto/video, Realtime untuk notifikasi aspirasi baru)
- **RLS:** per `site_id`, role-based (super_admin bypass, admin_situs scoped)
- **Image handling:** Supabase Storage + Next/Image untuk optimasi otomatis
- **Analytics:** Vercel Analytics atau sederhana via tabel `site_stats` + Supabase

## 11. Non-Functional Requirements

- Responsive di semua breakpoint (mobile, tablet, desktop) — mobile adalah prioritas utama
- Waktu muat halaman publik < 2 detik (optimasi gambar wajib)
- SEO-friendly (meta tag per situs, sitemap otomatis per tenant)
- Skalabel hingga puluhan/ratusan situs anggota tanpa perlu re-deploy manual tiap situs baru
- Aman: admin situs tidak bisa mengakses data situs lain (RLS teruji)

## 12. Asumsi

- Subdomain wildcard (`*.partaielang.id`) tersedia; jika belum, fase awal pakai path-based (`partaielang.id/namaanggota`) sebagai fallback
- Konten tiap situs diisi oleh admin situs masing-masing (bukan admin pusat mengetik semua secara manual)
- Jumlah anggota awal diasumsikan puluhan (bukan ribuan) — arsitektur tetap dirancang agar bisa scale lebih jauh

## 13. Fitur Generative AI — Konten Otomatis & Penjadwalan Publish

**Tujuan:** Anggota partai tidak perlu menulis laporan/artikel sendiri. Mereka hanya memberi bahan mentah (poin kegiatan, foto, atau catatan singkat), lalu AI yang menyusun jadi konten siap tayang (berita, caption galeri, update program kerja). Admin pusat mengatur gaya penulisan dan jadwal terbit — bukan anggota.

### 13.1 Input dari Anggota (bahan mentah, bukan tulisan jadi)
- Form input singkat: "Apa yang terjadi?" (poin-poin bebas, boleh tidak rapi), upload foto, pilih kategori (kunjungan/reses/sosial/dll), tanggal kegiatan
- Tidak ada tekanan menulis — cukup poin kasar, AI yang merangkai jadi narasi

### 13.2 Mesin Generate Konten (AI)
- Dari bahan mentah di atas, AI menghasilkan draft untuk:
  - Artikel berita kegiatan (judul + isi)
  - Caption galeri foto/video
  - Narasi progress program kerja (dari update poin → paragraf progress)
  - Draft bio/profil (sekali di awal, dari poin riwayat yang diberikan)
- Setiap hasil generate berstatus **draft** terlebih dahulu — lihat 13.4 soal mode publish

### 13.3 Pengaturan Penulisan AI (dikontrol Admin Pusat)
Admin pusat menentukan "gaya tulis" yang dipakai AI, bisa diset secara global atau override per situs:
- **Tone/gaya bahasa:** formal, merakyat, inspiratif, dll
- **Sudut pandang:** orang pertama ("Saya mengunjungi...") atau orang ketiga ("[Nama] mengunjungi...")
- **Panjang konten:** singkat/menengah/panjang
- **Penekanan isu:** topik/program yang ingin ditonjolkan sesuai arahan partai
- **Larangan kata/isu:** daftar kata atau topik yang harus dihindari AI (guardrail konten sensitif)
- Semua setting ini disimpan di tabel `ai_writing_settings` (global + override per `site_id`)

### 13.4 Mode Publish & Penjadwalan
- **Mode Draft-Review (direkomendasikan default):** AI generate draft → masuk antrian review admin situs/pusat → baru terbit setelah disetujui. Penting terutama untuk konten yang menyebut angka, kutipan, atau klaim faktual — AI bisa salah, dan ini konten citra publik politik yang berisiko tinggi kalau keliru.
- **Mode Auto-Publish Terjadwal (opsional, per situs):** admin pusat atur jadwal (misal: setiap Senin & Kamis jam 9 pagi) → AI otomatis generate dari backlog bahan mentah yang belum diproses → langsung terbit tanpa review manual. Hanya disarankan untuk konten berisiko rendah (caption galeri, progress program kerja non-kuantitatif).
- Kalau tidak ada bahan mentah baru dari anggota pada periode jadwal tsb, sistem **tidak memaksa generate konten kosong** — cukup skip periode itu.
- Admin pusat bisa pantau semua jadwal & status publish lintas-situs dari satu dashboard (riwayat: digenerate kapan, direview siapa, terbit kapan)

### 13.5 Batasan & Tanggung Jawab
- AI tidak diberi akses untuk mengklaim data/statistik yang tidak berasal dari input anggota (tidak boleh "mengarang" angka)
- Setiap konten hasil AI tetap tercatat sumber bahan mentahnya (audit trail) — bisa ditelusuri kalau ada yang perlu dikoreksi

## 14. Kriteria Sukses

- Admin pusat bisa membuat 1 website member baru dalam < 10 menit tanpa bantuan developer
- Setidaknya 1 admin situs bisa mandiri update berita/galeri tanpa training teknis
- Semua situs lulus uji responsive di 3 ukuran layar utama (mobile/tablet/desktop)
- Tidak ada kebocoran data antar situs (RLS teruji aman)
