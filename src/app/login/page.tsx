'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Loader2, 
  Database,
  Sparkles,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isSupabaseActive } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }
      router.push('/my-path');
    } catch (err: unknown) {
      console.error(err);
      setError('An unexpected error occurred during login.');
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (type: 'student' | 'pro') => {
    const demoEmail = type === 'student' ? 'student.demo@pathfinder.io' : 'pro.engineer@pathfinder.io';
    setEmail(demoEmail);
    setPassword('demopass123');
    setIsLoading(true);

    try {
      await signIn(demoEmail, 'demopass123');
      router.push('/my-path');
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-white/30 to-white/5 p-[1px] shadow-lg">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[11px] flex items-center justify-center border border-white/15">
                <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Path<span className="text-neutral-400 font-light">Finder</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Access your personalized learning roadmap and Gemini AI suite.
          </p>

          {/* Backend Status Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border border-white/15 bg-white/[0.04]">
            <Database className="w-3 h-3 text-white" />
            {isSupabaseActive ? (
              <span className="text-white font-semibold">● Supabase Backend Connected</span>
            ) : (
              <span className="text-neutral-300 font-semibold">⚡ Instant Demo Mode (Zero Setup)</span>
            )}
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          {/* Quick Demo Buttons for Hackathon Judges */}
          <div className="mb-6 p-3 rounded-xl bg-white/[0.03] border border-white/15">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Hackathon Demo Login:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('pro')}
                className="py-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5 text-white" />
                <span>Demo Pro</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
                  required
                />
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/20 text-neutral-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl glossy-btn-white text-sm transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-neutral-400">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-white hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
