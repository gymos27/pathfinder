'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, 
  GraduationCap, 
  Briefcase, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserType } from '@/types/user';

export default function SignupPage() {
  const router = useRouter();
  const { signUp, isSupabaseActive } = useAuth();

  const [userType, setUserType] = useState<UserType>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await signUp(email, password, { userType });

      if (res.error) {
        setError(res.error);
        setIsLoading(false);
        return;
      }

      router.push(`/onboarding?type=${userType}`);
    } catch (err: unknown) {
      console.error(err);
      setError('An unexpected error occurred during signup.');
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
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Start your personalized journey with tailored curriculums and AI coaching.
          </p>

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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* User Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                I am signing up as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    userType === 'student'
                      ? 'bg-white/10 border-white ring-2 ring-white/25'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <GraduationCap className={`w-4 h-4 ${userType === 'student' ? 'text-white' : 'text-neutral-400'}`} />
                    {userType === 'student' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Student</div>
                    <div className="text-[10px] text-neutral-400">Beginner / Learner</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('professional')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    userType === 'professional'
                      ? 'bg-white/10 border-white ring-2 ring-white/25'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Briefcase className={`w-4 h-4 ${userType === 'professional' ? 'text-white' : 'text-neutral-400'}`} />
                    {userType === 'professional' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Professional</div>
                    <div className="text-[10px] text-neutral-400">Working / Upskilling</div>
                  </div>
                </button>
              </div>
            </div>

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
                  placeholder="At least 6 characters"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
                  required
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Continue to Onboarding</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-white hover:underline font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
