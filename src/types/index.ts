export interface Site {
  id: string;
  slug: string;
  nama_anggota: string;
  jabatan: string;
  dapil: string;
  nomor_urut: number;
  custom_domain?: string | null;
  tema_aksen: string;
  logo_url?: string | null;
  foto_resmi_url?: string | null;
  tagline?: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  created_at: string;
  updated_at?: string;
}

export interface GlobalPartySettings {
  id: string;
  party_name: string;
  party_tagline: string;
  logo_url?: string | null;
  tentang_partai: string;
  visi_partai: string;
  misi_partai: string[];
  pusat_kontak: {
    alamat?: string;
    email?: string;
    telepon?: string;
    call_center?: string;
  };
}

export interface SiteUser {
  id: string;
  site_id?: string | null;
  email: string;
  nama: string;
  role: 'super_admin' | 'admin_situs' | 'editor';
  created_at?: string;
}

export interface MemberProfile {
  id: string;
  site_id: string;
  bio: string;
  visi_personal?: string;
  misi_personal?: string[];
  riwayat_pendidikan?: Array<{
    jenjang: string;
    institusi: string;
    tahun: string;
  }>;
  riwayat_organisasi?: Array<{
    posisi: string;
    organisasi: string;
    periode: string;
  }>;
  kontak_email?: string;
  kontak_wa?: string;
  kontak_instagram?: string;
  kontak_twitter?: string;
  kontak_facebook?: string;
  kontak_tiktok?: string;
}

export interface ProgramKerja {
  id: string;
  site_id: string;
  judul: string;
  deskripsi: string;
  kategori_isu: string;
  target?: string;
  progress_persen: number;
  status: 'BERJALAN' | 'TERCAPAI' | 'DIRENCANAKAN';
  urutan: number;
}

export interface NewsPost {
  id: string;
  site_id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;
  cover_image_url?: string;
  kategori: string;
  tanggal_publish: string;
  status: 'draft' | 'published' | 'archived';
  views_count: number;
}

export interface GalleryItem {
  id: string;
  site_id: string;
  judul: string;
  caption?: string;
  tipe: 'image' | 'video';
  media_url: string;
  kategori_acara: string;
  tanggal: string;
}

export interface Aspirasi {
  id: string;
  site_id: string;
  nama_pengirim: string;
  email?: string;
  no_hp: string;
  kategori_isu: string;
  isi_aspirasi: string;
  status_tindak_lanjut: 'pending' | 'diproses' | 'selesai';
  tanggapan?: string;
  created_at: string;
}

export interface Testimoni {
  id: string;
  site_id: string;
  nama: string;
  peran_profesi?: string;
  isi: string;
  foto_url?: string;
  rating: number;
  status: 'approved' | 'pending';
}

export interface ContentInput {
  id: string;
  site_id: string;
  kategori: string;
  tanggal_kegiatan: string;
  poin_kegiatan: string;
  media_urls?: string[];
  status: 'raw' | 'processing' | 'processed';
  created_by?: string;
  created_at: string;
}

export interface AIWritingSettings {
  id: string;
  site_id?: string | null;
  tone: string;
  sudut_pandang: 'orang_pertama' | 'orang_ketiga';
  panjang: 'singkat' | 'menengah' | 'mendalam';
  penekanan_isu: string[];
  larangan_kata: string[];
}

export interface ContentJob {
  id: string;
  content_input_id?: string | null;
  site_id: string;
  jenis_konten: 'berita' | 'caption' | 'progress' | 'bio';
  status: 'draft' | 'reviewed' | 'published';
  draft_title?: string;
  draft_body: string;
  reviewed_by?: string;
  published_at?: string;
  created_at: string;
}

export interface PublishSchedule {
  id: string;
  site_id: string;
  hari_jadwal: string;
  jam_jadwal: string;
  mode: 'draft_review' | 'auto_publish';
  is_active: boolean;
}

export interface MemberSiteData {
  site: Site;
  profile?: MemberProfile;
  programs: ProgramKerja[];
  news: NewsPost[];
  gallery: GalleryItem[];
  testimonials: Testimoni[];
  globalParty: GlobalPartySettings;
  stats?: {
    pageViews: number;
    totalAspirasi: number;
  };
}
