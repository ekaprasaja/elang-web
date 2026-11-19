import { AIWritingSettings } from '@/types';

interface GenerateContentParams {
  memberName: string;
  category: string;
  date: string;
  rawPoints: string;
  settings: AIWritingSettings;
  contentType: 'berita' | 'caption' | 'progress' | 'bio';
}

interface GenerateContentResult {
  title: string;
  body: string;
}

export function generateContentWithGuardrails(params: GenerateContentParams): GenerateContentResult {
  const { memberName, category, date, rawPoints, settings, contentType } = params;

  // Split raw points into clean lines
  const lines = rawPoints
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.replace(/^[-*•\d.]+\s*/, ''));

  const firstPoint = lines[0] || 'Kegiatan lapangan bersama masyarakat';
  const povText = settings.sudut_pandang === 'orang_pertama' ? 'saya' : memberName;
  const verbVisit = settings.sudut_pandang === 'orang_pertama' ? 'saya menghadiri dan menyapa' : `${memberName} turun langsung menyapa`;

  // Filter forbidden words
  for (const forbidden of settings.larangan_kata) {
    if (rawPoints.toLowerCase().includes(forbidden.toLowerCase())) {
      throw new Error(`Bahan mentah mengandung kata/isu yang dilarang oleh DPP Partai Elang: "${forbidden}"`);
    }
  }

  if (contentType === 'berita') {
    const title = lines.length > 0 && lines[0].length < 80
      ? `${lines[0]} — Komitmen Nyata ${memberName}`
      : `Serap Aspirasi di ${category}: ${memberName} Tegaskan Solusi Nyata untuk Rakyat`;

    const paragraphs: string[] = [];

    // Lead paragraph
    paragraphs.push(
      `KEPULAUAN RIAU — Melanjutkan agenda kerja kemasyarakatan yang konsisten, ${verbVisit} warga dalam agenda "${category}" pada ${date}. Kegiatan ini diselenggarakan guna mendengarkan secara langsung denyut persoalan riil yang dihadapi masyarakat di akar rumput.`
    );

    // Body elaboration strictly from points without hallucinations
    if (lines.length > 1) {
      paragraphs.push(
        `Dalam pertemuan tersebut, beberapa catatan utama dan aspirasi warga yang mengemuka antara lain:\n\n${lines
          .map((line, idx) => `• ${line}`)
          .join('\n')}`
      );
    } else {
      paragraphs.push(
        `Fokus utama dalam pertemuan ini terpusat pada ${firstPoint}. Masyarakat menyambut antusias kehadiran perwakilan yang bersedia hadir langsung di tengah-tengah lingkungan mereka tanpa sekat formalitas.`
      );
    }

    // Closing statement reflecting party alignment
    const emphasis = settings.penekanan_isu.join(', ');
    paragraphs.push(
      `"Amanah pengabdian di Partai Elang adalah bekerja dengan hati dan bukti nyata. Segala poin masukan yang disampaikan hari ini bukan sekadar dicatat, melainkan menjadi prioritas perjuangan kami di tingkat kebijakan, khususnya terkait ${emphasis}," pungkas ${memberName}.`
    );

    return {
      title,
      body: paragraphs.join('\n\n'),
    };
  } else if (contentType === 'caption') {
    const title = `Dokumentasi: ${category} - ${date}`;
    const body = `${verbVisit} warga dalam rangka ${category}.\n\nRingkasan kegiatan:\n${lines
      .map((l) => `✔️ ${l}`)
      .join('\n')}\n\nBersama Partai Elang, kita rawat harapan dan perjuangkan kedaulatan masyarakat pesisir! 🦅\n\n#PartaiElang #KerjaNyata #${memberName.replace(/[^a-zA-Z]/g, '')}`;

    return { title, body };
  } else if (contentType === 'progress') {
    const title = `Laporan Progres Kerja: ${category}`;
    const body = `Per ${date}, pemantauan lapangan terhadap program kerja "${category}" mencatat capaian dan langkah konkret sebagai berikut:\n\n${lines
      .map((l, i) => `${i + 1}. ${l}`)
      .join('\n')}\n\nEvaluasi berkala terus dilakukan untuk memastikan setiap realisasi program memberikan dampak optimal bagi kesejahteraan masyarakat penerima manfaat.`;

    return { title, body };
  } else {
    // Bio
    const title = `Biografi Ringkas: ${memberName}`;
    const body = `${memberName} adalah figur pengabdi yang mendedikasikan kiprahnya untuk kemajuan dan kedaulatan masyarakat Kepulauan Riau melalui Partai Elang.\n\nRiwayat dan rekam jejak perjuangan beliau berakar pada komitmen melayani rakyat di bidang ${settings.penekanan_isu.join(
      ', '
    )}. Dengan semangat integritas tinggi dan kepedulian maritim yang mendalam, beliau senantiasa hadir memperjuangkan aspirasi warga hingga ke pulau-pulau terdepan.`;

    return { title, body };
  }
}
