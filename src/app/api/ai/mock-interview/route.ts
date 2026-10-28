import { NextRequest, NextResponse } from 'next/server';
import { generateStructuredAIResponse, MockInterviewResponse } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      domain = 'Web Development',
      role = 'Frontend Developer',
      difficulty = 'Junior',
      questionNumber = 1,
      currentQuestion = '',
      userAnswer = '',
      history = [],
    } = body;

    // Mode 1: Initial Question Request (User is starting the interview)
    if (!userAnswer || userAnswer.trim().length === 0) {
      const initialPrompt = `
You are a senior tech interviewer conducting a real-time mock interview for a "${difficulty}" level "${role}" in the "${domain}" domain.
Generate Question #${questionNumber} for this candidate.
It should be an engaging, realistic interview question testing fundamentals or practical engineering judgment.

Return STRICT VALID JSON matching this schema:
{
  "score": 0,
  "feedback": "Welcome to your mock interview! Answer thoughtfully with real examples.",
  "strengths": [],
  "improvements": [],
  "idealAnswerHighlights": [],
  "nextQuestion": {
    "id": "q-${questionNumber}-${Date.now()}",
    "questionNumber": ${questionNumber},
    "category": "Technical",
    "difficulty": "${difficulty}",
    "questionText": "Realistic interview question here",
    "contextOrTip": "Coaching tip explaining what the interviewer is listening for"
  }
}

DO NOT include markdown code blocks or backticks. Return pure JSON only.
`;

      const initialFallback = (): MockInterviewResponse => {
        const sampleQuestions: Record<string, string> = {
          'Web Development': 'Can you explain the difference between Server-Side Rendering (SSR) and Client-Side Rendering (CSR), and when you would choose one over the other in a Next.js application?',
          'Data Science': 'How do you detect and handle multicollinearity in a regression dataset, and what effect does it have on model coefficient interpretability?',
          'AI & Machine Learning': 'Walk me through how the self-attention mechanism works in Transformer architectures. Why does it scale quadratically with sequence length?',
          'Cybersecurity': 'Describe the step-by-step process of how a Cross-Site Scripting (XSS) vulnerability occurs, and what layered defense-in-depth measures you would implement.',
          'Cloud & DevOps': 'What is the difference between a Docker container and a virtual machine, and how does the Linux kernel implement container isolation under the hood?',
          'UI/UX Design': 'How do you balance aesthetic design desires against strict WCAG AA accessibility standards when designing a high-contrast dark mode dashboard?',
        };

        const chosenQuestion = sampleQuestions[domain] || `Walk me through a challenging problem you solved in ${role} and how you structured your technical solution.`;

        return {
          score: 0,
          feedback: `Welcome to your PathFinder mock interview for ${role}! Take your time to structure your answer using clear technical concepts and practical examples.`,
          strengths: [],
          improvements: [],
          idealAnswerHighlights: [],
          nextQuestion: {
            id: `q-1-${Date.now()}`,
            questionNumber: 1,
            category: 'Technical',
            difficulty: difficulty as 'Junior' | 'Mid' | 'Senior',
            questionText: chosenQuestion,
            contextOrTip: 'Tip: Define the core concepts clearly, compare trade-offs, and cite a concrete real-world use case.',
          },
        };
      };

      const initialResult = await generateStructuredAIResponse<MockInterviewResponse>(initialPrompt, initialFallback);
      return NextResponse.json(initialResult);
    }

    // Mode 2: Grading Answer & Producing Next Question
    const nextQNum = questionNumber + 1;
    const isFinalRound = nextQNum > 5;

    const evaluationPrompt = `
You are a senior tech hiring manager and technical interviewer evaluating a "${difficulty}" candidate for "${role}" (${domain}).

QUESTION ASKED (Question #${questionNumber}):
"${currentQuestion}"

CANDIDATE'S ANSWER:
"${userAnswer}"

PREVIOUS INTERVIEW CONTEXT (Rounds completed: ${history.length}):
${JSON.stringify(history.slice(-2))}

Grade the candidate's answer with rigorous, constructive honesty (score 1-10).
${isFinalRound 
  ? 'This was the final question! Provide a comprehensive wrap-up evaluation.' 
  : `Generate the next logical follow-up question (Question #${nextQNum}) which could be technical, behavioral, or system design based on their previous answers.`
}

Return STRICT VALID JSON matching this schema:
{
  "score": number (1 to 10 integer),
  "feedback": "2-3 sentences of direct, supportive yet constructive feedback.",
  "strengths": [
    "What the candidate articulated well or got right",
    "Positive trait or term used effectively"
  ],
  "improvements": [
    "Crucial point that was omitted or inaccurate",
    "Advice on how to articulate with more clarity or authority"
  ],
  "idealAnswerHighlights": [
    "Key concept 1 an ideal answer would include",
    "Key concept 2 an ideal answer would include",
    "Trade-off or edge case that impresses interviewers"
  ],
  "nextQuestion": {
    "id": "q-${nextQNum}-${Date.now()}",
    "questionNumber": ${nextQNum},
    "category": "${nextQNum % 2 === 0 ? 'Behavioral' : 'System Design'}",
    "difficulty": "${difficulty}",
    "questionText": "${isFinalRound ? 'INTERVIEW_COMPLETE' : 'Next realistic question text'}",
    "contextOrTip": "${isFinalRound ? 'You have concluded all 5 interview rounds!' : 'Coaching hint for next question'}"
  }
}

DO NOT include markdown code blocks or backticks. Return pure JSON only.
`;

    const fallbackEvaluation = (): MockInterviewResponse => {
      const answerLength = userAnswer.trim().split(/\s+/).length;
      let calculatedScore = 7;
      if (answerLength < 15) calculatedScore = 4;
      else if (answerLength > 60) calculatedScore = 9;
      else if (answerLength > 30) calculatedScore = 8;

      const nextQuestions = [
        {
          category: 'Behavioral' as const,
          text: 'Tell me about a time you encountered a severe production bug or unexpected merge conflict. How did you communicate with teammates and resolve it under pressure?',
          tip: 'Use the STAR format: Situation, Task, Action taken, and measurable Result.',
        },
        {
          category: 'System Design' as const,
          text: `How would you architect a scalable feature for ${domain} that handles 50,000 concurrent requests without crashing the database?`,
          tip: 'Mention caching layers (Redis), database indexing, rate limiting, and asynchronous task queues.',
        },
        {
          category: 'Problem Solving' as const,
          text: 'When you are tasked with learning a brand new framework or API with tight deadlines, what is your systematic approach to getting productive quickly?',
          tip: 'Focus on documentation reading, small proof-of-concept prototyping, and testing.',
        },
      ];

      const nextQObj = nextQuestions[(questionNumber - 1) % nextQuestions.length];

      return {
        score: calculatedScore,
        feedback: answerLength < 15
          ? 'Your answer touched on the surface concept, but was too brief for an engineering interview. Provide more depth and concrete technical examples.'
          : 'Great technical clarity! You communicated the core mechanics well and demonstrated good engineering intuition.',
        strengths: [
          'Direct answer addressing the core premise without unnecessary rambling.',
          'Demonstrated familiarity with real-world terminology and engineering constraints.',
        ],
        improvements: [
          'Make sure to mention specific real-world edge cases or performance bottlenecks.',
          'Quantify or cite an example from a project you built to make the answer unforgettable.',
        ],
        idealAnswerHighlights: [
          'Clear definition and contrast between primary alternatives.',
          'Discussion of trade-offs: developer experience vs runtime performance vs infrastructure cost.',
          'Specific scenario or metric demonstrating when to apply the concept.',
        ],
        nextQuestion: {
          id: `q-${nextQNum}-${Date.now()}`,
          questionNumber: nextQNum,
          category: nextQObj.category,
          difficulty: difficulty as 'Junior' | 'Mid' | 'Senior',
          questionText: isFinalRound ? 'INTERVIEW_COMPLETE' : nextQObj.text,
          contextOrTip: isFinalRound ? 'Congratulations! You completed all questions in this mock session.' : nextQObj.tip,
        },
      };
    };

    const evaluationResult = await generateStructuredAIResponse<MockInterviewResponse>(evaluationPrompt, fallbackEvaluation);
    return NextResponse.json(evaluationResult);
  } catch (error) {
    console.error('Error in mock-interview route:', error);
    return NextResponse.json({ error: 'Failed to evaluate interview answer' }, { status: 500 });
  }
}
