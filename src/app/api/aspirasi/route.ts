import { NextRequest, NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId') || undefined;
    const aspirasi = await ewRepository.getAspirations(siteId);
    return NextResponse.json({ aspirasi });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { site_id, nama_pengirim, no_hp, kategori_isu, isi_aspirasi, email } = body;

    if (!site_id || !nama_pengirim || !no_hp || !isi_aspirasi) {
      return NextResponse.json(
        { error: 'Nama, No. HP, dan Isi Aspirasi wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await ewRepository.createAspirasi({
      site_id,
      nama_pengirim,
      no_hp,
      kategori_isu: kategori_isu || 'Aspirasi Umum',
      isi_aspirasi,
      email,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: result.id, message: 'Aspirasi berhasil disampaikan ke Rumah Aspirasi!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, tanggapan } = body;
    if (!id || !status) {
      return NextResponse.json({ error: 'ID dan status wajib disertakan' }, { status: 400 });
    }
    const result = await ewRepository.updateAspirasiStatus(id, status, tanggapan);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
