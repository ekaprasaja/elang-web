import { NextResponse } from 'next/server';
import { ewRepository } from '@/lib/repository';

export const revalidate = 60; // Cache 1 minute

export async function GET() {
  try {
    const issues = await ewRepository.getSentimentIssues();
    return NextResponse.json({ success: true, issues });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
