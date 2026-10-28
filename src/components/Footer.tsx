import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black text-neutral-400 text-sm mt-auto pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Path<span className="text-neutral-400 font-light">Finder</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              An intelligent Career & Skills Navigator built for ambitious engineers and designers. Turn amorphous goals into weekly action plans powered by Gemini AI and Supabase.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1 font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                <Sparkles className="w-3 h-3 text-white" /> Gemini AI
              </span>
              <span>•</span>
              <span>Supabase Backend</span>
              <span>•</span>
              <span>Next.js App Router</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 font-mono">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/domains" className="hover:text-white transition-colors">Domains Catalog</Link>
              </li>
              <li>
                <Link href="/my-path" className="hover:text-white transition-colors">Personalized Roadmap</Link>
              </li>
              <li>
                <Link href="/ai-tools" className="hover:text-white transition-colors">AI Career Suite</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">Update Profile & Skills</Link>
              </li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3 font-mono">AI Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/ai-tools?tool=skill-gap" className="hover:text-white transition-colors">Skill-Gap Analyzer</Link>
              </li>
              <li>
                <Link href="/ai-tools?tool=resume" className="hover:text-white transition-colors">Resume Feedback & STAR</Link>
              </li>
              <li>
                <Link href="/ai-tools?tool=mock-interview" className="hover:text-white transition-colors">Live Mock Interview</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <div>
            © 2026 PathFinder. Career & Skills Navigator Hackathon Edition.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            Engineered with high-gloss luxury monochrome design
          </div>
        </div>
      </div>
    </footer>
  );
}
