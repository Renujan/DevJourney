import { useState, useEffect, useRef } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { interviewQuestions } from '../data/interviewQuestions';
import type { InterviewQuestion } from '../data/interviewQuestions';
import { Button } from '../components/Button';
import { cyberAudio } from '../utils/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Play,
  Award,
  Zap,
  RotateCcw
} from 'lucide-react';

export function InterviewArena() {
  const { submitInterviewScore, interviewScores } = useXPSystem();
  
  // Settings
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'developer' | 'senior' | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Round states
  const [userText, setUserText] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [stage, setStage] = useState<'answering' | 'evaluating' | 'summary'>('answering');
  const [roundScore, setRoundScore] = useState(0);

  // References
  const timerRef = useRef<any>(null);

  const startSession = (level: 'beginner' | 'developer' | 'senior') => {
    cyberAudio.playSelect();
    setSelectedLevel(level);
    const filtered = interviewQuestions.filter(q => q.level === level);
    setQuestions(filtered);
    setCurrentIdx(0);
    setRoundScore(0);
    setUserText('');
    setStage('answering');
    setSessionActive(true);
    initializeQuestion(filtered[0]);
  };

  const initializeQuestion = (q: InterviewQuestion) => {
    setTimeLeft(q.timeLimit);
    setUserText('');
    setStage('answering');
    setTimerRunning(true);
  };

  // Timer loop
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      // Auto Lock Answer
      lockAnswer();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, timerRunning]);

  const lockAnswer = () => {
    cyberAudio.playPulse();
    setTimerRunning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setStage('evaluating');
  };

  const handleSelfEvaluation = (scoreEarned: number) => {
    if (scoreEarned > 0) {
      cyberAudio.playSuccess();
    } else {
      cyberAudio.playError();
    }
    setRoundScore(prev => prev + scoreEarned);
    
    // Check next question
    if (currentIdx < questions.length - 1) {
      const nextQIdx = currentIdx + 1;
      setCurrentIdx(nextQIdx);
      initializeQuestion(questions[nextQIdx]);
    } else {
      // End session
      setStage('summary');
      setTimerRunning(false);
      // Submit score to Zustand
      const finalCorrectAnswers = Math.round((roundScore + scoreEarned) / 10); // Approximation of answers correct
      if (selectedLevel) {
        submitInterviewScore(selectedLevel, Math.min(questions.length, finalCorrectAnswers));
      }
    }
  };

  const currentQ: InterviewQuestion | undefined = questions[currentIdx];

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Mic className="w-6 h-6 text-neon-green" />
          Technical Interview Arena
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Survive intense timed interview panels. Draft your solution, review model benchmark reports, and score your compliance keys.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!sessionActive ? (
          /* Select Mode Landing Page */
          <motion.div
            key="select-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Level selection panels */}
            {['beginner', 'developer', 'senior'].map((level) => {
              const details = {
                beginner: {
                  title: "Beginner Mode (HR & General)",
                  desc: "Master REST protocols, clean styling variables, and baseline programming lifecycles.",
                  timer: "30s time limit",
                  color: "border-neon-green/20 hover:border-neon-green/60 text-neon-green",
                  bgGlow: "hover:shadow-[0_0_20px_rgba(57,255,20,0.15)]",
                  btnText: "Initialize beginner panel",
                  bestScore: interviewScores.beginner || 0
                },
                developer: {
                  title: "Developer Mode (React & Backend)",
                  desc: "Dive deep into Virtual DOM reconciliations, state closure hazards, and JWT token standards.",
                  timer: "30s time limit",
                  color: "border-neon-blue/20 hover:border-neon-blue/60 text-neon-blue",
                  bgGlow: "hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]",
                  btnText: "Launch Developer panel",
                  bestScore: interviewScores.developer || 0
                },
                senior: {
                  title: "Senior Architect (System Design)",
                  desc: "Coordinate decoupled message queues, persistent WebSockets adapters, and horizontal DB replication layouts.",
                  timer: "45s time limit",
                  color: "border-neon-purple/20 hover:border-neon-purple/60 text-neon-purple",
                  bgGlow: "hover:shadow-[0_0_20px_rgba(181,23,158,0.15)]",
                  btnText: "Access Architect board",
                  bestScore: interviewScores.senior || 0
                }
              }[level as 'beginner' | 'developer' | 'senior'];

              return (
                <div 
                  key={level}
                  className={`glass-panel p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 ${details.color} ${details.bgGlow}`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-gray-500 font-bold uppercase tracking-wider">
                      INTERVIEW TIER
                    </span>
                    <h3 className="text-base font-bold text-white tracking-wide mt-1">{details.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed mt-1">{details.desc}</p>
                    
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono mt-3">
                      <Clock className="w-3.5 h-3.5 text-gray-500" />
                      <span>{details.timer}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mt-2 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-gray-500 uppercase">Best Record</span>
                      <span className="text-xs font-mono font-bold text-white">
                        {details.bestScore} / {level === 'beginner' ? 1 : level === 'developer' ? 2 : 1} cleared
                      </span>
                    </div>
                    
                    <Button
                      variant={level === 'beginner' ? 'success' : level === 'developer' ? 'primary' : 'cyber'}
                      size="sm"
                      onClick={() => startSession(level as 'beginner' | 'developer' | 'senior')}
                    >
                      <Play className="w-3 h-3" />
                      <span>Start &rarr;</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          /* Active Interview Workspace */
          <motion.div
            key="active-session"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Q & Response Panel */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4 bg-cyber-card">
                
                {/* Panel status details */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-neon-green font-bold">
                      QUESTION {currentIdx + 1} OF {questions.length}
                    </span>
                    <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 capitalize">
                      {currentQ?.category}
                    </span>
                  </div>
                  
                  {/* Timer UI */}
                  {stage === 'answering' && (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded bg-black/45 border font-mono text-xs ${
                      timeLeft < 10 ? 'border-red-500 text-red-500 animate-pulse' : 'border-neon-cyan/20 text-neon-cyan'
                    }`}>
                      <Clock className={`w-3.5 h-3.5 ${timeLeft < 10 ? 'animate-bounce' : ''}`} />
                      <span>{timeLeft}s remaining</span>
                    </div>
                  )}
                </div>

                {/* Actual Question */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-white leading-relaxed">
                    {currentQ?.question}
                  </h3>
                </div>

                {/* Response area */}
                {stage === 'answering' ? (
                  <div className="flex flex-col gap-3 mt-2">
                    <span className="text-[10px] font-mono text-gray-500">YOUR RESPONSE CONSOLE:</span>
                    <textarea
                      value={userText}
                      onChange={(e) => setUserText(e.target.value)}
                      placeholder="Draft your solution details here... Be precise, describe algorithms, key hooks, or security layers."
                      rows={6}
                      className="w-full bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-xs text-white focus:outline-none focus:border-neon-green resize-none"
                    />

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="md"
                        onClick={lockAnswer}
                      >
                        <span>Lock In Solution &rarr;</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Evaluated Benchmark Panel */
                  <div className="flex flex-col gap-4 mt-2">
                    <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-widest uppercase">
                      SYSTEM BENCHMARK ANSWERS
                    </span>

                    <div className="grid grid-cols-1 gap-3 font-sans text-xs">
                      {/* Ideal answer */}
                      <div className="border border-green-500/20 bg-green-950/5 p-3 rounded-lg flex flex-col gap-1">
                        <span className="text-neon-green font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Ideal Mid-Level Response:
                        </span>
                        <p className="text-gray-300 leading-relaxed mt-0.5">{currentQ?.idealAnswer}</p>
                      </div>

                      {/* Senior Answer */}
                      <div className="border border-neon-purple/20 bg-neon-purple/5 p-3 rounded-lg flex flex-col gap-1">
                        <span className="text-neon-purple font-bold flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 animate-pulse" />
                          Senior Architect Response:
                        </span>
                        <p className="text-gray-300 leading-relaxed mt-0.5">{currentQ?.seniorAnswer}</p>
                      </div>

                      {/* Common mistakes */}
                      <div className="border border-red-500/20 bg-red-950/5 p-3 rounded-lg flex flex-col gap-1">
                        <span className="text-red-400 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Common Pitfalls to Avoid:
                        </span>
                        <p className="text-red-300/80 leading-relaxed mt-0.5">{currentQ?.commonMistakes}</p>
                      </div>

                      {/* How the Interviewer Thinks */}
                      <div className="border border-neon-cyan/20 bg-cyber-bg/40 p-3.5 rounded-lg flex flex-col gap-2 font-mono text-[11px] leading-relaxed">
                        <span className="text-neon-cyan font-bold flex items-center gap-1.5">
                          💡 HOW THE INTERVIEWER EVALUATES ANSWERS:
                        </span>
                        <ul className="list-disc pl-4 space-y-1.5 text-gray-400 font-sans text-xs">
                          <li>
                            <span className="text-red-400 font-bold font-mono">Beginner Answer &rarr; "Okay"</span>: Focuses purely on definitions or simple syntax. <span className="text-gray-500 font-mono text-[10px]">(Interviewer: "Has read tutorials, but lacks practical execution experience.")</span>
                          </li>
                          <li>
                            <span className="text-neon-blue font-bold font-mono">Structured Answer &rarr; "Strong"</span>: Explains the underlying lifecycle mechanisms, dependencies, and safety state hooks. <span className="text-gray-300 font-mono text-[10px]">(Interviewer: "Solid engineer, understands tradeoffs, writes clean code.")</span>
                          </li>
                          <li>
                            <span className="text-neon-purple font-bold font-mono">Real-World Example &rarr; "Impressive"</span>: Mentions architectural patterns, database bottlenecks, security compliance rules, or race conditions. <span className="text-neon-cyan font-mono text-[10px]">(Interviewer: "Excellent seniority, fits complex microservice scopes immediately.")</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Grading Desk */}
            <div className="flex flex-col gap-4">
              <h2 className="text-md font-bold text-white tracking-wide font-sans">
                Evaluation Panel
              </h2>

              {stage === 'answering' ? (
                <div className="glass-panel p-5 rounded-xl border border-white/5 flex-1 flex flex-col items-center justify-center text-center p-6 gap-3">
                  <Clock className="w-12 h-12 text-gray-600 animate-pulse" />
                  <span className="text-xs text-gray-500 font-mono font-bold uppercase">Time active</span>
                  <p className="text-[10px] text-gray-600 max-w-[180px] leading-relaxed">
                    Provide an answer in the text box. The panel locks details automatically when timer resolves.
                  </p>
                </div>
              ) : stage === 'evaluating' ? (
                <div className="glass-panel p-5 rounded-xl border border-neon-green/30 bg-gradient-to-b from-neon-green/5 to-cyber-bg flex-1 flex flex-col gap-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-neon-green font-bold uppercase tracking-widest">
                      EVALUATION SCORE
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">Review Your Response</h3>
                  </div>

                  <div className="bg-black/35 p-3.5 rounded border border-white/10 flex flex-col gap-2 font-mono text-[11px] max-h-44 overflow-y-auto">
                    <span className="text-gray-500 block">Your drafted answer:</span>
                    <p className="text-gray-300 italic">"{userText || '[No Answer Registered]'}"</p>
                  </div>

                  <div className="flex flex-col gap-2.5 mt-2">
                    <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">
                      Select equivalent response match:
                    </span>
                    
                    <button
                      onClick={() => handleSelfEvaluation(10)}
                      className="w-full text-left p-3 rounded-lg border border-neon-purple/30 bg-neon-purple/5 text-xs text-white hover:border-neon-purple font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between"
                    >
                      <span>Matches Senior Answer 🧠</span>
                      <span className="text-neon-purple font-bold font-mono">+10 XP</span>
                    </button>

                    <button
                      onClick={() => handleSelfEvaluation(5)}
                      className="w-full text-left p-3 rounded-lg border border-neon-blue/30 bg-neon-blue/5 text-xs text-white hover:border-neon-blue font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between"
                    >
                      <span>Matches Ideal Answer 💻</span>
                      <span className="text-neon-blue font-bold font-mono">+5 XP</span>
                    </button>

                    <button
                      onClick={() => handleSelfEvaluation(0)}
                      className="w-full text-left p-3 rounded-lg border border-red-500/20 bg-red-950/20 text-xs text-red-300 hover:border-red-500 font-semibold transition-all duration-300 cursor-pointer flex items-center justify-between"
                    >
                      <span>Contains Mistakes / Missed ❌</span>
                      <span className="text-red-400 font-bold font-mono">+0 XP</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Round Summary */
                <div className="glass-panel p-5 rounded-xl border border-neon-green/40 bg-gradient-to-b from-green-950/10 to-cyber-bg flex-1 flex flex-col justify-between gap-4">
                  <div className="border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-neon-green font-bold uppercase tracking-widest">
                      VM SCORE REPORT
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1">Evaluation Completed!</h3>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3">
                    <Award className="w-14 h-14 text-yellow-400 animate-bounce" />
                    <span className="text-sm font-bold text-white font-mono uppercase">
                      Cleared Panel Matrix
                    </span>
                    <div className="text-2xl font-extrabold text-neon-green font-mono tracking-wider">
                      +{roundScore} XP SECURED
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">
                      Your diagnostic evaluations have been saved to the credentials local DB cache.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => setSessionActive(false)}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Return to Arena Lobby</span>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
