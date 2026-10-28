'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  Loader2, 
  Lightbulb, 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  Trophy 
} from 'lucide-react';
import { MockInterviewResponse } from '@/lib/gemini';

interface InterviewRound {
  questionNumber: number;
  questionText: string;
  category: string;
  userAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  idealAnswerHighlights: string[];
}

export default function MockInterviewTool() {
  const [domain, setDomain] = useState('Web Development');
  const [role, setRole] = useState('Frontend Developer');
  const [difficulty, setDifficulty] = useState<'Junior' | 'Mid' | 'Senior'>('Junior');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentTip, setCurrentTip] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Technical');
  const [userAnswer, setUserAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<MockInterviewResponse | null>(null);

  const [roundsHistory, setRoundsHistory] = useState<InterviewRound[]>([]);

  const handleStartSession = async () => {
    setIsLoading(true);
    setRoundsHistory([]);
    setIsComplete(false);
    setLastEvaluation(null);
    setCurrentQuestionNumber(1);
    setUserAnswer('');

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          role,
          difficulty,
          questionNumber: 1,
          userAnswer: '',
        }),
      });

      const data: MockInterviewResponse = await res.json();
      setCurrentQuestionText(data.nextQuestion.questionText);
      setCurrentTip(data.nextQuestion.contextOrTip);
      setCurrentCategory(data.nextQuestion.category);
      setIsSessionActive(true);
    } catch (err) {
      console.error(err);
      alert('Failed to start interview session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          role,
          difficulty,
          questionNumber: currentQuestionNumber,
          currentQuestion: currentQuestionText,
          userAnswer,
          history: roundsHistory,
        }),
      });

      const evalData: MockInterviewResponse = await res.json();
      setLastEvaluation(evalData);

      const roundRecord: InterviewRound = {
        questionNumber: currentQuestionNumber,
        questionText: currentQuestionText,
        category: currentCategory,
        userAnswer,
        score: evalData.score,
        feedback: evalData.feedback,
        strengths: evalData.strengths,
        improvements: evalData.improvements,
        idealAnswerHighlights: evalData.idealAnswerHighlights,
      };

      setRoundsHistory((prev) => [...prev, roundRecord]);

      if (evalData.score >= 8) {
        confetti({
          particleCount: 30,
          spread: 60,
          colors: ['#ffffff', '#cbd5e1', '#94a3b8'],
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error(err);
      alert('Error evaluating answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (!lastEvaluation) return;

    if (
      lastEvaluation.nextQuestion.questionText === 'INTERVIEW_COMPLETE' ||
      currentQuestionNumber >= 5
    ) {
      setIsComplete(true);
      confetti({
        particleCount: 70,
        spread: 90,
        colors: ['#ffffff', '#e2e8f0', '#64748b'],
        origin: { y: 0.6 },
      });
      return;
    }

    setCurrentQuestionNumber(lastEvaluation.nextQuestion.questionNumber);
    setCurrentQuestionText(lastEvaluation.nextQuestion.questionText);
    setCurrentTip(lastEvaluation.nextQuestion.contextOrTip);
    setCurrentCategory(lastEvaluation.nextQuestion.category);
    setUserAnswer('');
    setLastEvaluation(null);
  };

  const averageScore = roundsHistory.length > 0
    ? (roundsHistory.reduce((acc, r) => acc + r.score, 0) / roundsHistory.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {!isSessionActive && !isComplete && (
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center border border-white/20">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">Live AI Mock Interviewer</h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mb-6">
            Practice realistic, one-question-at-a-time technical and behavioral interview questions. Get immediate feedback, scores out of 10, strengths, improvement areas, and ideal response highlights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white bg-black/90 border border-white/15"
              >
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, DevOps Specialist..."
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Interview Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Junior' | 'Mid' | 'Senior')}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs sm:text-sm text-white bg-black/90 border border-white/15"
              >
                <option value="Junior">Junior / Entry-Level</option>
                <option value="Mid">Mid-Level Engineer</option>
                <option value="Senior">Senior / Staff Engineer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleStartSession}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl glossy-btn-white disabled:opacity-50 text-sm transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Preparing Question 1 with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Start 5-Question Mock Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Question & Answer Interface */}
      {isSessionActive && !isComplete && (
        <div className="space-y-6">
          {/* Progress / Status Header */}
          <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/15 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white font-black text-xs flex items-center justify-center border border-white/20 font-mono">
                {currentQuestionNumber}/5
              </span>
              <div>
                <div className="text-xs font-bold text-white font-mono">
                  Round {currentQuestionNumber}: {currentCategory}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {role} • {difficulty} Level
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    num < currentQuestionNumber
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                      : num === currentQuestionNumber
                      ? 'bg-neutral-400 ring-2 ring-white/40'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white border border-white/20 font-mono">
                Question {currentQuestionNumber}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-neutral-300">
                {currentCategory}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-4">
              &ldquo;{currentQuestionText}&rdquo;
            </h3>

            {currentTip && (
              <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/15 flex items-start gap-2.5 text-xs text-neutral-300">
                <Lightbulb className="w-4 h-4 text-white shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Interviewer Context: </strong>
                  {currentTip}
                </div>
              </div>
            )}
          </div>

          {/* User Answer Area */}
          {!lastEvaluation ? (
            <form onSubmit={handleSubmitAnswer} className="glass-panel rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                  Your Spoken / Written Answer
                </label>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {userAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer as if speaking to the interviewer. Provide concrete examples, architecture decisions, and explain trade-offs..."
                rows={6}
                className="w-full p-4 rounded-xl glass-input text-xs sm:text-sm text-white placeholder-neutral-500 resize-y"
                required
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  Tip: Be specific. Mention how you handle errors, scale, or metrics.
                </p>

                <button
                  type="submit"
                  disabled={isLoading || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl glossy-btn-white disabled:opacity-50 text-xs sm:text-sm transition-all flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Grading with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Answer for Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-fadeIn">
              <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/15 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                      Round {currentQuestionNumber} Evaluation
                    </span>
                    <h4 className="text-xl font-bold text-white mt-1">Interviewer Feedback</h4>
                  </div>

                  <div className="flex items-center gap-3 font-mono">
                    <div className="text-right">
                      <div className="text-[11px] text-neutral-400">Score</div>
                      <div className="text-xs font-semibold text-white">
                        {lastEvaluation.score >= 8 ? 'Outstanding' : lastEvaluation.score >= 6 ? 'Competent' : 'Needs Polish'}
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-xl border bg-white/10 text-white border-white/30 shadow-lg">
                      {lastEvaluation.score}
                      <span className="text-[8px] uppercase tracking-wider -mt-1 font-semibold text-neutral-400">/ 10</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/10">
                  {lastEvaluation.feedback}
                </p>

                {/* Strengths & Improvements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2.5">
                      <ThumbsUp className="w-3.5 h-3.5 text-white" />
                      <span>What You Articulated Well:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {lastEvaluation.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/15">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 mb-2.5">
                      <ThumbsDown className="w-3.5 h-3.5 text-neutral-400" />
                      <span>What Was Missing / Needs Work:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {lastEvaluation.improvements.map((imp, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal Highlights */}
                {lastEvaluation.idealAnswerHighlights.length > 0 && (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                      <span>Ideal Answer Key Highlights (What Seniors Cover):</span>
                    </div>
                    <div className="space-y-1 text-xs text-neutral-300">
                      {lastEvaluation.idealAnswerHighlights.map((hl, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-white font-mono text-[11px]">•</span>
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 rounded-xl glossy-btn-white text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <span>
                      {currentQuestionNumber >= 5 || lastEvaluation.nextQuestion.questionText === 'INTERVIEW_COMPLETE'
                        ? 'Finish Interview & See Full Scorecard'
                        : `Proceed to Question ${currentQuestionNumber + 1}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Final Session Scorecard Summary */}
      {isComplete && (
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/20 space-y-8 animate-fadeIn">
          <div className="text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-white/10 border-2 border-white/30 text-white flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
              Interview Concluded
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-2">
              Candidate Performance Scorecard
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              5-question round completed for {role} ({difficulty} Level).
            </p>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.04] border border-white/15 mt-6 font-mono">
              <div className="text-left">
                <div className="text-[11px] text-neutral-400">Cumulative Score</div>
                <div className="text-2xl font-black text-white">
                  {averageScore} / 10
                </div>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="text-left">
                <div className="text-[11px] text-neutral-400">Readiness Status</div>
                <div className="text-xs font-bold text-white">
                  {Number(averageScore) >= 7.5 ? 'Strong Hire / Ready' : 'Solid Base / Review Gaps'}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-bold text-white">Rounds Recap</h4>
            {roundsHistory.map((round) => (
              <div key={round.questionNumber} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Round {round.questionNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-400">{round.category}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{round.score} / 10</span>
                </div>
                <div className="text-xs font-semibold text-white">&ldquo;{round.questionText}&rdquo;</div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">{round.feedback}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setIsComplete(false);
                setIsSessionActive(false);
              }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start Another Mock Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
