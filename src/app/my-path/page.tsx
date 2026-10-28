'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Map, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Settings2, 
  ArrowRight, 
  FolderGit2, 
  RotateCcw, 
  BookOpen, 
  ExternalLink
} from 'lucide-react';
import { getStoredProfile, getStoredProgress, toggleSkillCompleted, toggleProjectCompleted, resetProgress, DEFAULT_PROFILE } from '@/lib/storage';
import { getDomainById, getDomainBySlug, getAllDomains } from '@/data/domains';
import { generatePersonalizedRoadmap } from '@/lib/roadmapGenerator';
import { UserProfile, ProgressState, PersonalizedRoadmap } from '@/types/user';
import DomainIcon from '@/components/DomainIcon';

function MyPathContent() {
  const searchParams = useSearchParams();
  const domainParam = searchParams.get('domain');

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [progress, setProgress] = useState<ProgressState>(getStoredProgress());
  const [selectedDomainId, setSelectedDomainId] = useState<string>('web-dev');
  const [filterMode, setFilterMode] = useState<'all' | 'incomplete' | 'completed'>('all');
  const [activeWeekTab, setActiveWeekTab] = useState<number | 'all'>('all');
  const [quickHours, setQuickHours] = useState<number>(15);

  useEffect(() => {
    const saved = getStoredProfile();
    if (saved) {
      setProfile(saved);
      setSelectedDomainId(domainParam || saved.domainInterest || 'web-dev');
      setQuickHours(saved.hoursPerWeek || 15);
    } else if (domainParam) {
      setSelectedDomainId(domainParam);
    }
    setProgress(getStoredProgress());
  }, [domainParam]);

  const activeDomain = useMemo(() => {
    return getDomainById(selectedDomainId) || getDomainBySlug(selectedDomainId) || getAllDomains()[0];
  }, [selectedDomainId]);

  // Generate personalized roadmap based on profile & weekly hours
  const roadmap: PersonalizedRoadmap = useMemo(() => {
    const effectiveProfile = {
      ...profile,
      hoursPerWeek: quickHours,
      domainInterest: activeDomain.id,
    };
    return generatePersonalizedRoadmap(activeDomain, effectiveProfile);
  }, [activeDomain, profile, quickHours]);

  // Calculate overall completion statistics
  const totalRoadmapSkills = useMemo(() => {
    return roadmap.weeks.reduce((acc, w) => acc + w.skills.length, 0);
  }, [roadmap]);

  const completedSkillsCount = useMemo(() => {
    const skillIdsInRoadmap = new Set(roadmap.weeks.flatMap((w) => w.skills.map((s) => s.id)));
    return Object.keys(progress.completedSkills).filter((id) => skillIdsInRoadmap.has(id)).length;
  }, [roadmap, progress.completedSkills]);

  const completionPercentage = totalRoadmapSkills > 0 
    ? Math.round((completedSkillsCount / totalRoadmapSkills) * 100) 
    : 0;

  const handleToggleSkill = (skillId: string) => {
    const next = toggleSkillCompleted(skillId);
    setProgress(next);

    // If just completed, shoot silver & white confetti
    if (next.completedSkills[skillId]) {
      confetti({
        particleCount: 30,
        spread: 60,
        colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
        origin: { y: 0.8 },
      });
    }
  };

  const handleToggleProject = (projectId: string) => {
    const next = toggleProjectCompleted(projectId);
    setProgress(next);
    if (next.completedProjects[projectId]) {
      confetti({
        particleCount: 60,
        spread: 80,
        colors: ['#ffffff', '#e2e8f0', '#64748b'],
        origin: { y: 0.7 },
      });
    }
  };

  const handleReset = () => {
    if (confirm('Reset your progress checklist for this roadmap?')) {
      resetProgress();
      setProgress(getStoredProgress());
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner / Domain Switcher Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 mb-8 border border-white/15 relative overflow-hidden">
        {/* Specular Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-white/30 to-white/5 p-[1px] shadow-2xl shadow-black/80 shrink-0">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[15px] flex items-center justify-center text-white border border-white/15">
                <DomainIcon name={activeDomain.icon} className="w-8 h-8" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-md">
                  {profile.userType === 'professional' ? '💼 Professional Track' : '🎓 Student Track'}
                </span>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                  Starting at Stage {roadmap.startingStage} ({profile.level})
                </span>
                {profile.yearsOfExperience && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/10">
                    {profile.yearsOfExperience} Exp
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeDomain.name} <span className="text-neutral-400 font-light">Action Plan</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
                {profile.userType === 'professional' ? (
                  <>
                    Role: <strong className="text-white">{profile.currentRole || 'Engineer'}</strong>
                    {profile.targetRole && <> • Target: <strong className="text-white">{profile.targetRole}</strong></>}
                    {' '}• Weekly Commitment: <strong className="text-white font-mono">{quickHours} hrs/week</strong>
                  </>
                ) : (
                  <>
                    Goal: <strong className="text-white">{profile.goal}</strong> • Weekly Commitment:{' '}
                    <strong className="text-white font-mono">{quickHours} hrs/week</strong>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Domain Switcher & Edit Profile */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={activeDomain.id}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              className="glass-input px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-black/90 border border-white/15 focus:outline-none"
            >
              {getAllDomains().map((d) => (
                <option key={d.id} value={d.id} className="bg-black text-white">
                  {d.name}
                </option>
              ))}
            </select>

            <Link
              href="/onboarding"
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        {/* Algorithmic Personalization Notification Banner */}
        <div className="mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/15 text-xs text-neutral-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">Fast-Track Engine Applied: </span>
              {roadmap.filteredExistingSkillsCount > 0 ? (
                <span>
                  We filtered out <strong className="text-white underline">{roadmap.filteredExistingSkillsCount} skills</strong> you already know and scheduled remaining topics across{' '}
                  <strong className="text-white">{roadmap.totalWeeks} focused weeks</strong>!
                </span>
              ) : (
                <span>
                  Complete curricular syllabus scheduled across <strong className="text-white">{roadmap.totalWeeks} focused weeks</strong> based on your {quickHours}h weekly pace.
                </span>
              )}
            </div>
          </div>

          <div className="text-[11px] font-mono text-neutral-300 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 whitespace-nowrap">
            {profile.currentSkills.length} known skills registered
          </div>
        </div>

        {/* Progress Bar & Metric Counters */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-3">
              <div className="text-sm font-bold text-white">Overall Mastery Progress</div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono font-semibold border border-white/20">
                {completedSkillsCount} of {totalRoadmapSkills} Skills Mastered
              </span>
            </div>

            <div className="text-xl font-black text-white font-mono">
              {completionPercentage}%
            </div>
          </div>

          {/* Liquid Silver/White Glowing Progress Bar */}
          <div className="w-full h-3 bg-neutral-950 rounded-full overflow-hidden p-0.5 border border-white/20">
            <div
              className="h-full bg-gradient-to-r from-neutral-500 via-white to-neutral-200 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,255,255,0.6)]"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Interactive Checklist (Saves automatically to browser)</span>
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Week Tabs & Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        {/* Week Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveWeekTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeWeekTab === 'all'
                ? 'glossy-btn-white'
                : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10'
            }`}
          >
            All Weeks ({roadmap.weeks.length})
          </button>
          {roadmap.weeks.map((week) => {
            const isSelected = activeWeekTab === week.weekNumber;
            const weekCompleted = week.skills.every((s) => progress.completedSkills[s.id]);

            return (
              <button
                key={week.weekNumber}
                onClick={() => setActiveWeekTab(week.weekNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'glossy-btn-white'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/10'
                }`}
              >
                <span>Week {week.weekNumber}</span>
                {weekCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Completion Filter */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/15 text-xs w-full sm:w-auto justify-center">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'all' ? 'bg-white text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('incomplete')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'incomplete' ? 'bg-white text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            To Learn
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              filterMode === 'completed' ? 'bg-white text-black font-bold shadow-sm' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Mastered
          </button>
        </div>
      </div>

      {/* Week-by-Week Actionable Cards */}
      <div className="space-y-6">
        {roadmap.weeks
          .filter((week) => activeWeekTab === 'all' || activeWeekTab === week.weekNumber)
          .map((week) => {
            const visibleSkills = week.skills.filter((skill) => {
              const isDone = !!progress.completedSkills[skill.id];
              if (filterMode === 'incomplete') return !isDone;
              if (filterMode === 'completed') return isDone;
              return true;
            });

            const isWeekAllDone = week.skills.every((s) => progress.completedSkills[s.id]);

            return (
              <div
                key={week.weekNumber}
                className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                  isWeekAllDone
                    ? 'border-white/40 bg-white/[0.04]'
                    : 'border-white/12 hover:border-white/25'
                }`}
              >
                {/* Week Header */}
                <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl font-black text-xs font-mono flex items-center justify-center shrink-0 border ${
                        isWeekAllDone
                          ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      W{week.weekNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 font-mono">
                          Stage {week.stageNumber}
                        </span>
                        <span className="text-neutral-500 text-[11px]">•</span>
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {week.stageTitle}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {week.focusTitle}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-300 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      ~{week.estimatedHours} hrs allocated
                    </span>
                    {isWeekAllDone && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white border border-white/30 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Skills Checklist List */}
                <div className="p-5 sm:p-6 space-y-3">
                  {visibleSkills.length > 0 ? (
                    visibleSkills.map((skill) => {
                      const isCompleted = !!progress.completedSkills[skill.id];

                      return (
                        <div
                          key={skill.id}
                          className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                            isCompleted
                              ? 'bg-white/[0.02] border-white/25 text-neutral-300'
                              : 'bg-white/[0.015] border-white/10 hover:border-white/30 hover:bg-white/[0.04]'
                          }`}
                          onClick={() => handleToggleSkill(skill.id)}
                        >
                          {/* Checkbox */}
                          <div className="pt-0.5 shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white fill-white/20" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-500 hover:text-white transition-colors" />
                            )}
                          </div>

                          {/* Skill Body */}
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                              <span
                                className={`text-sm font-bold transition-colors ${
                                  isCompleted ? 'text-neutral-400 line-through' : 'text-white'
                                }`}
                              >
                                {skill.name}
                              </span>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="text-neutral-400 font-mono">~{skill.estimatedHours} hrs</span>
                                <span className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10 font-medium">
                                  {skill.difficulty}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-neutral-300 leading-relaxed mb-2.5">
                              {skill.description}
                            </p>

                            {/* Topics & Resource link */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                              <div className="flex flex-wrap gap-1.5">
                                {skill.keyTopics.map((topic) => (
                                  <span
                                    key={topic}
                                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-mono border border-white/5"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              </div>

                              {skill.resources.length > 0 && (
                                <a
                                  href={skill.resources[0].url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] text-white hover:underline inline-flex items-center gap-1 font-semibold"
                                >
                                  <BookOpen className="w-3 h-3" />
                                  <span>{skill.resources[0].title}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-xs text-neutral-400">
                      No skills match the current completion filter.
                    </div>
                  )}

                  {/* Stage Capstone Project in Final Week of Stage */}
                  {week.suggestedProject && (
                    <div className="mt-4 p-5 rounded-xl bg-white/[0.03] border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FolderGit2 className="w-4 h-4 text-white" />
                          <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                            Practical Capstone Deliverable
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleProject(week.suggestedProject!.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                            progress.completedProjects[week.suggestedProject.id]
                              ? 'bg-white text-black shadow-sm'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10 border border-white/15'
                          }`}
                        >
                          {progress.completedProjects[week.suggestedProject.id] ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Project Shipped!</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Mark Project Complete</span>
                            </>
                          )}
                        </button>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                        {week.suggestedProject.title}
                      </h4>
                      <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                        {week.suggestedProject.description}
                      </p>

                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-neutral-400">Deliverables Checklist:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {week.suggestedProject.deliverables.map((item) => (
                            <div key={item} className="flex items-center gap-2 text-xs text-neutral-300">
                              <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* AI Tools CTA Bottom Banner */}
      <div className="mt-12 glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">
            <Sparkles className="w-4 h-4 text-white" />
            <span>AI Career Acceleration</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">
            Want to test your interview readiness or optimize your resume?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Run your skills through our Gemini-powered Skill-Gap Analyzer, get instant STAR resume bullet rewrites, or start a live 1-on-1 mock interview.
          </p>
        </div>

        <Link
          href="/ai-tools"
          className="shrink-0 px-6 py-3 rounded-xl glossy-btn-white text-xs sm:text-sm transition-all flex items-center gap-2 group"
        >
          <span>Launch AI Suite</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default function MyPathPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-400">Loading your personalized roadmap...</div>}>
      <MyPathContent />
    </Suspense>
  );
}
