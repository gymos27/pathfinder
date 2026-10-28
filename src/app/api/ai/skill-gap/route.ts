import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAIResponse, SkillGapAnalysisResult } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetRole = 'Full Stack Engineer', currentSkills = [], domain = 'Web Development', experienceLevel = 'Intermediate' } = body;

    const prompt = `
You are an expert tech career strategist and technical recruiter.
Analyze the skill gap for an aspiring professional aiming for the role "${targetRole}" in "${domain}".
Their current self-reported skills are: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'None listed'}.
Their current experience level is: "${experienceLevel}".

Analyze the gap against modern 2025/2026 industry standards and output STRICTLY VALID JSON matching this schema:
{
  "roleTitle": "${targetRole}",
  "readinessScore": number (integer between 25 and 95 based on skill overlap),
  "marketDemand": "Very High" | "High" | "Moderate",
  "summary": "2-3 concise sentences evaluating their market readiness and positioning.",
  "criticalMissingSkills": [
    {
      "name": "Skill Name",
      "importance": "Must Have" | "High Priority",
      "reason": "Why this skill is mandatory for this role",
      "estimatedTimeToLearn": "e.g. 2-3 weeks (20 hrs)"
    }
  ],
  "niceToHaveSkills": [
    {
      "name": "Skill Name",
      "benefit": "How this gives them a competitive edge"
    }
  ],
  "strengthSkills": [
    {
      "name": "Skill Name",
      "appliedInRole": "How their current skill translates to the role"
    }
  ],
  "actionPlan": [
    {
      "phase": "Phase 1: Foundations / Core",
      "timeframe": "Weeks 1-3",
      "focus": "Key technologies to conquer",
      "milestone": "Measurable deliverable or project"
    },
    {
      "phase": "Phase 2: Advanced & Architecture",
      "timeframe": "Weeks 4-6",
      "focus": "Complex integration",
      "milestone": "Production-ready portfolio deliverable"
    },
    {
      "phase": "Phase 3: Interview & Job Prep",
      "timeframe": "Weeks 7-8",
      "focus": "System design and live coding",
      "milestone": "5 completed mock interviews & polished GitHub"
    }
  ]
}

DO NOT include markdown code blocks or backticks. Return pure JSON only.
`;

    const fallbackGenerator = (): SkillGapAnalysisResult => {
      const skillsUpper = currentSkills.map((s: string) => s.toLowerCase());
      const hasReact = skillsUpper.some((s: string) => s.includes('react'));
      const hasNode = skillsUpper.some((s: string) => s.includes('node'));
      const hasTypeScript = skillsUpper.some((s: string) => s.includes('typescript') || s.includes('ts'));
      const hasSql = skillsUpper.some((s: string) => s.includes('sql') || s.includes('postgres'));

      const calculatedScore = Math.min(88, Math.max(38, currentSkills.length * 9 + 25));

      return {
        roleTitle: targetRole,
        readinessScore: calculatedScore,
        marketDemand: 'Very High',
        summary: `You have built a respectable base with ${currentSkills.length} relevant competencies. To comfortably clear technical screens for ${targetRole}, you must formalize your understanding of asynchronous distributed patterns, relational schemas, and modern testing.`,
        criticalMissingSkills: [
          {
            name: hasTypeScript ? 'Docker & Cloud Containers' : 'TypeScript & Strict Type Safety',
            importance: 'Must Have',
            reason: 'Modern engineering teams mandate strict type safety and containerized reproducible environments.',
            estimatedTimeToLearn: '2-3 weeks (25 hrs)',
          },
          {
            name: hasNode ? 'System Design & Distributed Caching' : 'Server-Side Architecture (Node/Go)',
            importance: 'Must Have',
            reason: 'Architecting scalable serverless/microservice endpoints is the dividing line for competitive candidates.',
            estimatedTimeToLearn: '3-4 weeks (35 hrs)',
          },
          {
            name: hasSql ? 'Automated E2E Testing (Playwright)' : 'Relational Database Schema Design (PostgreSQL)',
            importance: 'High Priority',
            reason: 'Production deployments demand reliable database query indexes and regression test suites.',
            estimatedTimeToLearn: '2 weeks (18 hrs)',
          },
        ],
        niceToHaveSkills: [
          {
            name: 'CI/CD Pipelines (GitHub Actions)',
            benefit: 'Demonstrates end-to-end engineering autonomy without hand-holding from DevOps teams.',
          },
          {
            name: 'LLM Function Calling & AI Integration',
            benefit: 'A massive competitive differentiator for 2025/2026 software roles.',
          },
        ],
        strengthSkills: currentSkills.slice(0, 3).map((skill: string) => ({
          name: skill,
          appliedInRole: `Provides solid baseline leverage for day-to-day implementation in ${targetRole}.`,
        })),
        actionPlan: [
          {
            phase: 'Phase 1: High-Priority Skill Acquisition',
            timeframe: 'Weeks 1-3',
            focus: 'Close the gap on TypeScript, relational schemas, and asynchronous error boundaries.',
            milestone: 'Build a typed REST API with PostgreSQL and automated schema migrations.',
          },
          {
            phase: 'Phase 2: Production Hardening & Full-Stack Synergy',
            timeframe: 'Weeks 4-6',
            focus: 'Containerize services with Docker and setup automated GitHub Actions CI tests.',
            milestone: 'Deploy a multi-tier web application with Lighthouse score >92.',
          },
          {
            phase: 'Phase 3: Portfolio Proof & Technical Screening',
            timeframe: 'Weeks 7-8',
            focus: 'Live technical mock interviews and system design walk-throughs.',
            milestone: 'Document architecture decisions in public GitHub repos and apply to 15 target roles.',
          },
        ],
      };
    };

    const result = await generateStructuredAIResponse<SkillGapAnalysisResult>(prompt, fallbackGenerator);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in skill-gap route:', error);
    return NextResponse.json({ error: 'Failed to analyze skill gap' }, { status: 500 });
  }
}
