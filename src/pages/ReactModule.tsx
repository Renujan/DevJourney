import { useState, useEffect } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { reactLessons } from '../data/reactLessons';
import type { ReactLesson } from '../data/reactLessons';
import { cyberAudio } from '../utils/audio';
import { AnimatedCodeBlock } from '../components/AnimatedCodeBlock';
import { Terminal } from '../components/Terminal';
import type { TerminalLog } from '../components/Terminal';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Atom, 
  Play, 
  AlertTriangle, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';

export function ReactModule() {
  const { completedLessons, completeLesson } = useXPSystem();
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const lesson: ReactLesson = reactLessons[currentLessonIdx];

  const [activeStep, setActiveStep] = useState<'intro' | 'code' | 'simulation' | 'solved'>('intro');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  
  // Infinite loop simulation states
  const [apiCallCount, setApiCallCount] = useState(0);
  const [cpuUsage, setCpuUsage] = useState(0);

  useEffect(() => {
    // Reset lesson state
    setActiveStep('intro');
    setApiCallCount(0);
    setCpuUsage(0);
    
    // Simulate incoming chat messages with delay
    setChatMessages([]);
    const messages = [
      `[SysAlert] Alex logged onto the console.`,
      `Alex: "Hey! We have an emergency. ${lesson.story}"`,
      `Alex: "I need you to look at the component code. Here's what we have in production. Can you analyze the hooks design?"`
    ];

    let timerIds: number[] = [];
    messages.forEach((msg, idx) => {
      const tid = window.setTimeout(() => {
        setChatMessages(prev => [...prev, msg]);
      }, (idx + 1) * 800);
      timerIds.push(tid);
    });

    return () => timerIds.forEach(clearTimeout);
  }, [currentLessonIdx]);

  const triggerSimulation = (effect: string) => {
    const time = new Date().toLocaleTimeString();
    
    if (effect === 'infinite-api') {
      setTerminalLogs([
        { text: 'Starting sandbox compiler execution...', type: 'info', timestamp: time },
        { text: 'Listening on localhost:5173', type: 'info', timestamp: time },
        { text: 'GET /api/analytics - Status 200 OK', type: 'success', timestamp: time }
      ]);

      // Set up loop
      let count = 0;
      let cpu = 15;
      const interval = setInterval(() => {
        count += 12;
        cpu = Math.min(100, cpu + 5);
        setApiCallCount(count);
        setCpuUsage(cpu);

        const newLog: TerminalLog = {
          text: `GET /api/analytics - Triggering re-render - Request #${count} (LOOP DETECTED)`,
          type: 'error',
          timestamp: new Date().toLocaleTimeString()
        };
        setTerminalLogs(prev => [...prev.slice(-30), newLog]);

        if (cpu >= 100) {
          clearInterval(interval);
          setTerminalLogs(prev => [
            ...prev,
            { text: 'CRITICAL: Chrome V8 memory allocation limit exceeded.', type: 'error', timestamp: time },
            { text: 'FATAL: React sandbox thread locked. UI frozen.', type: 'error', timestamp: time }
          ]);
          // Shake screen animation using GSAP
          gsap.to('.react-module-container', {
            x: 'random(-10, 10)',
            y: 'random(-10, 10)',
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
              gsap.set('.react-module-container', { clearProps: 'all' });
            }
          });
        }
      }, 100);

    } else if (effect === 'stale-state') {
      setTerminalLogs([
        { text: 'Sandbox runtime active. Click simulator active.', type: 'info', timestamp: time },
        { text: 'User triggers click rapid-fire (3 times)...', type: 'info', timestamp: time },
        { text: 'Closure #1 captures current scope count: 0. queueing timeout (1000ms)', type: 'warn', timestamp: time },
        { text: 'Closure #2 captures current scope count: 0. queueing timeout (1000ms)', type: 'warn', timestamp: time },
        { text: 'Closure #3 captures current scope count: 0. queueing timeout (1000ms)', type: 'warn', timestamp: time }
      ]);

      setTimeout(() => {
        setTerminalLogs(prev => [
          ...prev,
          { text: 'Timeout #1 fires: setLikes(0 + 1) -> state resolved: 1', type: 'success', timestamp: time },
          { text: 'Timeout #2 fires: setLikes(0 + 1) -> state resolved: 1 (STALE STATE)', type: 'error', timestamp: time },
          { text: 'Timeout #3 fires: setLikes(0 + 1) -> state resolved: 1 (STALE STATE)', type: 'error', timestamp: time },
          { text: 'Final state evaluation completed. Output: 1 click registered.', type: 'warn', timestamp: time }
        ]);
      }, 1000);
    } else if (effect === 're-render') {
      setTerminalLogs([
        { text: 'Sandbox runtime evaluation...', type: 'info', timestamp: time },
        { text: 'WARNING: Command rejected. Alex warns: Be careful, analyzing backend wont fix react client loops.', type: 'warn', timestamp: time }
      ]);
    }
  };

  const handleChoiceSelect = (choiceIdx: number) => {
    const choice = lesson.choices[choiceIdx];
    
    setActiveStep('simulation');
    
    if (choice.isCorrect) {
      // Play success chime
      cyberAudio.playSuccess();
      const time = new Date().toLocaleTimeString();
      setTerminalLogs([
        { text: 'Deploying corrected component hooks...', type: 'info', timestamp: time },
        { text: 'Testing lifecycle mounts...', type: 'info', timestamp: time },
        { text: '  [✓] useEffect dependency verified: []', type: 'success', timestamp: time },
        { text: '  [✓] Render passes: 1 (Mounting complete)', type: 'success', timestamp: time },
        { text: 'Verification SUCCESS. Component state is clean.', type: 'success', timestamp: time }
      ]);
      
      setTimeout(() => {
        setActiveStep('solved');
        completeLesson(lesson.id);
      }, 1500);
    } else {
      // Play failure buzz
      cyberAudio.playError();
      triggerSimulation(choice.animationEffect || '');
    }
  };

  const handleNextLesson = () => {
    cyberAudio.playSelect();
    if (currentLessonIdx < reactLessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
    } else {
      alert("All React simulation modules completed! You secured the React Ninja badge ⚛️!");
    }
  };

  return (
    <div className="react-module-container p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Atom className="w-6 h-6 text-neon-blue animate-spin" style={{ animationDuration: '6s' }} />
            React Sandbox Simulator
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Analyze production codes, trigger diagnostic failures, and resolve logical gaps under stress.
          </p>
        </div>
        
        {/* Lesson selector */}
        <div className="flex items-center gap-2 bg-cyber-card border border-white/5 p-1 rounded-lg">
          {reactLessons.map((l, idx) => {
            const isDone = completedLessons.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => {
                  cyberAudio.playSelect();
                  setCurrentLessonIdx(idx);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                  currentLessonIdx === idx 
                    ? 'bg-neon-blue text-black' 
                    : isDone
                      ? 'bg-green-950/20 text-neon-green border border-green-500/20'
                      : 'text-gray-500 hover:text-white'
                }`}
              >
                VM #{l.id} {isDone && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Story Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            DevCorp Slack Messenger
          </h2>

          <div className="glass-panel p-5 rounded-xl border border-neon-blue/20 bg-cyber-card flex-1 flex flex-col gap-4 h-[400px]">
            {/* Chats wrapper */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
              <AnimatePresence>
                {chatMessages.map((msg, index) => {
                  const isAlert = msg.startsWith('[SysAlert]');
                  
                  if (isAlert) {
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-mono text-gray-500 text-center uppercase py-1"
                      >
                        {msg}
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ type: 'spring', stiffness: 100 }}
                      className="flex gap-2.5 items-start text-left"
                    >
                      <div className="w-8 h-8 rounded bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center font-bold text-xs text-neon-blue select-none mt-0.5">
                        AL
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">Alex (Lead Dev)</span>
                          <span className="text-[9px] text-gray-500">10:24 AM</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed bg-white/5 border border-white/5 p-2 rounded-lg rounded-tl-none mt-1">
                          {msg.replace('Alex: ', '')}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Step trigger button */}
            {chatMessages.length >= 3 && activeStep === 'intro' && (
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveStep('code')}
                className="w-full mt-2"
              >
                <span>Launch Diagnostics Sandbox &rarr;</span>
              </Button>
            )}
          </div>

          {/* Interactive options card */}
          {activeStep === 'code' && (
            <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 flex flex-col gap-3">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neon-blue" />
                Select Troubleshooting Action
              </h3>

              <div className="flex flex-col gap-2 mt-2">
                {lesson.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoiceSelect(idx)}
                    className="w-full text-left p-3.5 rounded-lg border border-white/5 bg-white/5 text-xs text-gray-300 hover:bg-neon-purple/5 hover:border-neon-purple/40 hover:text-white transition-all duration-300 cursor-pointer font-sans"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Correct Explanation screen */}
          {activeStep === 'solved' && (
            <div className="glass-panel p-5 rounded-xl border border-neon-green/40 bg-gradient-to-b from-green-950/20 to-transparent flex flex-col gap-4">
              <div className="flex items-center gap-2 text-neon-green border-b border-white/5 pb-2">
                <ShieldCheck className="w-5 h-5 text-neon-green" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">CLEARANCE GRANTED (+10 XP)</span>
              </div>
              
              <h3 className="text-sm font-bold text-white">{lesson.title} Solved!</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-sans">{lesson.explanation}</p>
              
              <div className="bg-black/30 p-3 rounded border border-white/5 text-[11px] text-gray-400 leading-relaxed font-mono">
                <span className="text-neon-cyan font-bold block mb-1">INTERVIEW ALIGNMENT:</span>
                <span className="text-white font-bold">{lesson.interviewQ}</span>
                <p className="mt-1">{lesson.interviewAnswer}</p>
              </div>

              <Button
                variant="success"
                size="md"
                className="w-full"
                onClick={handleNextLesson}
              >
                <span>Proceed to Next VM Module &rarr;</span>
              </Button>
            </div>
          )}

          {/* Simulation Output and Restart option */}
          {activeStep === 'simulation' && cpuUsage >= 100 && (
            <div className="glass-panel p-5 rounded-xl border border-red-500/40 bg-gradient-to-b from-red-950/20 to-transparent flex flex-col gap-3">
              <div className="flex items-center gap-2 text-red-500 font-bold border-b border-white/5 pb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest">VM INSTANCE CRASHED</span>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed">
                The sandbox encountered a runtime panic. The browser main-thread got stuck executing layout renders.
              </p>

              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={() => {
                  setActiveStep('code');
                  setCpuUsage(0);
                  setApiCallCount(0);
                  setTerminalLogs([]);
                }}
              >
                <span>Reset and Refactor Code &larr;</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right Code Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            Component Sandbox VM
          </h2>

          {activeStep === 'intro' ? (
            <div className="glass-panel p-6 rounded-xl border border-white/5 flex-1 flex flex-col items-center justify-center text-center gap-2">
              <Play className="w-10 h-10 text-gray-600 animate-pulse" />
              <span className="text-xs text-gray-500 font-mono font-bold uppercase">Sandbox Sleeping</span>
              <p className="text-[10px] text-gray-600">
                Analyze Alex's message to compile the container VM.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              {/* Code block */}
              <AnimatedCodeBlock 
                code={lesson.code}
                filename="Dashboard.tsx"
                buggyLines={lesson.id === 1 ? [15] : [9]}
              />

              {/* Dynamic simulation analytics panel for useEffect infinite loop */}
              {activeStep === 'simulation' && lesson.id === 1 && cpuUsage > 0 && (
                <div className="glass-panel p-4 rounded-xl border border-red-500/20 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-mono">API REQUEST COUNTER</span>
                    <span className="text-lg font-bold text-red-500 font-mono tracking-wider animate-pulse">
                      {apiCallCount} reqs
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-mono">CLIENT CPU LOAD</span>
                    <span className={`text-lg font-bold font-mono tracking-wider ${cpuUsage >= 90 ? 'text-red-500 animate-bounce' : 'text-yellow-500'}`}>
                      {cpuUsage}%
                    </span>
                  </div>
                </div>
              )}

              {/* Console log */}
              <Terminal
                initialLogs={terminalLogs}
                interactive={false}
                showTabs={false}
                height="h-56"
                title="devcorp-sandbox-vm console"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
