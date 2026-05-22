import { useState, useEffect } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { backendLessons } from '../data/backendLessons';
import type { BackendLesson } from '../data/backendLessons';
import { cyberAudio } from '../utils/audio';
import { AnimatedCodeBlock } from '../components/AnimatedCodeBlock';
import { Terminal } from '../components/Terminal';
import type { TerminalLog } from '../components/Terminal';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, 
  Play, 
  AlertTriangle, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import gsap from 'gsap';

export function BackendModule() {
  const { completedLessons, completeLesson } = useXPSystem();
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const lesson: BackendLesson = backendLessons[currentLessonIdx];

  const [activeStep, setActiveStep] = useState<'intro' | 'code' | 'simulation' | 'solved'>('intro');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  
  // Scraper simulator states
  const [requestCount, setRequestCount] = useState(0);
  const [serverMemory, setServerMemory] = useState(128); // MB

  useEffect(() => {
    // Reset lesson state
    setActiveStep('intro');
    setRequestCount(0);
    setServerMemory(128);
    
    // Simulate incoming chat messages with delay
    setChatMessages([]);
    const messages = [
      `[SysAlert] Alex connected from local dev terminal.`,
      `Alex: "Emergency! ${lesson.story}"`,
      `Alex: "I need you to review this node controller script. Can you see how it handles incoming queries?"`
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
    
    if (effect === 'hacker-matrix') {
      setTerminalLogs([
        { text: 'Listening on local docker gateway...', type: 'info', timestamp: time },
        { text: 'HACKER SCRIPT INITIALIZED.', type: 'warn', timestamp: time },
        { text: 'POST /api/login - payload: { username: "admin\' OR \'1\'=\'1", password: "" }', type: 'input', timestamp: time }
      ]);

      // Matrix effect simulation
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setTerminalLogs(prev => [
          ...prev,
          {
            text: `SQL EXECUTED -> SELECT * FROM users WHERE user = 'admin' OR '1'='1' (ALWAYS TRUE) - RECORD FOUND`,
            type: 'error',
            timestamp: new Date().toLocaleTimeString()
          },
          {
            text: `AUTHENTICATION OVERRIDDEN. JWT issued for UID 1 (Admin Profile: Alex)`,
            type: 'success',
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        if (count >= 3) {
          clearInterval(interval);
          setTerminalLogs(prev => [
            ...prev,
            { text: 'WARNING: DB root credentials breached. Firewall blocked.', type: 'error', timestamp: time }
          ]);
          // Shake screen animation using GSAP
          gsap.to('.backend-module-container', {
            x: 'random(-10, 10)',
            y: 'random(-10, 10)',
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
              gsap.set('.backend-module-container', { clearProps: 'all' });
            }
          });
        }
      }, 300);

    } else if (effect === 'ddos-loop') {
      setTerminalLogs([
        { text: 'Attacking scraper started: Threadpool active', type: 'info', timestamp: time },
        { text: 'IP 182.16.82.90 spamming /api/products', type: 'warn', timestamp: time }
      ]);

      // Set up loop
      let count = 0;
      let memory = 128;
      const interval = setInterval(() => {
        count += 80;
        memory = Math.min(1024, memory + 64);
        setRequestCount(count);
        setServerMemory(memory);

        const newLog: TerminalLog = {
          text: `GET /api/products - Request #${count} - DB Connection Pool size: 10/10 (FULL)`,
          type: 'error',
          timestamp: new Date().toLocaleTimeString()
        };
        setTerminalLogs(prev => [...prev.slice(-30), newLog]);

        if (memory >= 1024) {
          clearInterval(interval);
          setTerminalLogs(prev => [
            ...prev,
            { text: 'DB POOL EXHAUSTED: Pool timeout error (30000ms)', type: 'error', timestamp: time },
            { text: 'FATAL: Server crashed. Memory leak detected.', type: 'error', timestamp: time }
          ]);
          gsap.to('.backend-module-container', {
            x: 'random(-10, 10)',
            y: 'random(-10, 10)',
            duration: 0.1,
            repeat: 5,
            yoyo: true,
            onComplete: () => {
              gsap.set('.backend-module-container', { clearProps: 'all' });
            }
          });
        }
      }, 100);
    } else if (effect === 're-render') {
      setTerminalLogs([
        { text: 'Server parser initialized...', type: 'info', timestamp: time },
        { text: 'ERROR: Input command rejected. Alex: "That is incorrect, please select the right middleware configurations."', type: 'warn', timestamp: time }
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
        { text: 'Deploying backend configuration fixes...', type: 'info', timestamp: time },
        { text: 'Sanitizing API query inputs...', type: 'info', timestamp: time },
        { text: '  [✓] Security filters injected: OK', type: 'success', timestamp: time },
        { text: '  [✓] Request headers validation: COMPLIANT', type: 'success', timestamp: time },
        { text: 'System verification SUCCESS. Backend server secured.', type: 'success', timestamp: time }
      ]);
      
      setTimeout(() => {
        setActiveStep('solved');
        completeLesson(lesson.id);
      }, 1500);
    } else {
      // Play error buzz
      cyberAudio.playError();
      triggerSimulation(choice.animationEffect || '');
    }
  };

  const handleNextLesson = () => {
    cyberAudio.playSelect();
    if (currentLessonIdx < backendLessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
    } else {
      alert("All Backend VM modules completed! You secured the API Master badge 🌐!");
    }
  };

  return (
    <div className="backend-module-container p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Server className="w-6 h-6 text-neon-purple animate-pulse" />
            Backend VM Sandbox
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Validate query structures, mitigate DDoS vectors, and audit production express controllers.
          </p>
        </div>
        
        {/* Lesson selector */}
        <div className="flex items-center gap-2 bg-cyber-card border border-white/5 p-1 rounded-lg">
          {backendLessons.map((l, idx) => {
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
                    ? 'bg-neon-purple text-white' 
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

          <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 bg-cyber-card flex-1 flex flex-col gap-4 h-[400px]">
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
                      <div className="w-8 h-8 rounded bg-neon-purple/15 border border-neon-purple/30 flex items-center justify-center font-bold text-xs text-neon-purple select-none mt-0.5">
                        AL
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">Alex (Security Lead)</span>
                          <span className="text-[9px] text-gray-500">11:02 AM</span>
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
                <span>Launch Security Sandbox &rarr;</span>
              </Button>
            )}
          </div>

          {/* Interactive options card */}
          {activeStep === 'code' && (
            <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 flex flex-col gap-3">
              <h3 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neon-purple" />
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
          {activeStep === 'simulation' && serverMemory >= 1024 && (
            <div className="glass-panel p-5 rounded-xl border border-red-500/40 bg-gradient-to-b from-red-950/20 to-transparent flex flex-col gap-3">
              <div className="flex items-center gap-2 text-red-500 font-bold border-b border-white/5 pb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs font-mono uppercase tracking-widest">SERVER CONTAINER PANIC</span>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed">
                The container VM crashed due to database pool exhaustion. Express returned 504 gateway timeouts.
              </p>

              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={() => {
                  setActiveStep('code');
                  setServerMemory(128);
                  setRequestCount(0);
                  setTerminalLogs([]);
                }}
              >
                <span>Reset Sandbox &larr;</span>
              </Button>
            </div>
          )}
        </div>

        {/* Right Code Column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            Server Controller VM
          </h2>

          {activeStep === 'intro' ? (
            <div className="glass-panel p-6 rounded-xl border border-white/5 flex-1 flex flex-col items-center justify-center text-center gap-2">
              <Play className="w-10 h-10 text-gray-600 animate-pulse" />
              <span className="text-xs text-gray-500 font-mono font-bold uppercase">Sandbox Sleeping</span>
              <p className="text-[10px] text-gray-600">
                Analyze Alex's instructions to run compiler container.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4">
              {/* Code block */}
              <AnimatedCodeBlock 
                code={lesson.code}
                filename={lesson.id === 3 ? "authController.ts" : "server.ts"}
                buggyLines={lesson.id === 3 ? [9] : [8]}
              />

              {/* Dynamic simulation analytics panel for DDOS / Hacker queries */}
              {activeStep === 'simulation' && (
                <div className="glass-panel p-4 rounded-xl border border-red-500/20 grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-mono">
                      {lesson.id === 3 ? "SQL INJECTION DETECTED" : "DDoS TRAFFIC LEVEL"}
                    </span>
                    <span className="text-sm font-bold text-red-500 font-mono tracking-wider animate-pulse">
                      {lesson.id === 3 ? "admin' OR '1'='1" : `${requestCount} reqs`}
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 font-mono">NODE THREAD MEMORY</span>
                    <span className={`text-sm font-bold font-mono tracking-wider ${serverMemory >= 512 ? 'text-red-500 animate-bounce' : 'text-yellow-500'}`}>
                      {lesson.id === 3 ? "BREACHED" : `${serverMemory} MB / 1024 MB`}
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
                title="devcorp-server console"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
