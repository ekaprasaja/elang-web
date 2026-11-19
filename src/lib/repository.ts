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
    return data || [];
  },

  async getSiteBySlug(slug: string): Promise<Site | null> {
    const { data, error } = await supabaseAdmin
      .from('ew_sites')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return data;
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
      foto_resmi_url: siteData.foto_resmi_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
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
        party_name: 'Partai Elang Indonesia',
        party_tagline: 'Bersama Rakyat Mewujudkan Kedaulatan, Keadilan, dan Kemakmuran Maritim',
        logo_url: null,
        tentang_partai: 'Partai Elang adalah gerakan politik modern yang berakar pada semangat kedaulatan maritim.',
        visi_partai: 'Terwujudnya Indonesia yang berdaulat secara politik dan adil sosial.',
        misi_partai: ['Keadilan fiskal daerah kepulauan', 'Pemberdayaan nelayan & UMKM'],
        pusat_kontak: {
          alamat: 'Batam Centre, Kepulauan Riau',
          email: 'sekretariat@partaielang.id',
          telepon: '0778-456789',
        },
      };
    }
    return data;
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
    
    await supabaseAdmin.from('ew_news_posts').upsert([{
      id,
      site_id: news.site_id,
      judul: news.judul,
      slug,
      ringkasan: news.ringkasan,
      isi: news.isi,
      cover_image_url: news.cover_image_url,
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
};
