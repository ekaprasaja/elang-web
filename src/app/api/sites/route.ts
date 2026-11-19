import { NextRequest, NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const sites = await ewRepository.getAllSites();
    return NextResponse.json({ sites });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await ewRepository.createSite(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
