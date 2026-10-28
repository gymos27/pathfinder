import { GoogleGenAI } from '@google/genai';

export interface SkillGapAnalysisResult {
  roleTitle: string;
  readinessScore: number; // 0 - 100
  marketDemand: 'Very High' | 'High' | 'Moderate';
  summary: string;
  criticalMissingSkills: {
    name: string;
    importance: 'Must Have' | 'High Priority';
    reason: string;
    estimatedTimeToLearn: string;
  }[];
  niceToHaveSkills: {
    name: string;
    benefit: string;
  }[];
  strengthSkills: {
    name: string;
    appliedInRole: string;
  }[];
  actionPlan: {
    phase: string;
    timeframe: string;
    focus: string;
    milestone: string;
  }[];
}

export interface ResumeFeedbackResult {
  overallScore: number; // 0 - 100
  atsCompatibilityScore: number; // 0 - 100
  impactScore: number; // 0 - 100
  summary: string;
  keyStrengths: string[];
  criticalWeaknesses: string[];
  missingKeywords: {
    keyword: string;
    category: 'Technical' | 'Soft Skills' | 'Certifications / Tools';
    relevance: string;
  }[];
  rewrittenBullets: {
    original: string;
    improved: string;
    improvementExplanation: string;
  }[];
  quickFixChecklist: {
    action: string;
    priority: 'Urgent' | 'Recommended' | 'Bonus';
  }[];
}

export interface MockInterviewResponse {
  score: number; // 1 - 10
  feedback: string;
  strengths: string[];
  improvements: string[];
  idealAnswerHighlights: string[];
  nextQuestion: {
    id: string;
    questionNumber: number;
    category: 'Technical' | 'Behavioral' | 'System Design' | 'Problem Solving';
    difficulty: 'Junior' | 'Mid' | 'Senior';
    questionText: string;
    contextOrTip: string;
  };
}

export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateStructuredAIResponse<T>(
  prompt: string,
  fallbackGenerator: () => T
): Promise<T> {
  const ai = getGeminiClient();

  if (!ai) {
    console.log('[Gemini] No GEMINI_API_KEY configured. Using intelligent demo fallback.');
    return fallbackGenerator();
  }

  try {
    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: unknown = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text) as T;
          return parsed;
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Gemini] Attempt with model ${model} failed, trying next...`, err);
      }
    }

    console.warn('[Gemini] All models encountered error, using intelligent fallback.', lastError);
    return fallbackGenerator();
  } catch (err) {
    console.error('[Gemini] Unexpected exception calling Gemini API:', err);
    return fallbackGenerator();
  }
}
