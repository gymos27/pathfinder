'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Compass, 
  Sparkles, 
  Map, 
  BookOpen, 
  CheckCircle2, 
  LogOut, 
  GraduationCap, 
  Briefcase,
  LogIn
} from 'lucide-react';
import { getStoredProgress } from '@/lib/storage';
import { ProgressState } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [progress, setProgress] = useState<ProgressState | null>(null);

  const loadProgress = () => {
    setProgress(getStoredProgress());
  };

  useEffect(() => {
    loadProgress();
    const handleProgressUpdate = () => loadProgress();
    window.addEventListener('pathfinder_progress_updated', handleProgressUpdate);
    return () => {
      window.removeEventListener('pathfinder_progress_updated', handleProgressUpdate);
    };
  }, []);

  const completedCount = progress ? Object.keys(progress.completedSkills).length : 0;

  const navLinks = [
    { href: '/domains', label: 'Domains', icon: BookOpen },
    { href: '/my-path', label: 'My Path', icon: Map, badge: completedCount > 0 ? `${completedCount}` : undefined },
    { href: '/ai-tools', label: 'AI Suite', icon: Sparkles, glow: true },
  ];

  const userType = profile?.userType || user?.userType || 'student';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-white/25 via-white/10 to-transparent p-[1px] shadow-lg shadow-black/80 group-hover:from-white/40 transition-all">
            <div className="w-full h-full bg-[#0d0d10] rounded-[11px] flex items-center justify-center border border-white/10">
              <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-neutral-200 transition-colors">
                Path<span className="text-neutral-400 font-light">Finder</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/15">
                v2.0 AI
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block -mt-0.5">Career & Skills Navigator</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/15 shadow-sm border border-white/20'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white border border-white/30 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {link.badge}
                  </span>
                )}
                {link.glow && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Auth / Profile Controls */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="flex items-center gap-2">
              {/* Profile Chip */}
              <Link
                href="/onboarding"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 transition-all text-xs text-neutral-200"
                title="Edit Career Profile"
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  {userType === 'professional' ? (
                    <Briefcase className="w-3.5 h-3.5" />
                  ) : (
                    <GraduationCap className="w-3.5 h-3.5" />
                  )}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="font-semibold text-white text-xs leading-none">
                    {userType === 'professional' ? 'Pro Track' : 'Student Track'}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
              </Link>

              {/* Sign out button */}
              <button
                type="button"
                onClick={() => signOut()}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 hover:text-white border border-white/15 transition-all"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 border border-transparent transition-all flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-xl glossy-btn-white text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-neutral-900" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {/* Quick streak pill */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/15 text-white text-xs font-semibold font-mono">
            <span>🔥 Day 1</span>
          </div>
        </div>
      </div>
    </header>
  );
}
