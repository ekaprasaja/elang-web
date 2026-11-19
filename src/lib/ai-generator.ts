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
    const isPublicIssue = category.toLowerCase().includes('isu') || category.toLowerCase().includes('sikap') || category.toLowerCase().includes('sentimen');
    
    let title = '';
    if (isPublicIssue) {
      title = lines.length > 0 && lines[0].length < 75
        ? `Sikap Resmi Partai Elang: ${lines[0]}`
        : `Merespons Dinamika Publik: ${memberName} Tegaskan Keberpihakan pada Rakyat`;
    } else {
      title = lines.length > 0 && lines[0].length < 80
        ? `${lines[0]} — Komitmen Nyata ${memberName}`
        : `Serap Aspirasi di ${category}: ${memberName} Tegaskan Solusi Nyata untuk Rakyat`;
    }

    const paragraphs: string[] = [];

    // Lead paragraph
    if (isPublicIssue) {
      paragraphs.push(
        `JAKARTA / DAERAH PEMILIHAN — Merespons dinamika perbincangan publik dan temuan radar sentimen media listening, kader penggerak Partai Elang, ${memberName}, menyampaikan pandangan dan sikap politik resmi per ${date}. Langkah ini merupakan wujud responsivitas partai dalam mengawal aspirasi masyarakat agar mendapat perhatian konkret dari pemangku kebijakan.`
      );
    } else {
      paragraphs.push(
        `DAERAH PEMILIHAN — Melanjutkan agenda kerja kemasyarakatan yang konsisten, ${verbVisit} warga dalam agenda "${category}" pada ${date}. Kegiatan ini diselenggarakan guna mendengarkan secara langsung denyut persoalan riil yang dihadapi masyarakat di akar rumput.`
      );
    }

    // Body elaboration strictly from points without hallucinations
    if (lines.length > 1) {
      paragraphs.push(
        isPublicIssue
          ? `Adapun poin-poin pokok sikap dan argumentasi kebijakan yang ditekankan antara lain:\n\n${lines
              .map((line, idx) => `• ${line}`)
              .join('\n')}`
          : `Dalam pertemuan tersebut, beberapa catatan utama dan aspirasi warga yang mengemuka antara lain:\n\n${lines
              .map((line, idx) => `• ${line}`)
              .join('\n')}`
      );
    } else {
      paragraphs.push(
        `Fokus utama dalam pembahasan ini terpusat pada ${firstPoint}. Sikap tegas dan solutif ini diharapkan mampu mengurai kebuntuan serta memberikan rasa keadilan bagi masyarakat terdampak.`
      );
    }

    // Closing statement reflecting party alignment
    const emphasis = settings.penekanan_isu.join(', ');
    paragraphs.push(
      `"Amanah pengabdian di Partai Elang adalah bekerja dengan hati, memperkokoh nasionalisme, dan menghadirkan dampak nyata yang dirasakan langsung oleh rakyat. Selaras dengan visi perubahan dan komitmen 'Bersama, Kita Bisa!', aspirasi warga terkait ${emphasis} menjadi prioritas aksi nyata kami," pungkas ${memberName}.`
    );

    return {
      title,
      body: paragraphs.join('\n\n'),
    };
  } else if (contentType === 'caption') {
    const title = `Dokumentasi: ${category} - ${date}`;
    const body = `${verbVisit} warga dalam rangka ${category}.\n\nRingkasan kegiatan:\n${lines
      .map((l) => `✔️ ${l}`)
      .join('\n')}\n\nBersama Partai Elang, kita satukan semangat untuk perubahan dan keadilan sosial bagi seluruh rakyat! Bersama, Kita Bisa! 🦅\n\n#PartaiElang #GerakanPolitikKebangsaan #BersamaKitaBisa #UntukIndonesia #${memberName.replace(/[^a-zA-Z]/g, '')}`;

    return { title, body };
  } else if (contentType === 'progress') {
    const title = `Laporan Progres Kerja: ${category}`;
    const body = `Per ${date}, pemantauan lapangan terhadap program kerja "${category}" mencatat capaian dan langkah konkret sebagai berikut:\n\n${lines
      .map((l, i) => `${i + 1}. ${l}`)
      .join('\n')}\n\nEvaluasi berkala terus dilakukan untuk memastikan setiap realisasi program selaras dengan misi mewujudkan ekonomi kerakyatan yang berkeadilan dan kesejahteraan masyarakat.`;

    return { title, body };
  } else {
    // Bio
    const title = `Biografi Ringkas: ${memberName}`;
    const body = `${memberName} adalah kader patriot bangsa yang mendedikasikan kiprahnya untuk kemajuan rakyat melalui Partai Elang (Gerakan Politik Kebangsaan Untuk Indonesia).\n\nRiwayat dan rekam jejak perjuangan beliau berakar pada komitmen melayani rakyat di bidang ${settings.penekanan_isu.join(
      ', '
    )}. Dengan semangat nasionalisme, kerakyatan, dan keadilan sosial, beliau siap menyingsingkan lengan baju menghadirkan solusi nyata demi terwujudnya cita-cita perubahan Indonesia.`;

    return { title, body };
  }
}
