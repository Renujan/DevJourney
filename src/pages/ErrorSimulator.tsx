import { useState } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { errorCases } from '../data/errorCases';
import type { ErrorCase } from '../data/errorCases';
import { cyberAudio } from '../utils/audio';
import { AnimatedCodeBlock } from '../components/AnimatedCodeBlock';
import { Terminal } from '../components/Terminal';
import type { TerminalLog } from '../components/Terminal';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Wrench, 
  Play,
  Lock,
  Unlock,
  AlertOctagon,
  Flame,
  CheckCircle,
  Cpu,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import gsap from 'gsap';

export function ErrorSimulator() {
  const { fixedErrors, fixError } = useXPSystem();
  
  // State for active status category tab and selected code
  const [activeCategory, setActiveCategory] = useState<'all' | '1xx' | '2xx' | '3xx' | '4xx' | '5xx' | 'cors'>('all');
  const [selectedCode, setSelectedCode] = useState<string>('404');
  
  const errorCase: ErrorCase = errorCases.find(ec => ec.code === selectedCode) || errorCases[0];

  const [activeStep, setActiveStep] = useState<'idle' | 'crash' | 'fixed'>('idle');
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const [isPatchApplied, setIsPatchApplied] = useState(false);

  // Filter cases based on the selected tab
  const filteredCases = errorCases.filter(ec => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'cors') return ec.code === 'CORS';
    if (activeCategory === '1xx') return ec.code.startsWith('1');
    if (activeCategory === '2xx') return ec.code.startsWith('2');
    if (activeCategory === '3xx') return ec.code.startsWith('3');
    if (activeCategory === '4xx') return ec.code.startsWith('4') && ec.code !== 'CORS';
    if (activeCategory === '5xx') return ec.code.startsWith('5');
    return true;
  });

  const runSimulation = () => {
    // Play network pulse sound and VM crash error buzzer
    cyberAudio.playPulse();
    cyberAudio.playError();

    setActiveStep('crash');
    setIsPatchApplied(false);
    const time = new Date().toLocaleTimeString();

    // Trigger visual screen shake using GSAP
    gsap.to('.error-lab-container', {
      x: 'random(-6, 6)',
      y: 'random(-6, 6)',
      duration: 0.05,
      repeat: 6,
      yoyo: true,
      onComplete: () => {
        gsap.set('.error-lab-container', { clearProps: 'all' });
      }
    });

    let logs: TerminalLog[] = [];
    
    switch (errorCase.code) {
      case '100':
        logs = [
          { text: 'Starting chunked payload upload worker...', type: 'info', timestamp: time },
          { text: 'POST /api/upload - HTTP/1.1 Expect: 100-continue', type: 'input', timestamp: time },
          { text: 'Waiting for gatekeeper authorization validation...', type: 'info', timestamp: time },
          { text: 'HTTP/1.1 100 Continue. Headers accepted.', type: 'success', timestamp: time },
          { text: 'Streaming payload body segments (10.4MB)...', type: 'info', timestamp: time }
        ];
        break;
      case '101':
        logs = [
          { text: 'Initiating WebSocket client connection handshake...', type: 'info', timestamp: time },
          { text: 'Connection: Upgrade | Upgrade: websocket', type: 'input', timestamp: time },
          { text: 'HTTP/1.1 101 Switching Protocols. Handshake verified.', type: 'success', timestamp: time },
          { text: 'Establishing secure websocket pipe (ws://)...', type: 'success', timestamp: time },
          { text: 'WS session active. Listening for events.', type: 'info', timestamp: time }
        ];
        break;
      case '200':
        logs = [
          { text: 'Client request triggered: GET /api/profile', type: 'input', timestamp: time },
          { text: 'Querying database index matching session payload...', type: 'info', timestamp: time },
          { text: 'Database response: 1 record matched.', type: 'info', timestamp: time },
          { text: 'HTTP/1.1 200 OK. Returning payload schema.', type: 'success', timestamp: time }
        ];
        break;
      case '201':
        logs = [
          { text: 'Client request triggered: POST /api/tickets', type: 'input', timestamp: time },
          { text: 'Executing SQL: INSERT INTO tickets (title, desc) VALUES (...)', type: 'info', timestamp: time },
          { text: 'DB transaction completed successfully. ID assigned: 9481', type: 'success', timestamp: time },
          { text: 'HTTP/1.1 201 Created. Location: /api/tickets/9481', type: 'success', timestamp: time }
        ];
        break;
      case '202':
        logs = [
          { text: 'Client request triggered: POST /api/report', type: 'input', timestamp: time },
          { text: 'Queueing worker process: generate-financial-csv', type: 'info', timestamp: time },
          { text: 'Worker task ID allocated: job_uuid_a8f94', type: 'info', timestamp: time },
          { text: 'HTTP/1.1 202 Accepted. Processing queued in background.', type: 'success', timestamp: time }
        ];
        break;
      case '204':
        logs = [
          { text: 'Client request triggered: DELETE /api/logs', type: 'input', timestamp: time },
          { text: 'Executing SQL: TRUNCATE TABLE console_logs', type: 'info', timestamp: time },
          { text: 'Table purged. 450 rows affected.', type: 'success', timestamp: time },
          { text: 'HTTP/1.1 204 No Content. Transaction complete.', type: 'success', timestamp: time }
        ];
        break;
      case '300':
        logs = [
          { text: 'Client request triggered: GET /api/sdk/docs', type: 'input', timestamp: time },
          { text: 'Matching resource path to files catalog...', type: 'info', timestamp: time },
          { text: 'Found 3 available representations (PDF, HTML, MD).', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 300 Multiple Choices. Content representation list returned.', type: 'warn', timestamp: time }
        ];
        break;
      case '301':
        logs = [
          { text: 'Client request triggered: GET /company-news', type: 'input', timestamp: time },
          { text: 'Redirect rule match: Route /company-news moved permanently.', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 301 Moved Permanently. Location: https://blog.devcorp.com', type: 'warn', timestamp: time },
          { text: 'Redirecting browser window object model to new target...', type: 'info', timestamp: time }
        ];
        break;
      case '302':
        logs = [
          { text: 'Client request triggered: GET /dashboard', type: 'input', timestamp: time },
          { text: 'Verifying user auth credentials key...', type: 'info', timestamp: time },
          { text: 'Validation: guest access. Redirecting user to sign in page.', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 302 Found. Location: /login', type: 'warn', timestamp: time }
        ];
        break;
      case '304':
        logs = [
          { text: 'Client request triggered: GET /logo.png', type: 'input', timestamp: time },
          { text: 'Validation: If-None-Match cache ETag matching check...', type: 'info', timestamp: time },
          { text: 'ETag verification: match! Server file hash matches cache.', type: 'success', timestamp: time },
          { text: 'HTTP/1.1 304 Not Modified. Stream terminated (0 bytes payload).', type: 'success', timestamp: time }
        ];
        break;
      case '400':
        logs = [
          { text: 'Express router parsed payload headers...', type: 'info', timestamp: time },
          { text: 'POST /api/users - Payload body read: { username: "al" }', type: 'input', timestamp: time },
          { text: 'HTTP/1.1 400 Bad Request - Input validation error details:', type: 'error', timestamp: time },
          { text: '  [Field Error] username: must be at least 3 characters long', type: 'error', timestamp: time },
          { text: '  [Field Error] email: missing required parameter', type: 'error', timestamp: time }
        ];
        break;
      case '401':
        logs = [
          { text: 'Initializing sync stream with document storage backend...', type: 'info', timestamp: time },
          { text: 'Validating Authorization token payload...', type: 'info', timestamp: time },
          { text: 'JWT Verify failed: err.name = TokenExpiredError', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 401 Unauthorized - Token signature expired', type: 'error', timestamp: time },
          { text: 'Client storage session lock triggered by authentication core.', type: 'warn', timestamp: time }
        ];
        break;
      case '403':
        logs = [
          { text: 'Resolving gateway authorization token...', type: 'info', timestamp: time },
          { text: 'User JWT decoded: { id: 104, role: "Support" }', type: 'info', timestamp: time },
          { text: 'Accessing resource path /api/admin/firewall...', type: 'input', timestamp: time },
          { text: 'HTTP/1.1 403 Forbidden - Required permission level: Admin', type: 'error', timestamp: time },
          { text: 'Action rejected. Logged security warning to console.', type: 'warn', timestamp: time }
        ];
        break;
      case '404':
        logs = [
          { text: 'Starting frontend bundle client...', type: 'info', timestamp: time },
          { text: 'Mounting employee roster view...', type: 'info', timestamp: time },
          { text: 'AJAX FETCH REQUEST: GET http://localhost:8080/api/v1/emplyees', type: 'input', timestamp: time },
          { text: 'HTTP/1.1 404 Not Found - Resource path /api/v1/emplyees not mapped.', type: 'error', timestamp: time },
          { text: 'TypeError: Failed to fetch employee profiles. Result: undefined', type: 'error', timestamp: time }
        ];
        break;
      case '405':
        logs = [
          { text: 'API Router executing path matching rules...', type: 'info', timestamp: time },
          { text: 'POST /api/users/123 - Checking mapping permissions...', type: 'input', timestamp: time },
          { text: 'Mapping check: POST is not supported. Supported methods: GET, PUT', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 405 Method Not Allowed. Allow headers added.', type: 'error', timestamp: time }
        ];
        break;
      case '409':
        logs = [
          { text: 'POST /api/register - Processing payload...', type: 'input', timestamp: time },
          { text: 'Database query check: SELECT id FROM users WHERE email = ?', type: 'info', timestamp: time },
          { text: 'Duplicate check: user matches ID 4032 (dev@devcorp.com)', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 409 Conflict. Database unique constraint violation.', type: 'error', timestamp: time }
        ];
        break;
      case '422':
        logs = [
          { text: 'POST /api/claims - Request received.', type: 'input', timestamp: time },
          { text: 'Validating payload claims schema...', type: 'info', timestamp: time },
          { text: 'Semantic rules validation: Travel claim date cannot be in the future.', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 422 Unprocessable Entity. Request semantic failure.', type: 'error', timestamp: time }
        ];
        break;
      case '429':
        logs = [
          { text: 'Rate limit monitor online.', type: 'info', timestamp: time },
          { text: 'Traffic flood detected from IP 192.168.1.55...', type: 'warn', timestamp: time },
          { text: 'Incoming request rate: 250 req/sec (limit: 10 req/sec)', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 429 Too Many Requests - Rate threshold exceeded.', type: 'error', timestamp: time },
          { text: 'Rate limiter activated. Temporary client block active (15 minutes).', type: 'error', timestamp: time }
        ];
        break;
      case '500':
        logs = [
          { text: 'Express listening on port 3000', type: 'info', timestamp: time },
          { text: 'POST /register - Connection initiated from 192.168.1.12', type: 'info', timestamp: time },
          { text: 'TypeError: Cannot read properties of undefined (reading \'email\') at /register:L3', type: 'error', timestamp: time },
          { text: '  Stack trace: processTicksAndRejections (node:internal/process/task_queues:95:5)', type: 'error', timestamp: time },
          { text: 'Process terminated. Node.js main thread crashed! (Status code 500)', type: 'error', timestamp: time }
        ];
        break;
      case '501':
        logs = [
          { text: 'GET /api/export-pdf - Processing request...', type: 'input', timestamp: time },
          { text: 'Searching driver for format export: PDF...', type: 'info', timestamp: time },
          { text: 'Error: Module driver export-pdf placeholder not code implemented.', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 501 Not Implemented. Feature placeholder active.', type: 'error', timestamp: time }
        ];
        break;
      case '502':
        logs = [
          { text: 'NGINX Reverse Proxy active.', type: 'info', timestamp: time },
          { text: 'Forwarding request GET /api/dashboard to application host...', type: 'input', timestamp: time },
          { text: 'Error: Connection refused: 127.0.0.1:3000. Upstream node daemon dead.', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 502 Bad Gateway. Connection pool empty.', type: 'error', timestamp: time }
        ];
        break;
      case '503':
        logs = [
          { text: 'Evaluating system load thresholds...', type: 'info', timestamp: time },
          { text: 'System load metrics: CPU 100%, RAM 98% utilization.', type: 'warn', timestamp: time },
          { text: 'Capacity limits exceeded. Dropping connection from pool...', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 503 Service Unavailable. Temporary circuit breaker active.', type: 'error', timestamp: time }
        ];
        break;
      case '504':
        logs = [
          { text: 'NGINX reverse proxy listener active.', type: 'info', timestamp: time },
          { text: 'Forwarding request to upstream service target: checkout-api:8080...', type: 'input', timestamp: time },
          { text: 'Waiting for checkout-api response headers (timeout threshold: 10s)...', type: 'warn', timestamp: time },
          { text: 'NGINX: timeout expired. Upstream connection severed.', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 504 Gateway Timeout - Upstream server took too long to reply.', type: 'error', timestamp: time }
        ];
        break;
      case '505':
        logs = [
          { text: 'HTTP Protocol parser online...', type: 'info', timestamp: time },
          { text: 'Incoming request HTTP/0.9 GET /api/log', type: 'input', timestamp: time },
          { text: 'Parser rejected request. Protocol version HTTP/0.9 is obsolete.', type: 'error', timestamp: time },
          { text: 'HTTP/1.1 505 HTTP Version Not Supported.', type: 'error', timestamp: time }
        ];
        break;
      case '511':
        logs = [
          { text: 'Resolving DNS host endpoints...', type: 'info', timestamp: time },
          { text: 'GET /api/tasks - Route request sent.', type: 'input', timestamp: time },
          { text: 'Redirect proxy intercept: captive hotspot interface required.', type: 'warn', timestamp: time },
          { text: 'HTTP/1.1 511 Network Authentication Required.', type: 'error', timestamp: time }
        ];
        break;
      case 'CORS':
        logs = [
          { text: 'Vite dev server running on http://localhost:5173', type: 'info', timestamp: time },
          { text: 'Fetch request sent to backend target origin http://localhost:8080/data', type: 'input', timestamp: time },
          { text: 'CORS Block: Origin http://localhost:5173 blocked by client browser policy.', type: 'error', timestamp: time },
          { text: 'Access-Control-Allow-Origin header missing on target server response.', type: 'error', timestamp: time },
          { text: 'API call aborted by browser security policy. No body content read.', type: 'error', timestamp: time }
        ];
        break;
      default:
        logs = [
          { text: `HTTP Status Code ${errorCase.code} simulation initialized...`, type: 'info', timestamp: time }
        ];
    }
    setTerminalLogs(logs);
  };

  const applyRefactoring = () => {
    cyberAudio.playSelect();
    setIsPatchApplied(true);
    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { text: 'Injecting safe codebase patch configuration...', type: 'info', timestamp: time },
      { text: 'Source file refactored. Starting validation checks...', type: 'success', timestamp: time }
    ]);
  };

  const runVerification = () => {
    if (!isPatchApplied) return;
    setActiveStep('fixed');
    fixError(errorCase.code);

    // Play VM success chime
    cyberAudio.playSuccess();

    const time = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [
      ...prev,
      { text: 'Re-compiling sandbox project configuration...', type: 'info', timestamp: time },
      { text: '  [✓] Route compilation: COMPLIANT', type: 'success', timestamp: time },
      { text: '  [✓] Security policy filters: OK', type: 'success', timestamp: time },
      { text: 'HTTP/1.1 200 OK. Verification complete.', type: 'success', timestamp: time }
    ]);
  };

  const isSolved = fixedErrors.includes(errorCase.code);

  return (
    <div className="error-lab-container p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left relative">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-neon-pink" />
            HTTP Error Lab Sandbox
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Isolate and resolve critical web network bugs. Simulate error payloads and apply refactor patches.
          </p>
        </div>
      </div>

      {/* Tabs Filter Selector Matrix */}
      <div className="flex flex-col gap-3 bg-cyber-card border border-white/5 p-4 rounded-xl">
        <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
          {(['all', '1xx', '2xx', '3xx', '4xx', '5xx', 'cors'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                cyberAudio.playSelect();
                setActiveCategory(cat);
                const firstOfCat = errorCases.find(ec => {
                  if (cat === 'all') return true;
                  if (cat === 'cors') return ec.code === 'CORS';
                  if (cat === '1xx') return ec.code.startsWith('1');
                  if (cat === '2xx') return ec.code.startsWith('2');
                  if (cat === '3xx') return ec.code.startsWith('3');
                  if (cat === '4xx') return ec.code.startsWith('4') && ec.code !== 'CORS';
                  if (cat === '5xx') return ec.code.startsWith('5');
                  return true;
                });
                if (firstOfCat) {
                  setSelectedCode(firstOfCat.code);
                  setActiveStep('idle');
                  setIsPatchApplied(false);
                  setTerminalLogs([]);
                }
              }}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-neon-pink/15 border border-neon-pink text-neon-pink font-bold shadow-[0_0_10px_rgba(244,63,94,0.15)]'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level buttons matrix inside category */}
        <div className="flex flex-wrap gap-2 pt-1">
          {filteredCases.map((ec) => {
            const solved = fixedErrors.includes(ec.code);
            return (
              <button
                key={ec.code}
                onClick={() => {
                  cyberAudio.playSelect();
                  setSelectedCode(ec.code);
                  setActiveStep('idle');
                  setIsPatchApplied(false);
                  setTerminalLogs([]);
                }}
                className={`px-3 py-1.5 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                  selectedCode === ec.code
                    ? 'bg-neon-pink text-white shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                    : solved
                      ? 'bg-green-950/20 text-neon-green border border-green-500/20'
                      : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {ec.code === 'CORS' ? 'CORS' : `HTTP ${ec.code}`} {solved && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Diagnostic workspace controls (Col 1) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            Container Control Board
          </h2>

          <div className="glass-panel p-5 rounded-xl border border-neon-pink/20 bg-cyber-card flex flex-col gap-4">
            <div className="border-b border-white/5 pb-2">
              <span className="text-[10px] font-mono text-neon-pink font-bold uppercase tracking-widest">
                DIAGNOSTIC CASE
              </span>
              <h3 className="text-sm font-bold text-white mt-1">HTTP {errorCase.code}: {errorCase.title}</h3>
            </div>

            <div className="flex flex-col gap-3 text-xs leading-relaxed text-gray-300">
              <div>
                <span className="font-bold text-white font-mono block mb-0.5">SCENARIO:</span>
                <p className="text-gray-400">{errorCase.story}</p>
              </div>
              <div>
                <span className="font-bold text-white font-mono block mb-0.5">FAILURE VECTOR:</span>
                <p className="text-gray-400">{errorCase.why}</p>
              </div>
              <div>
                <span className="font-bold text-white font-mono block mb-0.5">CORRECTIVE ACTION:</span>
                <p className="text-gray-400">{errorCase.howToFix}</p>
              </div>
            </div>

            {/* Run controls */}
            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-white/5">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={runSimulation}
              >
                <Play className="w-4 h-4" />
                <span>Run Simulation</span>
              </Button>

              {activeStep === 'crash' && (
                <Button
                  variant="cyber"
                  size="md"
                  className="w-full"
                  onClick={applyRefactoring}
                >
                  <Wrench className="w-4 h-4" />
                  <span>Apply Refactor Patch</span>
                </Button>
              )}

              {activeStep === 'crash' && isPatchApplied && (
                <Button
                  variant="success"
                  size="md"
                  className="w-full"
                  onClick={runVerification}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Execute VM Verification</span>
                </Button>
              )}
            </div>

            {/* Solved clearance card */}
            {isSolved && (
              <div className="bg-green-950/20 border border-green-500/20 p-3 rounded-lg text-xs leading-relaxed flex flex-col gap-1">
                <span className="text-neon-green font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Clearance Secured (+20 XP)
                </span>
                <p className="text-gray-400 text-[11px] mt-1 font-sans">
                  You successfully patched this network loop. Check the details below to prep for interview panel queries.
                </p>
              </div>
            )}
          </div>

          {/* Interview Question Alignment */}
          {(activeStep === 'fixed' || isSolved) && (
            <div className="glass-panel p-5 rounded-xl border border-neon-cyan/20 bg-cyber-card flex flex-col gap-2">
              <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-widest">
                INTERVIEW PREP ALIGNMENT
              </span>
              <p className="text-xs font-bold text-white leading-relaxed">
                Why does HTTP {errorCase.code} happen and how do you describe it?
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed mt-1 font-mono">
                {errorCase.interviewExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Code sandbox & Animated Output Visualizers (Col 2 & 3) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            Diagnostic Sandbox Workspace
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code column */}
            <div className="flex flex-col gap-4">
              <AnimatedCodeBlock 
                code={isPatchApplied || isSolved ? errorCase.fixedSnippet : errorCase.codeSnippet}
                filename={
                  errorCase.code === 'CORS' || 
                  errorCase.code.startsWith('5') || 
                  ['200', '201', '202', '204', '400', '403', '405', '409', '422'].includes(errorCase.code) 
                    ? "server.js" 
                    : "fetchClient.ts"
                }
                buggyLines={isPatchApplied || isSolved ? [] : [2]}
              />

              <Terminal
                initialLogs={terminalLogs}
                interactive={false}
                showTabs={false}
                height="h-44"
                title="container-VM terminal"
              />
            </div>

            {/* Dynamic visual preview column */}
            <div className="glass-panel rounded-xl border border-white/10 bg-black/45 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden h-[420px]">
              <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />
              
              <div className="absolute top-3 left-4 text-[10px] font-mono text-gray-500 uppercase tracking-widest select-none">
                WEB PREVIEW CONSOLE
              </div>

              {/* Preview UI states */}
              <AnimatePresence mode="wait">
                {activeStep === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <Settings className="w-12 h-12 text-gray-600 animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-xs font-mono text-gray-500 uppercase font-bold">Simulator VM Idle</span>
                    <p className="text-[10px] text-gray-600 max-w-[200px] leading-relaxed">
                      Click "Run Simulation" to initialize traffic request scripts.
                    </p>
                  </motion.div>
                )}

                {activeStep === 'crash' && (
                  <motion.div
                    key="crash"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 z-10"
                  >
                    {/* Category specific animated outputs */}
                    {errorCase.animation === 'info-pulse' && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Cpu className="w-14 h-14 text-neon-blue animate-pulse" />
                          <div className="absolute inset-0 bg-neon-blue/20 blur-md rounded-full animate-ping" />
                        </div>
                        <span className="text-xs font-mono text-neon-blue font-bold">1xx INFORMATIONAL</span>
                        <div className="border border-neon-blue/20 p-3 rounded font-mono text-[10px] text-neon-blue bg-neon-blue/5 w-full max-w-[220px]">
                          <div>Status: HTTP {errorCase.code}</div>
                          <div>Upgrade: WebSocket client [✓]</div>
                          <div>Expect: 100-continue</div>
                        </div>
                      </div>
                    )}

                    {errorCase.animation === 'success-glow' && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <CheckCircle className="w-14 h-14 text-neon-green animate-pulse" />
                          <div className="absolute inset-0 bg-neon-green/20 blur-md rounded-full animate-ping" />
                        </div>
                        <span className="text-xs font-mono text-neon-green font-bold">2xx SUCCESS OK</span>
                        <div className="border border-neon-green/20 p-3 rounded font-mono text-[10px] text-neon-green bg-green-950/10 w-full max-w-[220px]">
                          <div>Status: HTTP {errorCase.code}</div>
                          <div>Data elements verified [✓]</div>
                          <div>Channel stream: established</div>
                        </div>
                      </div>
                    )}

                    {errorCase.animation === 'redirect-arrow' && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-4">
                          <div className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400 font-mono">/old-route</div>
                          <motion.div
                            animate={{ x: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                          >
                            <ArrowRight className="w-5 h-5 text-neon-purple" />
                          </motion.div>
                          <div className="px-2 py-1 bg-neon-purple/10 border border-neon-purple/30 rounded text-[10px] text-neon-purple font-mono">/new-route</div>
                        </div>
                        <span className="text-xs font-mono text-neon-purple font-bold">3xx REDIRECT HOP</span>
                        <div className="border border-neon-purple/20 p-2.5 rounded font-mono text-[9px] text-neon-purple bg-neon-purple/5 w-full max-w-[220px]">
                          <div>Status: HTTP {errorCase.code}</div>
                          <div>Location: /login / blog</div>
                          <div>ETag cache check matching [✓]</div>
                        </div>
                      </div>
                    )}

                    {errorCase.animation === 'broken-ui' && (
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <AlertOctagon className="w-14 h-14 text-yellow-500 animate-bounce" />
                          <div className="absolute inset-0 bg-yellow-500/10 blur-sm rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-yellow-400 font-bold">HTTP {errorCase.code}: VALIDATION FAILURE</span>
                        <div className="border border-dashed border-yellow-500/20 p-3 rounded font-mono text-[10px] text-yellow-400 bg-yellow-950/10 w-full max-w-[220px] text-left">
                          <div>✗ Field validation rules: failed</div>
                          <div>✗ Method handler mapping: mismatch</div>
                          <div>✗ Database key constraints check: conflict</div>
                        </div>
                      </div>
                    )}

                    {errorCase.animation === 'locked-screen' && (
                      <div className="w-full h-full bg-red-950/20 border border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-3 p-4 shadow-[inset_0_0_20px_rgba(239,68,68,0.2)]">
                        <Lock className="w-12 h-12 text-red-500 animate-bounce" />
                        <h4 className="text-xs font-bold text-red-400 tracking-wider">HTTP {errorCase.code}: ACCESS BLOCKED</h4>
                        <p className="text-[10px] text-red-300/80 max-w-[180px] leading-relaxed">
                          Authorization token expired or client identity permissions insufficient for this node.
                        </p>
                      </div>
                    )}

                    {errorCase.animation === 'exploding-server' && (
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <Flame className="w-16 h-16 text-orange-500 animate-pulse" />
                          <div className="absolute inset-0 bg-orange-500/20 blur-md rounded-full animate-ping" />
                        </div>
                        <span className="text-xs font-mono text-orange-400 font-bold">HTTP {errorCase.code}: SERVER EXCEPTION</span>
                        <p className="text-[9px] text-gray-500 max-w-[180px]">
                          Unhandled node runtime application exceptions. Thread dumped or feature unimplemented.
                        </p>
                      </div>
                    )}

                    {errorCase.animation === 'firewall-block' && (
                      <div className="w-full h-full bg-red-950/15 border border-red-500/20 rounded-xl flex flex-col items-center justify-center gap-3 p-4">
                        <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
                        <h4 className="text-[11px] font-bold text-red-400">HTTP {errorCase.code}: GATEWAY / SECURITY GATE</h4>
                        <p className="text-[9px] text-gray-500 max-w-[190px] leading-relaxed">
                          Request rate exceeded, proxy connection timed out, or cross-origin client configuration blocked.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeStep === 'fixed' && (
                  <motion.div
                    key="fixed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/40 flex items-center justify-center text-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)] animate-pulse">
                      <Unlock className="w-6 h-6 text-neon-green" />
                    </div>
                    <span className="text-xs font-mono text-neon-green font-bold">HTTP 200 SUCCESS</span>
                    <p className="text-[10px] text-gray-400 max-w-[190px] leading-relaxed">
                      Patched route compiled successfully. API data loaded into view components.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
