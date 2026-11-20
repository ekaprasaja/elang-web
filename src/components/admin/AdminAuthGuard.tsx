'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Mail, AlertCircle, LogOut, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({
  children,
  title = 'Akses Terbatas Administrator',
  subtitle = 'Silakan masuk dengan kredensial resmi Partai Elang untuk mengelola sistem.',
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check local session
    const savedSession = localStorage.getItem('ew_admin_authenticated');
    if (savedSession === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // 1. Verifikasi izin melalui endpoint SSO Terpusat
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Email atau kata sandi tidak valid.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('ew_admin_authenticated', 'true');
      localStorage.setItem('ew_admin_email', email.trim());
      document.cookie = 'ew_admin_session=authenticated; Path=/; SameSite=Lax; Max-Age=86400; Secure';
      setIsAuthenticated(true);
    } catch (err: any) {
      setErrorMsg('Terjadi kesalahan otentikasi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ew_admin_authenticated');
    localStorage.removeItem('ew_admin_email');
    document.cookie = 'ew_admin_session=; Path=/; Max-Age=0; SameSite=Lax; Secure';
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C9A33D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1E1E24] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-900/90 border border-amber-500/30 p-2.5 mx-auto flex items-center justify-center shadow-xl shadow-black/50 mb-3 hover:border-amber-400/50 transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-transparent.webp"
                alt="Logo Partai Elang"
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[11px] font-semibold text-amber-300 mb-2.5 shadow-sm">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Sistem Resmi Partai Elang Indonesia</span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight">{title}</h2>
            <p className="text-xs text-[#F0ECE2]/60 mt-1 max-w-sm">{subtitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#F0ECE2]/70 uppercase">Email Petugas</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  placeholder="admin@elang.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#C9A33D]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#F0ECE2]/70 uppercase">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#C9A33D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C9A33D] hover:bg-[#d8b046] text-[#17171A] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#C9A33D]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-[#17171A] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Masuk Administrator</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <Link href="/" className="text-xs text-[#F0ECE2]/50 hover:text-white transition-colors">
              ← Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Admin Top Action Bar */}
      <div className="bg-[#1E1E24]/80 backdrop-blur-md border-b border-white/10 px-4 py-2 flex items-center justify-between text-xs mb-6 -mx-4 md:-mx-6 -mt-4 md:-mt-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-mono text-emerald-400 text-[11px] font-semibold">Sesi Admin Terverifikasi</span>
          <span className="text-[#F0ECE2]/40 hidden sm:inline">•</span>
          <span className="text-[#F0ECE2]/60 hidden sm:inline text-[11px]">
            {typeof window !== 'undefined' ? localStorage.getItem('ew_admin_email') || 'admin@elang.id' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#F0ECE2]/70 rounded-lg text-[11px] transition"
          >
            Web Publik
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 rounded-lg text-[11px] transition"
          >
            <LogOut className="w-3 h-3" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};
