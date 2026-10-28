'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink, 
  Code, 
  FolderGit2, 
  BookOpen, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Domain } from '@/types/domain';
import DomainIcon from '@/components/DomainIcon';

export default function DomainTimelineClient({ domain }: { domain: Domain }) {
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
  });

  const toggleStage = (stageNum: number) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageNum]: !prev[stageNum],
    }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/domains"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Domains</span>
        </Link>
      </div>

      {/* Domain Header Hero */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 mb-10 border border-white/15 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-b from-white/30 to-white/5 p-[1px] shadow-2xl shrink-0">
              <div className="w-full h-full bg-[#0a0a0c] rounded-[15px] flex items-center justify-center text-white border border-white/15">
                <DomainIcon name={domain.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20 font-mono">
                  {domain.badge}
                </span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                  {domain.difficulty}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                {domain.name} <span className="text-neutral-400 font-light">Roadmap</span>
              </h1>
              <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                {domain.fullDescription}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href={`/my-path?domain=${domain.slug}`}
              className="w-full md:w-auto px-6 py-3 rounded-xl glossy-btn-white text-xs sm:text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Personalize This Path</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <DollarSign className="w-4 h-4 text-white" />
            <div>
              <div className="text-neutral-400 text-[11px]">Average Compensation</div>
              <div className="font-bold text-white text-sm">{domain.averageSalary}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <TrendingUp className="w-4 h-4 text-white" />
            <div>
              <div className="text-neutral-400 text-[11px]">Market Demand</div>
              <div className="font-bold text-white text-sm">{domain.growthRate}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Clock className="w-4 h-4 text-white" />
            <div>
              <div className="text-neutral-400 text-[11px]">Estimated Effort</div>
              <div className="font-bold text-white text-sm">~{domain.totalEstimatedHours} Total Hours</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Briefcase className="w-4 h-4 text-white" />
            <div>
              <div className="text-neutral-400 text-[11px]">Industry Stages</div>
              <div className="font-bold text-white text-sm">{domain.stages.length} Milestones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Stage-by-Stage Timeline */}
      <div className="relative">
        {/* Timeline connector line (desktop) */}
        <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />

        <div className="space-y-8">
          {domain.stages.map((stage) => {
            const isExpanded = expandedStages[stage.stageNumber] ?? true;

            return (
              <div
                key={stage.stageNumber}
                className="relative md:pl-20 transition-all"
              >
                {/* Stage node indicator icon on the timeline */}
                <div className="hidden md:flex absolute left-4 top-6 w-8 h-8 rounded-full bg-black border-2 border-white/40 text-white font-bold text-xs items-center justify-center shadow-lg font-mono z-10">
                  {stage.stageNumber}
                </div>

                <div className="glass-panel rounded-2xl border border-white/12 overflow-hidden transition-all">
                  {/* Stage Header Accordion Toggle */}
                  <div
                    onClick={() => toggleStage(stage.stageNumber)}
                    className="p-5 sm:p-6 cursor-pointer hover:bg-white/[0.03] flex items-center justify-between gap-4 border-b border-white/10 select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="md:hidden w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-white font-bold text-xs font-mono flex items-center justify-center shrink-0">
                        {stage.stageNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300 font-mono">
                            Stage {stage.stageNumber}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-medium">
                            {stage.level}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                            • ~{stage.estimatedHours} hours
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {stage.title}
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-neutral-400">
                      <span className="text-xs hidden sm:inline">
                        {stage.orderedSkills.length} skills • {stage.suggestedProjects.length} project
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                    </div>
                  </div>

                  {/* Stage Content */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 bg-white/[0.01]">
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Ordered Skills */}
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5 font-mono">
                          <Code className="w-3.5 h-3.5 text-white" />
                          Curricular Skills to Master
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                          {stage.orderedSkills.map((skill, sIdx) => (
                            <div
                              key={skill.id}
                              className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white font-mono w-5">
                                    {sIdx + 1}.
                                  </span>
                                  <h4 className="font-bold text-sm text-white">
                                    {skill.name}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-mono">
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-medium">
                                    ~{skill.estimatedHours} hrs
                                  </span>
                                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-white border border-white/15 font-medium">
                                    {skill.difficulty}
                                  </span>
                                </div>
                              </div>

                              <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                                {skill.description}
                              </p>

                              {/* Topics and Resources */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/10">
                                <div className="flex flex-wrap gap-1.5">
                                  {skill.keyTopics.map((topic) => (
                                    <span
                                      key={topic}
                                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-neutral-400 font-mono border border-white/5"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>

                                {skill.resources.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    {skill.resources.map((res) => (
                                      <a
                                        key={res.title}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[11px] text-white hover:underline font-semibold"
                                      >
                                        <BookOpen className="w-3 h-3" />
                                        <span>{res.title}</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Suggested Practical Capstone Project */}
                      {stage.suggestedProjects.map((proj) => (
                        <div
                          key={proj.id}
                          className="p-5 rounded-2xl bg-white/[0.03] border border-white/20"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FolderGit2 className="w-4 h-4 text-white" />
                              <span className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                                Stage Milestone Capstone Project
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-mono">
                              {proj.difficulty}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-white mb-1.5">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                            {proj.description}
                          </p>

                          <div className="space-y-1.5">
                            <div className="text-[11px] font-semibold text-neutral-400">Key Deliverables:</div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {proj.deliverables.map((item) => (
                                <div key={item} className="flex items-center gap-2 text-xs text-neutral-300">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Floating CTA */}
      <div className="mt-12 text-center">
        <Link
          href={`/my-path?domain=${domain.slug}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glossy-btn-white text-sm transition-all"
        >
          <Sparkles className="w-4 h-4 text-black" />
          <span>Generate My Personalized Weekly Checklist</span>
        </Link>
      </div>
    </div>
  );
}
