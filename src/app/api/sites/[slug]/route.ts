import { NextRequest, NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const siteData = await ewRepository.getMemberSiteFullData(slug);
    if (!siteData) {
      return NextResponse.json({ error: 'Situs anggota tidak ditemukan' }, { status: 404 });
    }
    return NextResponse.json(siteData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const site = await ewRepository.getSiteBySlug(slug);
    if (!site) {
      return NextResponse.json({ error: 'Situs tidak ditemukan' }, { status: 404 });
    }
    const body = await req.json();
    const result = await ewRepository.updateSite(site.id, body);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
