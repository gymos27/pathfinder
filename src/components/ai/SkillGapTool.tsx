'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Target, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Zap
} from 'lucide-react';
import TagInput from '@/components/TagInput';
import { getStoredProfile } from '@/lib/storage';
import { SkillGapAnalysisResult } from '@/lib/gemini';
import { POPULAR_SKILLS_BY_DOMAIN } from '@/data/domains';

export default function SkillGapTool() {
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [domain, setDomain] = useState('Web Development');
  const [level, setLevel] = useState('Intermediate');
  const [skills, setSkills] = useState<string[]>(['HTML', 'CSS', 'JavaScript', 'React']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SkillGapAnalysisResult | null>(null);

  useEffect(() => {
    const profile = getStoredProfile();
    if (profile) {
      if (profile.currentSkills && profile.currentSkills.length > 0) {
        setSkills(profile.currentSkills);
      }
      if (profile.level) {
        setLevel(profile.level);
      }
    }
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/skill-gap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          domain,
          experienceLevel: level,
          currentSkills: skills,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: SkillGapAnalysisResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze skill gap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Input Form Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/20">
            <Zap className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white">Skill-Gap Analyzer</h2>
        </div>
        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Compare your current technical competencies against live hiring criteria to uncover missing high-priority skills and a step-by-step action plan.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Role */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, AI Engineer..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white"
                required
              />
            </div>

            {/* Target Domain */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-black/90 border border-white/15"
              >
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Seniority Target
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm text-white bg-black/90 border border-white/15"
              >
                <option value="Junior">Junior / Entry-Level</option>
                <option value="Intermediate">Mid-Level (2-4 YOE)</option>
                <option value="Advanced">Senior / Lead (5+ YOE)</option>
              </select>
            </div>
          </div>

          {/* Current Skills Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Your Current Skills ({skills.length} listed)
            </label>
            <TagInput
              tags={skills}
              onChange={setSkills}
              suggestions={POPULAR_SKILLS_BY_DOMAIN['web-dev']}
              placeholder="Type your skills (e.g. React, Docker, Python) and press Enter..."
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl glossy-btn-white disabled:opacity-50 text-sm transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Synthesizing Industry Gap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Analyze My Skill Gap with Gemini</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/20 text-neutral-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Structured JSON Output Cards */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card 1: Executive Readiness Summary */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                  Target: {result.roleTitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  Role Readiness Assessment
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right font-mono">
                  <div className="text-[11px] text-neutral-400">Market Demand</div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
                    {result.marketDemand}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/30 flex flex-col items-center justify-center text-center shadow-lg font-mono">
                  <span className="text-xl font-black text-white">
                    {result.readinessScore}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold">Match</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/10">
              {result.summary}
            </p>
          </div>

          {/* Card 2: Critical Missing Skills vs Nice to Have */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Must-Haves */}
            <div className="glass-panel rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-white" />
                <h4 className="text-base font-bold text-white">Critical Missing Skills</h4>
              </div>

              <div className="space-y-3">
                {result.criticalMissingSkills.map((skill) => (
                  <div key={skill.name} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{skill.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-mono">
                        {skill.importance}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 mb-2 leading-relaxed">{skill.reason}</p>
                    <div className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>Estimated: {skill.estimatedTimeToLearn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nice to Have & Strengths */}
            <div className="glass-panel rounded-2xl p-6 border border-white/15 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-white" />
                  <h4 className="text-base font-bold text-white">High-Impact Differentiators</h4>
                </div>

                <div className="space-y-2.5">
                  {result.niceToHaveSkills.map((nth) => (
                    <div key={nth.name} className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="text-xs font-bold text-white mb-0.5">{nth.name}</div>
                      <div className="text-[11px] text-neutral-300 leading-relaxed">{nth.benefit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {result.strengthSkills.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <h4 className="text-sm font-bold text-white">Your Core Strengths</h4>
                  </div>
                  <div className="space-y-2">
                    {result.strengthSkills.map((st) => (
                      <div key={st.name} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
                        <div>
                          <strong className="text-white">{st.name}:</strong> {st.appliedInRole}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: 3-Phase Action Plan */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
            <div className="flex items-center gap-2.5 mb-4">
              <Calendar className="w-5 h-5 text-white" />
              <h4 className="text-lg font-bold text-white">Recommended Strategic Action Plan</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.actionPlan.map((plan, idx) => (
                <div key={plan.phase} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-white font-mono">Step {idx + 1}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300 border border-white/15">
                        {plan.timeframe}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2">{plan.phase}</h5>
                    <p className="text-xs text-neutral-300 mb-3 leading-relaxed">{plan.focus}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white font-medium">
                    🎯 Milestone: {plan.milestone}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
