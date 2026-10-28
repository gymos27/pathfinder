import React from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  MessageSquare, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import { getAllDomains } from '@/data/domains';
import DomainIcon from '@/components/DomainIcon';

export default function HomePage() {
  const domains = getAllDomains();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
        {/* Specular Ambient Glow Lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.06] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glossy-badge text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Theme: Career &amp; Skills Navigator • Powered by Gemini AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
            Master Tech Skills with a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
              Personalized
            </span>{' '}
            Weekly Action Plan
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            PathFinder filters the skills you already know, fast-tracks you to your exact stage, and schedules your remaining roadmap based on your real weekly availability.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glossy-btn-white text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Compass className="w-5 h-5 text-black" />
              <span>Build My Personalized Path</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/domains"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl glossy-btn-dark text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore 6 Tech Domains</span>
            </Link>
          </div>

          {/* Metrics ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-white/10 text-left">
            <div className="p-3">
              <div className="text-2xl font-black text-white font-mono">6 Domains</div>
              <div className="text-xs text-neutral-400">Web, AI, Cloud, Cyber & more</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-white font-mono">Adaptive</div>
              <div className="text-xs text-neutral-400">Filters known skills</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-white font-mono">Weekly Pace</div>
              <div className="text-xs text-neutral-400">Calculated from 5-40 hrs/wk</div>
            </div>
            <div className="p-3">
              <div className="text-2xl font-black text-white font-mono">3 AI Tools</div>
              <div className="text-xs text-neutral-400">Gap, Resume & Mock Interview</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Methodology Section */}
      <section className="py-16 border-y border-white/10 bg-black/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              The PathFinder Methodology
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              How Your Navigator Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 relative">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-bold text-sm font-mono flex items-center justify-center mb-4 border border-white/20">
                01
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Persona &amp; Skill Audit</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Choose between Student or Working Professional. Tag current skills and weekly hours.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/25 bg-white/[0.03] relative">
              <div className="w-10 h-10 rounded-xl bg-white text-black font-bold text-sm font-mono flex items-center justify-center mb-4 shadow-md">
                02
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Algorithmic Scheduling</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                The engine skips skills you already know, starts you directly at your stage, and schedules weekly batches.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 relative">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white font-bold text-sm font-mono flex items-center justify-center mb-4 border border-white/20">
                03
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Gemini AI Acceleration</h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Analyze skill gaps, transform resume bullets into quantified STAR statements, and conduct live mock interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Domains Showcase Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Validated Curricula
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                6 Industry Career Tracks
              </h2>
            </div>
            <Link
              href="/domains"
              className="text-xs font-bold text-white hover:underline flex items-center gap-1 group"
            >
              <span>View full catalog</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domains.map((domain) => (
              <Link
                key={domain.id}
                href={`/domains/${domain.slug}`}
                className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between border border-white/12 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                      <DomainIcon name={domain.icon} className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/15 text-neutral-300 font-mono">
                      {domain.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-neutral-200 transition-colors">
                    {domain.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {domain.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-300">
                  <span className="font-semibold text-white font-mono">{domain.averageSalary}</span>
                  <span className="text-neutral-400">{domain.stages.length} Stages • ~{domain.totalEstimatedHours}h</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools Feature Grid Section */}
      <section className="py-20 border-t border-white/10 bg-black/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Interactive Intelligence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-3">
              Full Suite of Gemini AI Career Tools
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Structured, actionable JSON outputs rendered as high-contrast glossy cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-4 border border-white/20">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Skill-Gap Analyzer</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Input target roles and existing skills. Gemini grades readiness % (0-100), flags critical missing must-haves, and schedules a 3-phase action plan.
                </p>
              </div>
              <Link
                href="/ai-tools?tool=skill-gap"
                className="text-xs font-bold text-white hover:underline flex items-center gap-1 group pt-2"
              >
                <span>Run Gap Analysis</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-4 border border-white/20">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Resume Evaluator &amp; Rewriter</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Paste resume text to get overall &amp; ATS compatibility scores, identify missing keywords, and get before-and-after STAR bullet rewrites.
                </p>
              </div>
              <Link
                href="/ai-tools?tool=resume"
                className="text-xs font-bold text-white hover:underline flex items-center gap-1 group pt-2"
              >
                <span>Audit My Resume</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="glass-panel rounded-2xl p-6 border border-white/12 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-4 border border-white/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Live 1-on-1 Mock Interview</h3>
                <p className="text-xs text-neutral-300 leading-relaxed mb-4">
                  Simulate real technical and behavioral interviews one question at a time. Receive instant scores (1-10), what you articulated well, and senior answer highlights.
                </p>
              </div>
              <Link
                href="/ai-tools?tool=mock-interview"
                className="text-xs font-bold text-white hover:underline flex items-center gap-1 group pt-2"
              >
                <span>Start Mock Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/20 text-center relative overflow-hidden">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mb-8 leading-relaxed">
              Configure your profile in 60 seconds and get your personalized weekly checklist and Gemini interview preparation today.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glossy-btn-white text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Launch Onboarding Wizard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
