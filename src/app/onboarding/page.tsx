'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Compass, 
  Sparkles, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Code2, 
  Database, 
  Brain, 
  ShieldCheck, 
  Cloud, 
  Palette,
  UserCheck,
  Building,
  Award
} from 'lucide-react';
import TagInput from '@/components/TagInput';
import { getStoredProfile, DEFAULT_PROFILE } from '@/lib/storage';
import { POPULAR_SKILLS_BY_DOMAIN, getAllDomains } from '@/data/domains';
import { UserLevel, UserProfile, UserType } from '@/types/user';
import { useAuth } from '@/context/AuthContext';

const STUDENT_GOALS = [
  { id: 'Land first tech job', label: 'Land First Tech Job', desc: 'Break into the industry with an accredited, job-ready portfolio' },
  { id: 'Internship / Placement', label: 'Secure Tech Internship', desc: 'Prepare for campus placements and summer developer internships' },
  { id: 'Academic Projects & Hackathons', label: 'Build Hackathon Projects', desc: 'Master practical stacks to build and ship real working software' },
  { id: 'Explore Domain & Foundations', label: 'Explore & Build Fundamentals', desc: 'Discover what tech career aligns with your natural strengths' },
];

const DOMAINS_LIST = [
  { id: 'web-dev', name: 'Web Development', icon: Code2, badge: 'High Volume', desc: 'Frontend, Backend, Next.js, and Full-Stack APIs' },
  { id: 'data-science', name: 'Data Science', icon: Database, badge: 'High ROI', desc: 'Python, SQL, Analytics, and Predictive ML' },
  { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain, badge: 'Frontier Tech', desc: 'PyTorch, Transformers, LLMs, and Multi-Agent Systems' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: ShieldCheck, badge: 'Critical Need', desc: 'Network defense, Pentesting, and Cloud Security' },
  { id: 'cloud-devops', name: 'Cloud & DevOps', icon: Cloud, badge: 'High Demand', desc: 'Docker, Kubernetes, CI/CD, and Terraform' },
  { id: 'ui-ux', name: 'UI/UX Design', icon: Palette, badge: 'Design Impact', desc: 'Figma, Design Systems, and Usability Research' },
];

const STUDENT_LEVELS: { id: UserLevel; label: string; desc: string; stageText: string }[] = [
  { 
    id: 'Beginner', 
    label: 'Beginner', 
    desc: 'New to this domain or starting fresh.', 
    stageText: 'Starts at Stage 1: Foundations' 
  },
  { 
    id: 'Intermediate', 
    label: 'Intermediate', 
    desc: 'Know the syntax, ready for component systems & APIs.', 
    stageText: 'Fast-tracks to Stage 2: Core Engineering' 
  },
  { 
    id: 'Advanced', 
    label: 'Advanced', 
    desc: 'Have shipped multiple projects, ready for distributed scale.', 
    stageText: 'Starts at Stage 3/4: Architecture & Mastery' 
  },
];

const EXPERIENCE_YEARS = [
  { id: '0-1 yr', label: '0 - 1 Year (Associate / Junior)', defaultLevel: 'Beginner' as UserLevel },
  { id: '2-4 yrs', label: '2 - 4 Years (Mid-Level Engineer)', defaultLevel: 'Intermediate' as UserLevel },
  { id: '5-8 yrs', label: '5 - 8 Years (Senior / Specialist)', defaultLevel: 'Advanced' as UserLevel },
  { id: '9+ yrs', label: '9+ Years (Staff / Tech Lead / Manager)', defaultLevel: 'Advanced' as UserLevel },
];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') as UserType | null;

  const { user, saveProfile: saveAuthProfile } = useAuth();

  const [userType, setUserType] = useState<UserType>('student');
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeParam && (typeParam === 'student' || typeParam === 'professional')) {
      setUserType(typeParam);
    } else {
      const existing = getStoredProfile();
      if (existing) {
        setProfile(existing);
        setUserType(existing.userType || 'student');
      }
    }
  }, [typeParam]);

  const handleDomainChange = (domainId: string) => {
    setProfile((prev) => ({
      ...prev,
      domainInterest: domainId,
    }));
  };

  const handleSkillsChange = (newSkills: string[]) => {
    setProfile((prev) => ({
      ...prev,
      currentSkills: newSkills,
    }));
  };

  const handleExperienceChange = (exp: typeof EXPERIENCE_YEARS[0]) => {
    setProfile((prev) => ({
      ...prev,
      yearsOfExperience: exp.id,
      level: exp.defaultLevel,
    }));
  };

  const handleSaveAndGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalizedProfile: UserProfile = {
      ...profile,
      userType,
      email: user?.email || profile.email,
      id: user?.id || profile.id,
      updatedAt: new Date().toISOString(),
    };

    setIsSaved(true);
    await saveAuthProfile(finalizedProfile);

    setTimeout(() => {
      router.push('/my-path');
    }, 500);
  };

  const selectedDomainData = getAllDomains().find((d) => d.id === profile.domainInterest);
  const totalHours = selectedDomainData?.totalEstimatedHours || 180;
  const estimatedWeeks = Math.ceil(totalHours / Math.max(5, profile.hoursPerWeek));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glossy-badge text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-white" />
          <span>Tailored Persona Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
          Configure Your <span className="text-neutral-400 font-light">PathFinder</span> Profile
        </h1>
        <p className="text-neutral-400 text-xs sm:text-sm">
          Select your user persona. We optimize the curriculum, starting stage, and timeline differently for students and working professionals.
        </p>
      </div>

      <form onSubmit={handleSaveAndGenerate} className="space-y-8">
        {/* FIRST SCREEN / STEP 1: CHOOSE USER TYPE */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold text-xs border border-white/20">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-white" />
                Select Your Persona Type
              </h2>
              <p className="text-xs text-neutral-400">Choose the track that matches your current standing.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {/* Persona A: Student */}
            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                userType === 'student'
                  ? 'bg-white/[0.08] border-white ring-2 ring-white/30 shadow-xl'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userType === 'student' ? 'bg-white text-black' : 'bg-white/5 text-neutral-400'}`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${userType === 'student' ? 'bg-white/20 text-white border-white/30' : 'bg-white/5 text-neutral-400 border-white/10'}`}>
                    Option A
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Student / Career Switcher</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Focus on foundations, step-by-step milestones, college projects, and breaking into your first tech job.
                </p>
              </div>

              {userType === 'student' && (
                <div className="mt-4 pt-3 border-t border-white/15 text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Student Track Activated</span>
                </div>
              )}
            </button>

            {/* Persona B: Working Professional */}
            <button
              type="button"
              onClick={() => setUserType('professional')}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden group flex flex-col justify-between ${
                userType === 'professional'
                  ? 'bg-white/[0.08] border-white ring-2 ring-white/30 shadow-xl'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/25 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${userType === 'professional' ? 'bg-white text-black' : 'bg-white/5 text-neutral-400'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${userType === 'professional' ? 'bg-white/20 text-white border-white/30' : 'bg-white/5 text-neutral-400 border-white/10'}`}>
                    Option B
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-1">Working Professional</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Skip beginner basics. Fast-track based on years of experience, target promotions, and master architectural scale.
                </p>
              </div>

              {userType === 'professional' && (
                <div className="mt-4 pt-3 border-t border-white/15 text-[11px] font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Professional Track Activated</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* TRACK A: STUDENT FIELDS */}
        {userType === 'student' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Student Goal */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <Target className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Student Career Goal</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STUDENT_GOALS.map((g) => {
                  const isSelected = profile.goal === g.id;
                  return (
                    <button
                      type="button"
                      key={g.id}
                      onClick={() => setProfile((p) => ({ ...p, goal: g.id }))}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/10 border-white ring-2 ring-white/25'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-white">{g.label}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <p className="text-xs text-neutral-400">{g.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Domain Interest */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <Layers className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Domain of Interest</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOMAINS_LIST.map((dom) => {
                  const Icon = dom.icon;
                  const isSelected = profile.domainInterest === dom.id;
                  return (
                    <button
                      type="button"
                      key={dom.id}
                      onClick={() => handleDomainChange(dom.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/10 border-white ring-2 ring-white/25'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white text-black' : 'bg-white/10 text-neutral-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                          {dom.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">{dom.name}</h4>
                      <p className="text-[11px] text-neutral-400 leading-tight">{dom.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Student Current Skills */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Current Skills (Tag Input)</h3>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                List the languages and frameworks you already have exposure to. We filter them out so you don&apos;t repeat material.
              </p>

              <TagInput
                tags={profile.currentSkills}
                onChange={handleSkillsChange}
                suggestions={POPULAR_SKILLS_BY_DOMAIN[profile.domainInterest] || []}
              />
            </div>

            {/* Student Level */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <GraduationCap className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Self-Assessed Skill Level</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STUDENT_LEVELS.map((lvl) => {
                  const isSelected = profile.level === lvl.id;
                  return (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setProfile((p) => ({ ...p, level: lvl.id }))}
                      className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/10 border-white ring-2 ring-white/25'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">{lvl.label}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                        <p className="text-xs text-neutral-400 mb-3">{lvl.desc}</p>
                      </div>
                      <div className="text-[10px] font-semibold text-white bg-white/10 rounded px-2 py-0.5 border border-white/20">
                        {lvl.stageText}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TRACK B: WORKING PROFESSIONAL FIELDS */}
        {userType === 'professional' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Professional Domain */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <Layers className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Target Tech Domain</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOMAINS_LIST.map((dom) => {
                  const Icon = dom.icon;
                  const isSelected = profile.domainInterest === dom.id;
                  return (
                    <button
                      type="button"
                      key={dom.id}
                      onClick={() => handleDomainChange(dom.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white/10 border-white ring-2 ring-white/25'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white text-black' : 'bg-white/10 text-neutral-300'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/10">
                          {dom.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-white mb-0.5">{dom.name}</h4>
                      <p className="text-[11px] text-neutral-400 leading-tight">{dom.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Role & Optional Target Role */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <Building className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Workplace Role & Career Trajectory</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Current Role
                  </label>
                  <input
                    type="text"
                    value={profile.currentRole || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, currentRole: e.target.value }))}
                    placeholder="e.g. Junior Backend Dev, QA Engineer, Data Analyst..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                    <span>Optional Target Role</span>
                    <span className="text-[10px] text-neutral-400">Optional</span>
                  </label>
                  <input
                    type="text"
                    value={profile.targetRole || ''}
                    onChange={(e) => setProfile((p) => ({ ...p, targetRole: e.target.value }))}
                    placeholder="e.g. Full Stack Lead, AI Solutions Architect..."
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
                  />
                </div>
              </div>
            </div>

            {/* Years of Experience */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-4">
                <Award className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Years of Professional Experience</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EXPERIENCE_YEARS.map((exp) => {
                  const isSelected = profile.yearsOfExperience === exp.id;
                  return (
                    <button
                      type="button"
                      key={exp.id}
                      onClick={() => handleExperienceChange(exp)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white/10 border-white ring-2 ring-white/25'
                          : 'bg-white/[0.02] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{exp.id}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-tight">{exp.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Professional Current Skills */}
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-base font-bold text-white">Current Production Skills (Tag Input)</h3>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Add skills you use at work. The roadmap will skip beginner modules and focus directly on senior-level gaps.
              </p>

              <TagInput
                tags={profile.currentSkills}
                onChange={handleSkillsChange}
                suggestions={POPULAR_SKILLS_BY_DOMAIN[profile.domainInterest] || []}
              />
            </div>
          </div>
        )}

        {/* SHARED STEP: HOURS PER WEEK SLIDER */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock className="w-4 h-4 text-white" />
            <h3 className="text-base font-bold text-white">Hours Per Week Availability</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-neutral-300 font-medium">Study & Practice Commitment</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white font-mono">{profile.hoursPerWeek}</span>
                <span className="text-xs text-neutral-400 uppercase font-semibold">hours / week</span>
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={profile.hoursPerWeek}
              onChange={(e) => setProfile((p) => ({ ...p, hoursPerWeek: Number(e.target.value) }))}
              className="w-full h-2 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-white"
            />

            <div className="flex justify-between text-[11px] text-neutral-400 font-medium font-mono">
              <span>5 hrs/wk (Casual)</span>
              <span>15-20 hrs/wk (Standard)</span>
              <span>40 hrs/wk (Full-time)</span>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/15 flex items-center justify-between flex-wrap gap-2 text-xs">
              <span className="text-neutral-300">
                Paced for <strong className="text-white">{selectedDomainData?.name}</strong> at {profile.hoursPerWeek}h/wk
              </span>
              <span className="font-bold text-white font-mono">
                ~{estimatedWeeks} Weeks Roadmap Forecast
              </span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glossy-btn-white text-sm transition-all flex items-center justify-center gap-2 group"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black animate-bounce" />
                <span>Generating {userType === 'student' ? 'Student' : 'Professional'} Roadmap...</span>
              </>
            ) : (
              <>
                <span>Launch My {userType === 'student' ? 'Student' : 'Professional'} Roadmap</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-400">Loading Onboarding Navigator...</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
