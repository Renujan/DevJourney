import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TermIcon, Play, ShieldAlert, Cpu } from 'lucide-react';

export interface TerminalLog {
  text: string;
  type: 'info' | 'error' | 'success' | 'warn' | 'input';
  timestamp: string;
}

interface TerminalProps {
  initialLogs?: TerminalLog[];
  height?: string;
  title?: string;
  interactive?: boolean;
  onExecuteCommand?: (cmd: string) => TerminalLog[] | void;
  showTabs?: boolean;
}

export function Terminal({
  initialLogs = [],
  height = 'h-80',
  title = 'bash - devcorp-core-vm',
  interactive = true,
  onExecuteCommand,
  showTabs = true
}: TerminalProps) {
  const [logs, setLogs] = useState<TerminalLog[]>(initialLogs);
  const [inputVal, setInputVal] = useState('');
  const [activeTab, setActiveTab] = useState<'console' | 'diagnostics'>('console');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialLogs.length > 0) {
      setLogs(initialLogs);
    }
  }, [initialLogs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const time = new Date().toLocaleTimeString();
    const newLogs = [...logs, { text: `devcorp-dev$ ${inputVal}`, type: 'input' as const, timestamp: time }];
    setLogs(newLogs);
    const cmd = inputVal.trim().toLowerCase();
    setInputVal('');

    // Predefined commands
    setTimeout(() => {
      let responseLogs: TerminalLog[] = [];
      if (cmd === 'help') {
        responseLogs = [
          { text: 'Available commands:', type: 'info', timestamp: time },
          { text: '  clear      - Clear the console buffer', type: 'info', timestamp: time },
          { text: '  diagnose   - Run full container diagnostic scan', type: 'info', timestamp: time },
          { text: '  sysinfo    - Output VM architecture specs', type: 'info', timestamp: time },
          { text: '  npm test   - Trigger framework test suites', type: 'info', timestamp: time }
        ];
      } else if (cmd === 'clear') {
        setLogs([]);
        return;
      } else if (cmd === 'diagnose') {
        responseLogs = [
          { text: 'Starting Diagnostic Scan...', type: 'info', timestamp: time },
          { text: '  [✓] Memory allocations: OK (7.4GB/8.0GB free)', type: 'success', timestamp: time },
          { text: '  [✓] V8 Engine version: v12.4.254.20-node.14', type: 'success', timestamp: time },
          { text: '  [!] CORS policy configuration: MISMATCH ON PORT 5173', type: 'warn', timestamp: time },
          { text: '  [✗] API response verification: 404 GET /api/v1/emplyees', type: 'error', timestamp: time }
        ];
      } else if (cmd === 'sysinfo') {
        responseLogs = [
          { text: 'OS: DevCorp Cloud OS v3.2-Generic', type: 'info', timestamp: time },
          { text: 'CPU: Intel Xeon Virtual Core vCPU @ 3.40GHz', type: 'info', timestamp: time },
          { text: 'Kernel: Linux 5.15.0-76-generic x86_64', type: 'info', timestamp: time },
          { text: 'Container ID: devcorp-react-sandbox-0a1f9', type: 'info', timestamp: time }
        ];
      } else if (cmd === 'npm test') {
        responseLogs = [
          { text: 'PASS  src/tests/auth.test.ts (4.21s)', type: 'success', timestamp: time },
          { text: 'FAIL  src/tests/dashboard.test.tsx (0.84s)', type: 'error', timestamp: time },
          { text: '  ● Dashboard › should update data dynamically', type: 'error', timestamp: time },
          { text: '    TypeError: Cannot read properties of undefined (reading \'map\')', type: 'error', timestamp: time }
        ];
      } else if (onExecuteCommand) {
        const customRes = onExecuteCommand(cmd);
        if (customRes) responseLogs = customRes;
      } else {
        responseLogs = [{ text: `Command not found: ${cmd}. Type 'help' for options.`, type: 'error', timestamp: time }];
      }

      setLogs(prev => [...prev, ...responseLogs]);
    }, 400);
  };

  return (
    <div className="w-full glass-panel rounded-xl border border-neon-blue/20 overflow-hidden font-mono shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
      {/* Window Header Header Bar */}
      <div className="bg-cyber-bg/95 border-b border-neon-blue/10 px-4 py-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block shadow-[0_0_8px_#ef4444]" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_8px_#eab308]" />
          <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block shadow-[0_0_8px_#22c55e]" />
          <span className="text-xs text-gray-500 ml-3 flex items-center gap-1">
            <TermIcon className="w-3.5 h-3.5 text-neon-blue" />
            {title}
          </span>
        </div>
        
        {/* Connection status */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] text-neon-green font-bold tracking-wider">ONLINE</span>
        </div>
      </div>

      {/* Tabs */}
      {showTabs && (
        <div className="bg-cyber-bg/40 border-b border-neon-blue/10 flex text-xs">
          <button
            onClick={() => setActiveTab('console')}
            className={`px-4 py-2 border-r border-neon-blue/10 flex items-center gap-1.5 cursor-pointer ${activeTab === 'console' ? 'bg-cyber-bg/90 border-b-2 border-b-neon-blue text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
          >
            <Play className="w-3 h-3 text-neon-blue" />
            <span>Console Log</span>
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`px-4 py-2 border-r border-neon-blue/10 flex items-center gap-1.5 cursor-pointer ${activeTab === 'diagnostics' ? 'bg-cyber-bg/90 border-b-2 border-b-neon-purple text-white' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
          >
            <ShieldAlert className="w-3 h-3 text-neon-purple" />
            <span>Diagnostics</span>
          </button>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'console' ? (
        <div className={`flex flex-col bg-cyber-bg/90 p-4 overflow-y-auto ${height}`} ref={scrollRef}>
          {/* Scrollable logs */}
          <div className="flex-1 flex flex-col gap-1.5 text-xs text-left">
            {logs.map((log, index) => {
              const colors = {
                info: 'text-gray-400',
                error: 'text-red-400 font-bold bg-red-950/20 px-1 border-l border-red-500/30',
                success: 'text-neon-green font-semibold',
                warn: 'text-yellow-400 font-medium',
                input: 'text-neon-cyan font-bold'
              };

              return (
                <div key={index} className={`flex items-start gap-2 ${colors[log.type]}`}>
                  <span className="text-[10px] text-gray-600 select-none">[{log.timestamp}]</span>
                  <span className="whitespace-pre-wrap break-all">{log.text}</span>
                </div>
              );
            })}
          </div>

          {/* Prompt Form */}
          {interactive && (
            <form onSubmit={handleCommandSubmit} className="mt-3 pt-2 border-t border-neon-blue/5 flex items-center gap-2">
              <span className="text-neon-cyan font-bold text-sm">devcorp-dev$</span>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type 'help' and press Enter..."
                className="flex-1 bg-transparent text-white focus:outline-none border-none outline-none font-mono text-sm placeholder-gray-600"
              />
            </form>
          )}
        </div>
      ) : (
        /* Diagnostics Panel */
        <div className={`bg-cyber-bg/90 p-4 text-xs text-left overflow-y-auto flex flex-col gap-4 ${height}`}>
          <div className="flex items-center gap-2 border-b border-neon-purple/20 pb-2">
            <Cpu className="w-4 h-4 text-neon-purple animate-pulse" />
            <span className="font-bold text-white uppercase tracking-wider">DevCorp Diagnostic Report</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neon-blue/10 bg-cyber-bg p-3 rounded-lg flex flex-col gap-1">
              <span className="text-gray-400 font-bold">FRONTEND VM STATUS</span>
              <span className="text-neon-green">Status: Normal (IDLE)</span>
              <span className="text-gray-500 text-[10px]">Framework: React v18.3.1</span>
              <span className="text-gray-500 text-[10px]">Port bindings: localhost:5173</span>
            </div>
            
            <div className="border border-neon-purple/10 bg-cyber-bg p-3 rounded-lg flex flex-col gap-1">
              <span className="text-gray-400 font-bold">API ENDPOINT RESOLUTION</span>
              <span className="text-red-400 font-bold">CORS status: FAILING</span>
              <span className="text-gray-500 text-[10px]">Port bindings: localhost:3000</span>
              <span className="text-gray-500 text-[10px]">Allowed Origins: devcorp.internal</span>
            </div>
          </div>

          <div className="border border-neon-pink/10 bg-cyber-bg/30 p-3 rounded-lg flex flex-col gap-1">
            <span className="text-gray-400 font-bold">PENDING ERRORS RESOLUTION MATRIX</span>
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                <span className="text-red-400 font-bold">HTTP 404 (GET /api/v1/emplyees)</span>
                <span className="text-gray-400">Target: react_basics</span>
              </div>
              <div className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1">
                <span className="text-red-400 font-bold">HTTP 401 (TokenExpiredError)</span>
                <span className="text-gray-400">Target: security_core</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-red-400 font-bold">CORS (Origin Host Blocked)</span>
                <span className="text-gray-400">Target: gateway_routing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
