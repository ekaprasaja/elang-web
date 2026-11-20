import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email dan kata sandi wajib diisi.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Verifikasi melalui Tabel Sentral SSO
    const { data: ssoUser, error: ssoErr } = await supabaseAdmin
      .from('sso_users')
      .select('*')
      .ilike('email', cleanEmail)
      .maybeSingle();

    if (!ssoUser || ssoUser.password_hash !== password) {
      return NextResponse.json({ error: 'Email atau kata sandi tidak valid.' }, { status: 401 });
    }

    if (ssoUser.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Akun Anda telah dinonaktifkan oleh Super Admin.' }, { status: 403 });
    }

    // 2. PENEGAKAN IZIN APLIKASI: Harus memiliki 'web' atau merupakan Super Admin
    const isAllowed = ssoUser.is_super_admin || (Array.isArray(ssoUser.allowed_apps) && ssoUser.allowed_apps.includes('web'));
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: 'Akses Ditolak: Akun Anda tidak memiliki izin untuk mengakses CMS Portal Elang Web. Izin hanya dapat diberikan oleh Super Admin Pusat Partai Elang.',
          forbidden: true,
        },
        { status: 403 }
      );
    }

    // Update last login
    await supabaseAdmin
      .from('sso_users')
      .update({ last_login_at: new Date().toISOString(), last_login_app: 'web' })
      .eq('id', ssoUser.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: ssoUser.id,
        email: ssoUser.email,
        name: ssoUser.name,
        isSuperAdmin: ssoUser.is_super_admin,
        allowedApps: ssoUser.allowed_apps,
      },
    });

    response.cookies.set('ew_admin_session', 'authenticated', {
      path: '/',
      httpOnly: false,
      maxAge: 86400 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem' }, { status: 500 });
  }
}
