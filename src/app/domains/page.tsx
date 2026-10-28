'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Layers, 
  Briefcase
} from 'lucide-react';
import { getAllDomains } from '@/data/domains';
import DomainIcon from '@/components/DomainIcon';

export default function DomainsPage() {
  const allDomains = getAllDomains();
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | 'Beginner Friendly' | 'Intermediate' | 'Challenging'>('All');

  const filteredDomains = allDomains.filter((d) => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.typicalRoles.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDifficulty = difficultyFilter === 'All' || d.difficulty === difficultyFilter;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero / Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glossy-badge text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Curricular Domain Blueprints</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Explore Industry <span className="text-neutral-400 font-light">Career Domains</span>
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Comprehensive, stage-by-stage learning pathways verified by industry practitioners. Each domain breaks down required technologies, real-world capstone projects, and salary benchmarks.
        </p>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <div className="glass-panel p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-white font-mono">6</div>
            <div className="text-xs text-neutral-400">Core Tech Domains</div>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-white font-mono">24</div>
            <div className="text-xs text-neutral-400">Curricular Stages</div>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-white font-mono">75+</div>
            <div className="text-xs text-neutral-400">Targeted Skills</div>
          </div>
          <div className="glass-panel p-3.5 rounded-xl border border-white/10">
            <div className="text-2xl font-black text-white font-mono">24</div>
            <div className="text-xs text-neutral-400">Capstone Projects</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/15">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search domain, skill or role..."
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs sm:text-sm placeholder-neutral-400"
          />
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Beginner Friendly', 'Intermediate', 'Challenging'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDifficultyFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                difficultyFilter === filter
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDomains.map((domain) => {
          const totalSkills = domain.stages.reduce((acc, s) => acc + s.orderedSkills.length, 0);

          return (
            <div
              key={domain.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between group border border-white/12 relative overflow-hidden"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:scale-105 transition-all">
                    <DomainIcon name={domain.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 font-mono">
                    {domain.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition-colors mb-2">
                  {domain.name}
                </h3>
                <p className="text-neutral-400 text-xs sm:text-sm line-clamp-2 mb-4 leading-relaxed">
                  {domain.shortDescription}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <DollarSign className="w-3.5 h-3.5 text-white" />
                    <span>{domain.averageSalary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                    <span>{domain.growthRate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span>~{domain.totalEstimatedHours}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <Layers className="w-3.5 h-3.5 text-white" />
                    <span>{domain.stages.length} Stages • {totalSkills} Skills</span>
                  </div>
                </div>

                {/* Roles chips */}
                <div className="mb-6">
                  <div className="text-[11px] font-semibold text-neutral-400 mb-2 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-neutral-400" /> Target Roles:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {domain.typicalRoles.slice(0, 3).map((role) => (
                      <span
                        key={role}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 font-medium"
                      >
                        {role}
                      </span>
                    ))}
                    {domain.typicalRoles.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white/5 text-neutral-400">
                        +{domain.typicalRoles.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/domains/${domain.slug}`}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-xs font-semibold text-white text-center transition-all flex items-center justify-center gap-1.5 group/btn"
                >
                  <span>View Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href={`/my-path?domain=${domain.slug}`}
                  className="py-2.5 px-4 rounded-xl glossy-btn-white text-xs font-semibold text-center transition-all"
                >
                  Personalize
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDomains.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-2xl">
          <p className="text-neutral-400 text-sm">No domains matched &ldquo;{searchQuery}&rdquo;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setDifficultyFilter('All');
            }}
            className="mt-3 text-xs text-white hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
