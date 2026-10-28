'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2, 
  Key, 
  ListChecks,
  RefreshCw
} from 'lucide-react';
import { ResumeFeedbackResult } from '@/lib/gemini';

const SAMPLE_RESUME = `Alex Rivera
alex.rivera@email.com | github.com/arivera | linkedin.com/in/alexrivera

SUMMARY
Web developer with 2 years of experience building applications using JavaScript, HTML, CSS, and React. Passionate about creating responsive interfaces.

EXPERIENCE
Frontend Developer — TechPulse Solutions (2023 - Present)
• Worked on the frontend interface for customer-facing web applications.
• Responsible for building responsive UI components using React and styled-components.
• Assisted in fixing bugs in production and improved code quality.
• Collaborated with backend team to integrate REST APIs for user authentication and payments.

Junior Web Developer — Freelance (2022 - 2023)
• Built landing pages for local business clients using WordPress and HTML/CSS.
• Helped clients increase online visibility.
• Tested websites on different mobile devices to make sure they looked right.

SKILLS
JavaScript, React, HTML5, CSS3, Git, Node.js basics, REST APIs`;

export default function ResumeFeedbackTool() {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [domain, setDomain] = useState('Web Development');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResumeFeedbackResult | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handlePasteSample = () => {
    setResumeText(SAMPLE_RESUME);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resumeText.trim().length < 20) {
      setError('Please provide at least a few sentences of resume text.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/ai/resume-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole,
          domain,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: ResumeFeedbackResult = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Input Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/20">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">AI Resume Evaluator & STAR Rewriter</h2>
          </div>

          <button
            type="button"
            onClick={handlePasteSample}
            className="text-xs text-white hover:underline font-semibold px-2.5 py-1 rounded-lg bg-white/10 border border-white/20 transition-all flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Load Sample Resume</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 mb-6">
          Paste your resume text below to generate an ATS compatibility score, identify missing technical keywords, and transform passive job duties into quantified STAR impact bullets.
        </p>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full Stack Engineer, Cloud Architect..."
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-xs sm:text-sm text-white bg-black/90 border border-white/15"
              >
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                Resume Content (Text format)
              </label>
              <span className="text-[11px] text-neutral-400 font-mono">
                {resumeText.length} characters
              </span>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume sections (Summary, Experience, Projects, Skills)..."
              rows={8}
              className="w-full p-3.5 rounded-xl glass-input text-xs sm:text-sm text-white font-mono placeholder-neutral-500 resize-y"
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || resumeText.length < 20}
              className="px-6 py-3 rounded-xl glossy-btn-white disabled:opacity-50 text-sm transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Auditing Resume with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Audit Resume & Rewrite Bullets</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-white/[0.04] border border-white/20 text-neutral-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Structured Result Dashboard */}
      {result && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Badges Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Overall Score */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-white/30 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-white">{result.overallScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">/ 100</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-400">Overall Score</div>
                  <div className="text-sm font-bold text-white">Recruiter Appeal</div>
                </div>
              </div>

              {/* ATS Compatibility */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-white/30 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-white">{result.atsCompatibilityScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">/ 100</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-400">ATS Parsing</div>
                  <div className="text-sm font-bold text-white">Keyword Match</div>
                </div>
              </div>

              {/* Quantified Impact */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border-2 border-white/30 flex flex-col items-center justify-center font-mono">
                  <span className="text-xl font-black text-white">{result.impactScore}</span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">/ 100</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-400">STAR Metrics</div>
                  <div className="text-sm font-bold text-white">Impact Strength</div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/10">
              {result.summary}
            </p>
          </div>

          {/* Strengths & Weaknesses Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <h4 className="text-base font-bold text-white">Key Resume Strengths</h4>
              </div>
              <ul className="space-y-2.5">
                {result.keyStrengths.map((str, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-white" />
                <h4 className="text-base font-bold text-white">Critical Weaknesses to Address</h4>
              </div>
              <ul className="space-y-2.5">
                {result.criticalWeaknesses.map((weak, i) => (
                  <li key={i} className="text-xs text-neutral-300 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rewritten STAR Impact Bullets Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
            <div className="flex items-center gap-2.5 mb-2">
              <Sparkles className="w-5 h-5 text-white" />
              <h4 className="text-lg font-bold text-white">Rewritten High-Impact Bullets (STAR Method)</h4>
            </div>
            <p className="text-xs text-neutral-400 mb-6">
              Compare your original phrasing against hiring-grade bullets that demonstrate quantified engineering ROI.
            </p>

            <div className="space-y-4">
              {result.rewrittenBullets.map((bullet, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                  {/* Original */}
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1 font-mono">
                      Before (Passive):
                    </span>
                    <p className="text-xs text-neutral-400 font-mono italic">
                      &ldquo;{bullet.original}&rdquo;
                    </p>
                  </div>

                  {/* Improved */}
                  <div className="p-3.5 rounded-lg bg-white/[0.06] border border-white/25 relative group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-white font-mono">
                        After (Quantified STAR Impact):
                      </span>
                      <button
                        onClick={() => copyToClipboard(bullet.improved, idx)}
                        className="text-[11px] text-white hover:underline flex items-center gap-1 px-2.5 py-0.5 rounded bg-white/10 border border-white/20 transition-all"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-white" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-white font-medium">
                      • {bullet.improved}
                    </p>
                  </div>

                  <p className="text-[11px] text-neutral-400 pl-1 leading-relaxed">
                    💡 <strong className="text-neutral-300">Why it works:</strong> {bullet.improvementExplanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Keywords & Quick Fixes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <div className="glass-panel rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-4 h-4 text-white" />
                <h4 className="text-base font-bold text-white">Missing ATS Keywords</h4>
              </div>

              <div className="space-y-3">
                {result.missingKeywords.map((kw) => (
                  <div key={kw.keyword} className="p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-white">{kw.keyword}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono border border-white/10">
                        {kw.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-300">{kw.relevance}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Fix Checklist */}
            <div className="glass-panel rounded-2xl p-6 border border-white/15">
              <div className="flex items-center gap-2 mb-4">
                <ListChecks className="w-4 h-4 text-white" />
                <h4 className="text-base font-bold text-white">Actionable Fix Checklist</h4>
              </div>

              <div className="space-y-2.5">
                {result.quickFixChecklist.map((fix, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-white/10 text-white text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 border border-white/20">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-neutral-300">{fix.action}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded shrink-0 bg-white/10 text-white border border-white/15">
                      {fix.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
