import { NextRequest, NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';

export async function GET(req: NextRequest) {
  try {
    const stats = await ewRepository.getCrossSiteAnalytics();
    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
