'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Zap, 
  FileText, 
  MessageSquare
} from 'lucide-react';
import SkillGapTool from '@/components/ai/SkillGapTool';
import ResumeFeedbackTool from '@/components/ai/ResumeFeedbackTool';
import MockInterviewTool from '@/components/ai/MockInterviewTool';

type ToolTab = 'skill-gap' | 'resume' | 'mock-interview';

function AIToolsContent() {
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool') as ToolTab | null;

  const [activeTab, setActiveTab] = useState<ToolTab>('skill-gap');

  useEffect(() => {
    if (toolParam && ['skill-gap', 'resume', 'mock-interview'].includes(toolParam)) {
      setActiveTab(toolParam);
    }
  }, [toolParam]);

  const tabs = [
    {
      id: 'skill-gap' as const,
      label: 'Skill-Gap Analyzer',
      icon: Zap,
      badge: 'Target Roles',
      desc: 'Evaluate readiness & uncover missing skills',
    },
    {
      id: 'resume' as const,
      label: 'Resume Feedback',
      icon: FileText,
      badge: 'ATS & STAR',
      desc: 'Paste resume, get scores & rewritten bullets',
    },
    {
      id: 'mock-interview' as const,
      label: 'Mock Interview',
      icon: MessageSquare,
      badge: 'Live 1-on-1',
      desc: 'One question at a time with instant scoring',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glossy-badge text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Gemini Intelligence Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          AI-Powered <span className="text-neutral-400 font-light">Career Acceleration</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Structured, objective career analysis trained on modern hiring rubrics. Identify blindspots, transform your resume into high-impact bullets, and test your interview readiness.
        </p>
      </div>

      {/* Tab Switcher Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-white/[0.08] border-white ring-2 ring-white/30 shadow-xl'
                  : 'glass-panel border-white/10 hover:border-white/25 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-neutral-400 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border font-mono ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : 'bg-white/5 text-neutral-400 border-white/10'
                  }`}
                >
                  {tab.badge}
                </span>
              </div>

              <h3 className="font-bold text-sm text-white mb-0.5">{tab.label}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Active Tool View */}
      <div className="transition-all duration-300">
        {activeTab === 'skill-gap' && <SkillGapTool />}
        {activeTab === 'resume' && <ResumeFeedbackTool />}
        {activeTab === 'mock-interview' && <MockInterviewTool />}
      </div>
    </div>
  );
}

export default function AIToolsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-400">Loading AI Tools Suite...</div>}>
      <AIToolsContent />
    </Suspense>
  );
}
