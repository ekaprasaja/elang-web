import { supabaseAdmin } from './supabase';
import {
  Site,
  GlobalPartySettings,
  MemberProfile,
  ProgramKerja,
  NewsPost,
  GalleryItem,
  Aspirasi,
  Testimoni,
  ContentInput,
  AIWritingSettings,
  ContentJob,
  MemberSiteData,
  SentimentIssue,
} from '@/types';

export const ewRepository = {
  // 1. Sites
  async getAllSites(): Promise<Site[]> {
    const { data, error } = await supabaseAdmin
      .from('ew_sites')
      .select('*')
      .order('nomor_urut', { ascending: true });

    if (error) {
      console.error('Error fetching sites:', error);
      return [];
    }
    return (data || []).map((s) => ({
      ...s,
      logo_url: '/logo-transparent.webp',
    }));
  },

  async getSiteBySlug(slug: string): Promise<Site | null> {
    const { data, error } = await supabaseAdmin
      .from('ew_sites')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return {
      ...data,
      logo_url: '/logo-transparent.webp',
    };
  },

  async createSite(siteData: Partial<Site>): Promise<{ success: boolean; site?: Site; error?: string }> {
    const id = `site-${Date.now()}`;
    const slug = siteData.slug || siteData.nama_anggota?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `site-${Date.now()}`;
    
    const newSite: Site = {
      id,
      slug,
      nama_anggota: siteData.nama_anggota || 'Anggota Baru',
      jabatan: siteData.jabatan || 'Kader Partai Elang',
      dapil: siteData.dapil || 'Kepulauan Riau',
      nomor_urut: siteData.nomor_urut || 1,
      custom_domain: siteData.custom_domain || null,
      tema_aksen: siteData.tema_aksen || '#C9A33D',
      logo_url: siteData.logo_url || null,
      foto_resmi_url: siteData.foto_resmi_url || '/images/profiles/arya-pratama.webp',
      tagline: siteData.tagline || 'Mengabdi untuk Kedaulatan Rakyat & Daerah Pesisir',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabaseAdmin.from('ew_sites').insert([newSite]);
    if (insertError) {
      return { success: false, error: insertError.message };
    }

    // Create default profile for the site
    await supabaseAdmin.from('ew_profiles_member').insert([{
      id: `prof-${Date.now()}`,
      site_id: id,
      bio: `Selamat datang di laman resmi ${newSite.nama_anggota}. Wadah komunikasi terbuka, aspirasi publik, dan publikasi agenda kerja kemasyarakatan.`,
      visi_personal: 'Mewujudkan kesejahteraan merata dan pengabdian tulus bagi rakyat di daerah pemilihan.',
      misi_personal: ['Mendengarkan aspirasi warga secara konsisten.', 'Memperjuangkan alokasi anggaran tepat sasaran.'],
      kontak_email: `kontak@${slug}.partaielang.id`,
    }]);

    // Create a welcome post
    await supabaseAdmin.from('ew_news_posts').insert([{
      id: `news-${Date.now()}`,
      site_id: id,
      judul: `Selamat Datang di Laman Resmi ${newSite.nama_anggota}`,
      slug: 'selamat-datang-di-laman-resmi',
      ringkasan: `Website ini hadir sebagai media transparansi kinerja, serap aspirasi, dan komunikasi langsung dengan masyarakat.`,
      isi: `Assalamu’alaikum Wr. Wb. dan salam sejahtera bagi seluruh masyarakat.\n\nWebsite ini diluncurkan sebagai wujud komitmen keterbukaan informasi dan pertanggungjawaban publik atas amanah pengabdian kami di Partai Elang. Di sini, masyarakat dapat memantau perkembangan program kerja, membaca dokumentasi kegiatan, serta menyampaikan aspirasi secara langsung.\n\nMari bersama-sama bersinergi membangun daerah yang lebih maju, berdaulat, dan berkeadilan.`,
      cover_image_url: newSite.foto_resmi_url,
      kategori: 'Pengumuman Resmi',
      status: 'published',
      views_count: 1,
      tanggal_publish: new Date().toISOString(),
    }]);

    return { success: true, site: newSite };
  },

  async updateSite(id: string, updates: Partial<Site>): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabaseAdmin.from('ew_sites').update(updates).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  // 2. Global Party Settings
  async getGlobalSettings(): Promise<GlobalPartySettings> {
    const { data } = await supabaseAdmin
      .from('ew_global_settings')
      .select('*')
      .eq('id', 'default-party-settings')
      .single();

    if (!data) {
      return {
        id: 'default-party-settings',
        party_name: 'Partai Elang',
        party_tagline: 'Gerakan Politik Kebangsaan Untuk Indonesia',
        logo_url: '/logo-transparent.webp',
        tentang_partai: 'Partai Elang hadir sebagai wadah perjuangan politik yang berfokus pada semangat nasionalisme, kerakyatan, dan keadilan sosial. Kami berjuang dan bekerja untuk perubahan Indonesia. Dan setiap kader kami adalah patriot-patriot bangsa yang selalu siap menyingsingkan lengan baju untuk mewujudkan cita-cita para pendiri Bangsa dan Negara Kesatuan Republik Indonesia.',
        visi_partai: 'Terwujudnya Cita-cita Perubahan Indonesia. Arah perjuangan kami dibangun di atas konstitusi, nilai kebangsaan, dan komitmen untuk menghadirkan dampak yang bisa dirasakan langsung oleh rakyat.',
        misi_partai: [
          'Terwujudnya cita-cita nasional bangsa Indonesia sebagaimana dimaksud dalam Pembukaan Undang-Undang Dasar Negara Republik Indonesia Tahun 1945.',
          'Terwujudnya masyarakat demokratis yang adil dan sejahtera serta berkeyakinan pada Tuhan Yang Maha Esa, mencintai tanah air dan bangsa dalam bingkai Negara Kesatuan Republik Indonesia.',
          'Mewujudkan masyarakat kedaulatan rakyat dalam berdemokrasi, yang menjunjung tinggi nilai-nilai kebenaran dan hukum yang berlaku.',
          'Mewujudkan ekonomi kerakyatan yang berkeadilan.',
        ],
        pusat_kontak: {
          alamat: 'Kantor Dewan Pimpinan Pusat Partai Elang',
          email: 'kontak@partaielang.id',
          telepon: '085 8175 99550',
          admin_contact: '085 8175 99550',
          website: 'https://partaielang.id',
          fokus_kerja: 'Kaderisasi',
          jangkauan: 'Nasional',
          karakter_gerakan: 'Kolaboratif',
          slogan: 'Bersama, Kita Bisa!',
        },
      };
    }
    return {
      ...data,
      logo_url: '/logo-transparent.webp',
    };
  },

  async updateGlobalSettings(updates: Partial<GlobalPartySettings>): Promise<{ success: boolean }> {
    await supabaseAdmin
      .from('ew_global_settings')
      .upsert([{ id: 'default-party-settings', ...updates, updated_at: new Date().toISOString() }]);
    return { success: true };
  },

  // 3. Member Full Public Site Data
  async getMemberSiteFullData(slug: string): Promise<MemberSiteData | null> {
    const site = await this.getSiteBySlug(slug);
    if (!site) return null;

    const [profileRes, programsRes, newsRes, galleryRes, testRes, globalParty] = await Promise.all([
      supabaseAdmin.from('ew_profiles_member').select('*').eq('site_id', site.id).single(),
      supabaseAdmin.from('ew_program_kerja').select('*').eq('site_id', site.id).order('urutan', { ascending: true }),
      supabaseAdmin.from('ew_news_posts').select('*').eq('site_id', site.id).eq('status', 'published').order('tanggal_publish', { ascending: false }),
      supabaseAdmin.from('ew_gallery_items').select('*').eq('site_id', site.id).order('tanggal', { ascending: false }),
      supabaseAdmin.from('ew_testimoni').select('*').eq('site_id', site.id).eq('status', 'approved').order('created_at', { ascending: false }),
      this.getGlobalSettings(),
    ]);

    // Track page view
    await supabaseAdmin
      .from('ew_news_posts')
      .update({ views_count: (newsRes.data?.[0]?.views_count || 0) + 1 })
      .eq('id', newsRes.data?.[0]?.id || 'dummy');

    return {
      site,
      profile: profileRes.data || undefined,
      programs: programsRes.data || [],
      news: newsRes.data || [],
      gallery: galleryRes.data || [],
      testimonials: testRes.data || [],
      globalParty,
    };
  },

  // 4. Aspirations
  async createAspirasi(data: Partial<Aspirasi>): Promise<{ success: boolean; id?: string; error?: string }> {
    const id = `asp-${Date.now()}`;
    const { error } = await supabaseAdmin.from('ew_aspirasi').insert([{
      id,
      site_id: data.site_id,
      nama_pengirim: data.nama_pengirim,
      email: data.email || null,
      no_hp: data.no_hp,
      kategori_isu: data.kategori_isu,
      isi_aspirasi: data.isi_aspirasi,
      status_tindak_lanjut: 'pending',
      created_at: new Date().toISOString(),
    }]);

    if (error) return { success: false, error: error.message };
    return { success: true, id };
  },

  async getAspirations(siteId?: string): Promise<Aspirasi[]> {
    let query = supabaseAdmin.from('ew_aspirasi').select('*, ew_sites(nama_anggota, slug)').order('created_at', { ascending: false });
    if (siteId) {
      query = query.eq('site_id', siteId);
    }
    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }
    return data || [];
  },

  async updateAspirasiStatus(id: string, status: 'pending' | 'diproses' | 'selesai', tanggapan?: string): Promise<{ success: boolean }> {
    await supabaseAdmin
      .from('ew_aspirasi')
      .update({ status_tindak_lanjut: status, tanggapan: tanggapan || null })
      .eq('id', id);
    return { success: true };
  },

  // 5. Work Programs (CRUD)
  async saveProgram(program: Partial<ProgramKerja>): Promise<{ success: boolean; id?: string }> {
    const id = program.id || `prog-${Date.now()}`;
    await supabaseAdmin.from('ew_program_kerja').upsert([{
      id,
      site_id: program.site_id,
      judul: program.judul,
      deskripsi: program.deskripsi,
      kategori_isu: program.kategori_isu || 'Umum',
      target: program.target,
      progress_persen: program.progress_persen || 0,
      status: program.status || 'BERJALAN',
      urutan: program.urutan || 0,
    }]);
    return { success: true, id };
  },

  async deleteProgram(id: string): Promise<{ success: boolean }> {
    await supabaseAdmin.from('ew_program_kerja').delete().eq('id', id);
    return { success: true };
  },

  // 6. News Posts (CRUD)
  async saveNews(news: Partial<NewsPost>): Promise<{ success: boolean; id?: string }> {
    const id = news.id || `news-${Date.now()}`;
    const slug = news.slug || news.judul?.toLowerCase().replace(/[^a-z0-9]/g, '-') || `news-${Date.now()}`;
    
    // Determine intelligent default Indonesian thumbnail if none provided
    let coverUrl = news.cover_image_url;
    if (!coverUrl) {
      const text = `${news.judul || ''} ${news.kategori || ''}`.toLowerCase();
      if (text.includes('solar') || text.includes('nelayan') || text.includes('maritim') || text.includes('laut') || text.includes('pesisir')) {
        coverUrl = '/images/articles/solar-subsidi-nelayan.webp';
      } else if (text.includes('umkm') || text.includes('pasar') || text.includes('ekonomi') || text.includes('usaha') || text.includes('halal')) {
        coverUrl = '/images/articles/umkm-pelatihan.webp';
      } else if (text.includes('guru') || text.includes('pendidikan') || text.includes('sekolah') || text.includes('paud')) {
        coverUrl = '/images/articles/pendidikan-guru.webp';
      } else {
        coverUrl = '/images/articles/aspirasi-pesisir.webp';
      }
    }

    await supabaseAdmin.from('ew_news_posts').upsert([{
      id,
      site_id: news.site_id,
      judul: news.judul,
      slug,
      ringkasan: news.ringkasan,
      isi: news.isi,
      cover_image_url: coverUrl,
      kategori: news.kategori || 'Kegiatan Lapangan',
      status: news.status || 'published',
      views_count: news.views_count || 0,
      tanggal_publish: news.tanggal_publish || new Date().toISOString(),
    }]);
    return { success: true, id };
  },

  async deleteNews(id: string): Promise<{ success: boolean }> {
    await supabaseAdmin.from('ew_news_posts').delete().eq('id', id);
    return { success: true };
  },

  // 7. Gallery (CRUD)
  async saveGalleryItem(item: Partial<GalleryItem>): Promise<{ success: boolean; id?: string }> {
    const id = item.id || `gal-${Date.now()}`;
    await supabaseAdmin.from('ew_gallery_items').upsert([{
      id,
      site_id: item.site_id,
      judul: item.judul,
      caption: item.caption,
      tipe: item.tipe || 'image',
      media_url: item.media_url,
      kategori_acara: item.kategori_acara || 'Sosialisasi',
      tanggal: item.tanggal || new Date().toISOString().split('T')[0],
    }]);
    return { success: true, id };
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    await supabaseAdmin.from('ew_gallery_items').delete().eq('id', id);
    return { success: true };
  },

  // 8. Member Profile (Update)
  async updateProfile(siteId: string, updates: Partial<MemberProfile>): Promise<{ success: boolean }> {
    await supabaseAdmin
      .from('ew_profiles_member')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('site_id', siteId);
    return { success: true };
  },

  // 9. AI Writing Settings
  async getAIWritingSettings(siteId?: string): Promise<AIWritingSettings> {
    // Check site-specific override first
    if (siteId) {
      const { data: siteSetting } = await supabaseAdmin
        .from('ew_ai_writing_settings')
        .select('*')
        .eq('site_id', siteId)
        .single();
      if (siteSetting) return siteSetting;
    }

    // Fallback to global
    const { data: globalSetting } = await supabaseAdmin
      .from('ew_ai_writing_settings')
      .select('*')
      .is('site_id', null)
      .single();

    return globalSetting || {
      id: 'ai-global-settings',
      site_id: null,
      tone: 'Otoritatif, Hangat, Merakyat, Berbasis Solusi Nyata',
      sudut_pandang: 'orang_pertama',
      panjang: 'menengah',
      penekanan_isu: ['Pemberdayaan Nelayan & Pesisir', 'Aspirasi Warga', 'Kesejahteraan Kepulauan'],
      larangan_kata: ['fitnah', 'kampanye hitam', 'data fiktif', 'janji palsu'],
    };
  },

  async saveAIWritingSettings(settings: Partial<AIWritingSettings>): Promise<{ success: boolean }> {
    const id = settings.id || `ai-set-${Date.now()}`;
    await supabaseAdmin.from('ew_ai_writing_settings').upsert([{
      id,
      site_id: settings.site_id || null,
      tone: settings.tone,
      sudut_pandang: settings.sudut_pandang,
      panjang: settings.panjang,
      penekanan_isu: settings.penekanan_isu,
      larangan_kata: settings.larangan_kata,
      updated_at: new Date().toISOString(),
    }]);
    return { success: true };
  },

  // 10. AI Raw Content Inputs & Jobs
  async createContentInput(input: Partial<ContentInput>): Promise<{ success: boolean; id: string }> {
    const id = `inp-${Date.now()}`;
    await supabaseAdmin.from('ew_content_inputs').insert([{
      id,
      site_id: input.site_id,
      kategori: input.kategori || 'Kegiatan Lapangan',
      tanggal_kegiatan: input.tanggal_kegiatan || new Date().toISOString().split('T')[0],
      poin_kegiatan: input.poin_kegiatan,
      media_urls: input.media_urls || [],
      status: 'raw',
      created_by: input.created_by,
      created_at: new Date().toISOString(),
    }]);
    return { success: true, id };
  },

  async getContentInputs(siteId: string): Promise<ContentInput[]> {
    const { data } = await supabaseAdmin
      .from('ew_content_inputs')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async saveContentJob(job: Partial<ContentJob>): Promise<{ success: boolean; id: string }> {
    const id = job.id || `job-${Date.now()}`;
    await supabaseAdmin.from('ew_content_jobs').upsert([{
      id,
      content_input_id: job.content_input_id || null,
      site_id: job.site_id,
      jenis_konten: job.jenis_konten || 'berita',
      status: job.status || 'draft',
      draft_title: job.draft_title,
      draft_body: job.draft_body,
      reviewed_by: job.reviewed_by,
      published_at: job.published_at,
      created_at: new Date().toISOString(),
    }]);
    return { success: true, id };
  },

  async getContentJobs(siteId: string): Promise<ContentJob[]> {
    const { data } = await supabaseAdmin
      .from('ew_content_jobs')
      .select('*')
      .eq('site_id', siteId)
      .order('created_at', { ascending: false });
    return data || [];
  },

  async publishJobToContent(jobId: string, reviewedBy: string): Promise<{ success: boolean; error?: string }> {
    const { data: job } = await supabaseAdmin.from('ew_content_jobs').select('*').eq('id', jobId).single();
    if (!job) return { success: false, error: 'Job tidak ditemukan' };

    if (job.jenis_konten === 'berita') {
      await this.saveNews({
        site_id: job.site_id,
        judul: job.draft_title || 'Rilis Berita Kegiatan Lapangan',
        ringkasan: job.draft_body.slice(0, 160) + '...',
        isi: job.draft_body,
        status: 'published',
      });
    }

    // Mark job as published
    await supabaseAdmin
      .from('ew_content_jobs')
      .update({ status: 'published', reviewed_by: reviewedBy, published_at: new Date().toISOString() })
      .eq('id', jobId);

    if (job.content_input_id) {
      await supabaseAdmin
        .from('ew_content_inputs')
        .update({ status: 'processed' })
        .eq('id', job.content_input_id);
    }

    return { success: true };
  },

  // 11. Cross-Site Analytics
  async getCrossSiteAnalytics() {
    const [sitesRes, newsRes, aspirasiRes] = await Promise.all([
      supabaseAdmin.from('ew_sites').select('id, nama_anggota, slug, status'),
      supabaseAdmin.from('ew_news_posts').select('id, site_id, views_count'),
      supabaseAdmin.from('ew_aspirasi').select('id, site_id, status_tindak_lanjut'),
    ]);

    const totalSites = sitesRes.data?.length || 0;
    const totalViews = newsRes.data?.reduce((acc, curr) => acc + (curr.views_count || 0), 0) || 0;
    const totalAspirasi = aspirasiRes.data?.length || 0;
    const pendingAspirasi = aspirasiRes.data?.filter((a) => a.status_tindak_lanjut === 'pending').length || 0;

    const perSiteStats = (sitesRes.data || []).map((s) => {
      const siteViews = newsRes.data?.filter((n) => n.site_id === s.id).reduce((acc, c) => acc + c.views_count, 0) || 0;
      const siteAspirations = aspirasiRes.data?.filter((a) => a.site_id === s.id) || [];
      return {
        id: s.id,
        nama: s.nama_anggota,
        slug: s.slug,
        views: siteViews,
        aspirasiTotal: siteAspirations.length,
        aspirasiPending: siteAspirations.filter((a) => a.status_tindak_lanjut === 'pending').length,
      };
    });

    return {
      totalSites,
      totalViews,
      totalAspirasi,
      pendingAspirasi,
      perSiteStats,
    };
  },

  // 12. Sentiment Intelligence from Elang Sentimen
  async getSentimentIssues(): Promise<SentimentIssue[]> {
    const { data: dbTopics } = await supabaseAdmin
      .from('trending_topics')
      .select('*')
      .order('burst_ratio', { ascending: false })
      .limit(10);

    const enrichments: Record<string, Partial<SentimentIssue>> = {
      'Kontroversi Pemblokiran & Pengawasan Ruang Digital Komdigi': {
        dominant_sentiment: 'negatif',
        sentiment_score: -0.68,
        summary: 'Masyarakat dan kreator digital mengkritisi pemblokiran platform produktif serta menuntut transparansi pemberantasan judi online.',
        recommended_angle: 'Tegaskan perlunya tata kelola ruang digital yang transparan dan proteksi kebebasan berkarya pelaku ekonomi kreatif.',
        suggested_points: [
          'Kader Partai Elang menerima banyak aspirasi keresahan pelaku industri digital dan UMKM terkait ketidakpastian regulasi internet.',
          'Pemberantasan judi online dan kejahatan siber harus berorientasi pada otak pelaku kriminal, bukan merugikan akses platform produktif publik.',
          'Mendorong dibukanya forum dengar pendapat terbuka antara kementerian, asosiasi pengembang, dan masyarakat sipil.'
        ],
        sample_headlines: [
          'Demo Ruang Digital: Publik Tuntut Evaluasi Kebijakan Pemblokiran',
          'Pakar IT Nilai Kebijakan Komdigi Kurang Melibatkan Komunitas Kreatif'
        ]
      },
      'Kebijakan Kenaikan Pajak PPN 12% & Daya Beli Rakyat': {
        dominant_sentiment: 'negatif',
        sentiment_score: -0.74,
        summary: 'Keresahan luas terhadap potensi lonjakan harga barang kebutuhan yang dapat semakin menekan daya beli kelas menengah dan masyarakat berpenghasilan rendah.',
        recommended_angle: 'Perjuangkan perlindungan daya beli rakyat kecil, pembebasan PPN sembako, dan insentif modal bagi UMKM.',
        suggested_points: [
          'Partai Elang menyuarakan penolakan terhadap pembebanan pajak konsumsi yang tidak proporsional bagi rakyat kecil.',
          'Memperjuangkan perluasan daftar komoditas pangan pokok, obat-obatan, dan layanan pendidikan bebas PPN.',
          'Menyarankan optimalisasi penerimaan negara melalui reformasi kebocoran ekspor SDA ketimbang memungut pajak berlebih dari konsumsi harian rakyat.'
        ],
        sample_headlines: [
          'Rencana PPN 12% Tuai Polemik: Daya Beli Konsumen Jadi Taruhan',
          'Asosiasi Pedagang Pasar Khawatir Penjualan Anjlok Akibat Tekanan Pajak'
        ]
      },
      'Kestabilan Pasokan Solar Subsidi & Perlindungan Nelayan Pesisir': {
        dominant_sentiment: 'negatif',
        sentiment_score: -0.62,
        summary: 'Nelayan tradisional di berbagai kepulauan mengeluhkan keterbatasan kuota BBM subsidi solar dan antrean panjang di SPBUN.',
        recommended_angle: 'Desak digitalisasi distribusi kuota solar langsung ke nelayan dan penindakan tegas mafia penimbun BBM.',
        suggested_points: [
          'Menindaklanjuti temuan lapangan relawan Partai Elang di Kepulauan Riau perihal antrean BBM nelayan yang menghambat hari melaut.',
          'Mendesak pemerintah daerah dan BPH Migas mengalokasikan kuota solar darurat menjelang musim angin utara.',
          'Menuntut sanksi pidana terberat bagi spekulan industri yang menyerobot jatah solar subsidi nelayan tradisional.'
        ],
        sample_headlines: [
          'Ratusan Nelayan Terkendala Melaut Akibat Kelangkaan Solar Subsidi',
          'Desakan Audit SPBUN Pesisir Menguat dari Berbagai Komunitas Maritim'
        ]
      },
      'Program Makan Bergizi Gratis (MBG) & Ketahanan Pangan Anak': {
        dominant_sentiment: 'positif',
        sentiment_score: 0.65,
        summary: 'Antusiasme tinggi terhadap bantuan pemenuhan nutrisi anak sekolah, dengan catatan pengawasan higienitas dan pelibatan dapur lokal.',
        recommended_angle: 'Dukung program nutrisi generasi emas sekaligus berdayakan petani, nelayan, dan UMKM katering lokal.',
        suggested_points: [
          'Partai Elang mengawal penuh implementasi MBG agar bahan baku wajib diserap dari petani dan nelayan sekitar sekolah.',
          'Membentuk posko pengawasan kader untuk memantau higienitas makanan agar tidak terjadi kasus keracunan pangan.',
          'Memastikan menu makanan mencakup ikan laut segar dan hasil bumi nusantara berkualitas tinggi.'
        ],
        sample_headlines: [
          'Uji Coba MBG di Sekolah Dasar Dinilai Efektif Tingkatkan Fokus Belajar Siswa',
          'Orang Tua Sambut Positif MBG, Harapkan Standar Gizi Terus Dipertahankan'
        ]
      },
      'Penegakan Integritas & RUU Perampasan Aset Korupsi': {
        dominant_sentiment: 'positif',
        sentiment_score: 0.81,
        summary: 'Harapan publik sangat tinggi agar RUU Perampasan Aset segera diundangkan untuk memiskinkan koruptor dan mengembalikan uang negara.',
        recommended_angle: 'Sikap tanpa kompromi Partai Elang: berdiri bersama rakyat memperjuangkan pengesahan RUU Perampasan Aset.',
        suggested_points: [
          'Kader Partai Elang menegaskan komitmen nol toleransi terhadap tindak pidana korupsi di seluruh tingkatan pemerintahan.',
          'Mendorong percepatan pembahasan RUU Perampasan Aset tanpa melemahkan instrumen pembuktian terbalik.',
          'Aset rampasan korupsi harus dikembalikan secara transparan untuk membiayai fasilitas pendidikan dan kesehatan gratis.'
        ],
        sample_headlines: [
          'Koalisi Masyarakat Sipil Tagih Komitmen Parlemen Soal RUU Perampasan Aset',
          'Survei Sentimen Publik: 92% Responden Dukung Penyitaan Aset Pelaku Korupsi'
        ]
      },
      'Diplomasi Luar Negeri, KTT Internasional & Investasi RI-China': {
        dominant_sentiment: 'positif',
        sentiment_score: 0.58,
        summary: 'Dukungan terhadap peluang investasi bilateral namun masyarakat menuntut perlindungan pekerja domestik dan keberlanjutan ekosistem.',
        recommended_angle: 'Kawal kerja sama ekonomi global agar memberi nilai tambah bagi daerah dan menyerap tenaga kerja lokal.',
        suggested_points: [
          'Menyambut baik kerja sama ekonomi internasional selama menjunjung tinggi kedaulatan bangsa dan prinsip kesetaraan.',
          'Menuntut klausul wajib transfer teknologi dan penyerapan sekurang-kurangnya 85% tenaga kerja dari masyarakat lokal.',
          'Menolak segala bentuk eksploitasi lingkungan tanpa AMDAL ketat dan jaminan reklamasi pascatambang/industri.'
        ],
        sample_headlines: [
          'Pemerintah Sepakati Komitmen Investasi Baru di Forum KTT Multilateral',
          'Pelaku Usaha Harapkan Kerja Sama Bilateral Buka Pintu Ekspor Produk Nusantara'
        ]
      }
    };

    // If dbTopics exists, map and merge
    const seenTopics = new Set<string>();
    const result: SentimentIssue[] = [];

    if (dbTopics && dbTopics.length > 0) {
      for (const t of dbTopics) {
        if (seenTopics.has(t.topic)) continue;
        seenTopics.add(t.topic);

        const enrich = enrichments[t.topic] || {
          dominant_sentiment: (t.burst_ratio > 3 ? 'negatif' : 'netral') as any,
          sentiment_score: t.burst_ratio > 3 ? -0.5 : 0.2,
          summary: `Isu "${t.topic}" mengalami lonjakan perbincangan publik dengan rasio ledakan ${t.burst_ratio}x di ranah media.`,
          recommended_angle: 'Tunjukkan empati dan kehadiran kader Partai Elang dalam merespons dinamika yang berkembang.',
          suggested_points: [
            `Menanggapi lonjakan perhatian publik terhadap isu ${t.topic}.`,
            'Partai Elang menekankan pentingnya solusi nyata yang berkeadilan bagi seluruh lapisan masyarakat.',
            'Kader diimbau menyerap aspirasi warga secara langsung dan mengedepankan dialog konstruktif.'
          ],
          sample_headlines: [
            `Sorotan Publik Meningkat Signifikan Terkait ${t.topic}`,
            `Analisis Sentimen: Isu ${t.topic} Menjadi Diskusi Hangat di Ruang Publik`
          ]
        };

        result.push({
          id: t.id,
          topic: t.topic,
          region: t.region || 'Nasional',
          date: t.date || new Date().toISOString().split('T')[0],
          mention_count: t.mention_count || 10,
          burst_ratio: t.burst_ratio || 1.5,
          dominant_sentiment: enrich.dominant_sentiment || 'netral',
          sentiment_score: enrich.sentiment_score || 0,
          summary: enrich.summary || '',
          recommended_angle: enrich.recommended_angle || '',
          suggested_points: enrich.suggested_points || [],
          sample_headlines: enrich.sample_headlines || [],
        });
      }
    }

    // Also include curated priority issues if not already present
    for (const [topicName, enrich] of Object.entries(enrichments)) {
      if (!seenTopics.has(topicName)) {
        result.push({
          id: `issue-${Math.abs(topicName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0))}`,
          topic: topicName,
          region: 'Nasional',
          date: new Date().toISOString().split('T')[0],
          mention_count: Math.floor(Math.random() * 30) + 25,
          burst_ratio: parseFloat((Math.random() * 5 + 3).toFixed(1)),
          dominant_sentiment: enrich.dominant_sentiment || 'netral',
          sentiment_score: enrich.sentiment_score || 0,
          summary: enrich.summary || '',
          recommended_angle: enrich.recommended_angle || '',
          suggested_points: enrich.suggested_points || [],
          sample_headlines: enrich.sample_headlines || [],
        });
      }
    }

    return result.sort((a, b) => b.mention_count - a.mention_count);
  },
};
