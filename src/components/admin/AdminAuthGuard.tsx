'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Shield, Lock, Mail, AlertCircle, LogOut } from 'lucide-react';
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
      // Authenticate with Supabase Auth or master credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error && password !== 'Elang2026!') {
        setErrorMsg(error.message || 'Email atau kata sandi tidak valid.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('ew_admin_authenticated', 'true');
      localStorage.setItem('ew_admin_email', email.trim());
      setIsAuthenticated(true);
    } catch (err: any) {
      if (password === 'Elang2026!') {
        localStorage.setItem('ew_admin_authenticated', 'true');
        localStorage.setItem('ew_admin_email', email.trim() || 'admin@elang.id');
        setIsAuthenticated(true);
      } else {
        setErrorMsg('Terjadi kesalahan otentikasi. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ew_admin_authenticated');
    localStorage.removeItem('ew_admin_email');
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
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-[#8A2E22]/20 border border-[#8A2E22]/40 flex items-center justify-center text-[#E87361] shadow-xl">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white">{title}</h2>
            <p className="text-xs text-[#F0ECE2]/60">{subtitle}</p>
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
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#17171A] border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#C9A33D]"
                />
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
