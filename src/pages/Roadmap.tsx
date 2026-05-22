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
  const { completedRoadmap, completeRoadmapNode } = useXPSystem();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizError, setQuizError] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);
  
  const [projectCode, setProjectCode] = useState('');
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [projectError, setProjectError] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'quiz' | 'project'>('quiz');
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

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
    if (!selectedNode || !quizSuccess || !projectSuccess) return;
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

                      {activeTopic.codeSnippet && (
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
                            {activeTopic.codeSnippet}
                          </pre>
                        </div>
                      )}

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
              <div className="lg:col-span-2 h-full flex flex-col p-6 bg-cyber-bg/30 overflow-y-auto scrollbar-thin border-t lg:border-t-0 lg:border-l border-cyber-border">
                <div className="border-b border-cyber-border pb-2 mb-4">
                  <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-widest uppercase">
                    PRACTICE & VALIDATE
                  </span>
                </div>

                {/* Workspace Navigation tabs */}
                <div className="flex bg-cyber-bg/50 border border-cyber-border p-1 rounded-lg mb-4">
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'quiz' 
                        ? 'bg-neon-cyan text-black font-bold' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Module Quiz</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('project')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-semibold cursor-pointer transition-colors ${
                      activeTab === 'project' 
                        ? 'bg-neon-cyan text-black font-bold' 
                        : 'text-text-muted hover:text-text-main'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Mini Sandbox</span>
                  </button>
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

                  {/* Secure Node Button */}
                  {quizSuccess && projectSuccess && (
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
        </div>
      )}
    </div>
  );
}
