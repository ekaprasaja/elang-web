import { NextRequest, NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';
import { generateContentWithGuardrails } from '@/lib/ai-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, memberName, category, date, rawPoints, contentType, autoPublish } = body;

    if (!siteId || !rawPoints) {
      return NextResponse.json({ error: 'Data siteId dan poin kegiatan wajib disertakan' }, { status: 400 });
    }

    // 1. Fetch AI writing settings (site override or fallback to global)
    const settings = await ewRepository.getAIWritingSettings(siteId);

    // 2. Save raw input to database
    const inputRes = await ewRepository.createContentInput({
      site_id: siteId,
      kategori: category || 'Kegiatan Lapangan',
      tanggal_kegiatan: date || new Date().toISOString().split('T')[0],
      poin_kegiatan: rawPoints,
    });

    // 3. Generate content with guardrails
    const generated = generateContentWithGuardrails({
      memberName: memberName || 'Kader Partai Elang',
      category: category || 'Kegiatan Lapangan',
      date: date || 'hari ini',
      rawPoints,
      settings,
      contentType: contentType || 'berita',
    });

    // 4. Save to content_jobs
    const jobRes = await ewRepository.saveContentJob({
      content_input_id: inputRes.id,
      site_id: siteId,
      jenis_konten: contentType || 'berita',
      status: autoPublish ? 'published' : 'draft',
      draft_title: generated.title,
      draft_body: generated.body,
    });

    // 5. If auto-publish is active, publish to actual news
    if (autoPublish) {
      await ewRepository.publishJobToContent(jobRes.id, 'AI Auto-Publish Engine');
    }

    return NextResponse.json({
      success: true,
      jobId: jobRes.id,
      title: generated.title,
      body: generated.body,
      status: autoPublish ? 'published' : 'draft',
      message: autoPublish
        ? 'Konten berhasil digenerate dan diterbitkan secara otomatis!'
        : 'Draft konten berhasil digenerate oleh AI dan menunggu review.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghasilkan konten' }, { status: 400 });
  }
}
