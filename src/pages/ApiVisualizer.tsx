import { useState, useEffect, useRef } from 'react';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { cyberAudio } from '../utils/audio';
import { 
  Network, 
  Play, 
  RefreshCw, 
  Database as DbIcon, 
  Shield, 
  Monitor, 
  Cpu, 
  CheckCircle2, 
  Lock, 
  Settings, 
  FileText, 
  Activity,
  Terminal as TermIcon
} from 'lucide-react';

interface TerminalLog {
  text: string;
  type: 'info' | 'error' | 'success' | 'warn' | 'input';
  timestamp: string;
}

interface SimStep {
  packetState: 'idle' | 'client-to-gateway' | 'gateway-to-backend' | 'backend-to-db' | 'db-to-backend' | 'backend-to-gateway' | 'gateway-to-client' | 'finished';
  direction: 'forward' | 'backward';
  status: 'request' | 'success' | 'error';
  activeNode: 'client' | 'gateway' | 'backend' | 'database' | null;
  logText: string;
  logType: 'info' | 'error' | 'success' | 'warn' | 'input';
}

interface ChallengeState {
  success: boolean;
  dbOffline: boolean;
  unauthorized: boolean;
  corsBlocked: boolean;
}

export function ApiVisualizer() {
  const { addXP, earnBadge, badges } = useXPSystem();

  // Selected Endpoint
  const [endpoint, setEndpoint] = useState<'users' | 'order' | 'analytics' | 'checkout'>('users');
  
  // Environment configs
  const [latency, setLatency] = useState<number>(800);
  const [dbOnline, setDbOnline] = useState<boolean>(true);
  const [hasAuth, setHasAuth] = useState<boolean>(true);
  const [corsEnabled, setCorsEnabled] = useState<boolean>(true);

  // Simulation run states
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [packetState, setPacketState] = useState<SimStep['packetState']>('idle');
  const [packetDirection, setPacketDirection] = useState<SimStep['direction']>('forward');
  const [packetStatus, setPacketStatus] = useState<SimStep['status']>('request');
  const [activeNode, setActiveNode] = useState<SimStep['activeNode']>(null);
  
  // Console VM Logs
  const [simulationLogs, setSimulationLogs] = useState<TerminalLog[]>([]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Inspector Tabs: 'headers' | 'payload' | 'response'
  const [activeInspectorTab, setActiveInspectorTab] = useState<'headers' | 'payload' | 'response'>('headers');

  // Interactive challenges
  const [challenges, setChallenges] = useState<ChallengeState>(() => {
    const saved = localStorage.getItem('devjourney-api-visualizer-challenges');
    return saved ? JSON.parse(saved) : {
      success: false,
      dbOffline: false,
      unauthorized: false,
      corsBlocked: false
    };
  });

  // Save challenges to localStorage and check for badge unlock
  useEffect(() => {
    localStorage.setItem('devjourney-api-visualizer-challenges', JSON.stringify(challenges));
    
    // Check if all goals are completed and badge isn't earned yet
    const allCompleted = challenges.success && challenges.dbOffline && challenges.unauthorized && challenges.corsBlocked;
    if (allCompleted && !badges.includes('Flow Architect ⚡')) {
      earnBadge('Flow Architect ⚡');
    }
  }, [challenges, badges]);

  // Scroll to bottom of terminal when logs change (scrolled within container to avoid window shifting)
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [simulationLogs]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  // Request/Response Headers and Payloads Definition
  const getRequestDetails = () => {
    switch (endpoint) {
      case 'users':
        return {
          method: 'GET',
          url: 'http://api.devcorp.internal/users',
          headers: {
            'Host': 'api.devcorp.internal',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (DevCorpClient/1.0)',
            ...(hasAuth ? { 'Authorization': 'Bearer devcorp_jwt_secret' } : {}),
            ...(corsEnabled ? { 'Origin': 'http://localhost:5173' } : {})
          },
          body: null
        };
      case 'order':
        return {
          method: 'POST',
          url: 'http://api.devcorp.internal/order',
          headers: {
            'Host': 'api.devcorp.internal',
            'Content-Type': 'application/json',
            ...(hasAuth ? { 'Authorization': 'Bearer devcorp_jwt_secret' } : {}),
            ...(corsEnabled ? { 'Origin': 'http://localhost:5173' } : {})
          },
          body: {
            cartId: 'cart_9481',
            items: [{ productId: 'prod_react_course', quantity: 1 }],
            total: 120.00
          }
        };
      case 'analytics':
        return {
          method: 'GET',
          url: 'http://api.devcorp.internal/analytics',
          headers: {
            'Host': 'api.devcorp.internal',
            'Accept': 'application/json',
            'Origin': 'http://localhost:5173',
            ...(hasAuth ? { 'Authorization': 'Bearer devcorp_jwt_secret' } : {})
          },
          body: null
        };
      case 'checkout':
        return {
          method: 'POST',
          url: 'http://api.devcorp.internal/checkout',
          headers: {
            'Host': 'api.devcorp.internal',
            'Content-Type': 'application/json',
            ...(hasAuth ? { 'Authorization': 'Bearer devcorp_jwt_secret' } : {}),
            ...(corsEnabled ? { 'Origin': 'http://localhost:5173' } : {})
          },
          body: {
            userId: 'usr_99',
            paymentMethod: 'stripe_card',
            amount: 250.00
          }
        };
    }
  };

  const getResponseDetails = () => {
    // 1. CORS failure (Preflight CORS blocked)
    if (endpoint === 'analytics' && !corsEnabled) {
      return {
        status: 0,
        statusText: 'CORS Blocked',
        headers: {
          'X-Security-Warning': 'Blocked by browser Same-Origin Policy'
        },
        body: {
          error: 'TypeError: Failed to fetch. CORS policy blocked cross-origin request from http://localhost:5173. The server did not return CORS wildcards.'
        }
      };
    }

    // 2. Unauthorized checks
    const needsAuth = (endpoint === 'order' || endpoint === 'checkout');
    if (needsAuth && !hasAuth) {
      return {
        status: 401,
        statusText: 'Unauthorized',
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer error="invalid_token"'
        },
        body: {
          success: false,
          error: 'Missing or expired authentication token. Request blocked at API Gateway.'
        }
      };
    }

    // 3. Database Offline check
    if (!dbOnline) {
      return {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '30'
        },
        body: {
          success: false,
          error: 'Database transaction timeout. PostgreSQL container is offline.',
          details: 'connection timed out to db-postgre-vm:5432'
        }
      };
    }

    // 4. Success Responses
    switch (endpoint) {
      case 'users':
        return {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...(corsEnabled ? { 'Access-Control-Allow-Origin': 'http://localhost:5173' } : {})
          },
          body: [
            { id: 1, username: 'alex_senior', role: 'Senior Developer' },
            { id: 2, username: 'emma_infra', role: 'DevOps Engineer' },
            { id: 3, username: 'lucas_intern', role: 'Junior Developer' }
          ]
        };
      case 'order':
        return {
          status: 201,
          statusText: 'Created',
          headers: {
            'Content-Type': 'application/json',
            ...(corsEnabled ? { 'Access-Control-Allow-Origin': 'http://localhost:5173' } : {})
          },
          body: {
            success: true,
            orderId: 'ord_88472',
            status: 'pending_payment',
            timestamp: new Date().toISOString()
          }
        };
      case 'analytics':
        return {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Credentials': 'true'
          },
          body: {
            pageViews: 14205,
            uniqueVisitors: 3890,
            activeConnections: 42,
            serverLoad: '14%'
          }
        };
      case 'checkout':
        return {
          status: 200,
          statusText: 'OK',
          headers: {
            'Content-Type': 'application/json',
            ...(corsEnabled ? { 'Access-Control-Allow-Origin': 'http://localhost:5173' } : {})
          },
          body: {
            transactionId: 'txn_8849204',
            status: 'success',
            receiptUrl: 'https://receipts.devcorp.internal/txn_8849204.pdf'
          }
        };
    }
  };

  // Run Simulation Sequence
  const triggerSimulation = () => {
    if (isSimulating) return;

    // Start with a rising pulse sound
    cyberAudio.playPulse();

    setIsSimulating(true);
    setCurrentStepIndex(0);
    setSimulationLogs([]);
    setActiveInspectorTab('headers');

    const timeline = buildTimeline();
    const hopCount = timeline.filter(t => t.packetState !== 'finished' && t.packetState !== 'idle').length;
    // Calculate adaptive animation time per line transition
    const hopDuration = Math.max(350, latency / (hopCount || 1));

    const runStep = (stepIdx: number) => {
      if (stepIdx >= timeline.length) {
        setIsSimulating(false);
        // Determine what challenge was completed
        const res = getResponseDetails();
        setChallenges(prev => {
          const next = { ...prev };
          if (res.status === 200 || res.status === 201) {
            next.success = true;
          } else if (res.status === 401) {
            next.unauthorized = true;
          } else if (res.status === 503) {
            next.dbOffline = true;
          } else if (res.status === 0) {
            next.corsBlocked = true;
          }
          return next;
        });

        // Award dynamic small XP per simulation trigger
        addXP(5);
        return;
      }

      const step = timeline[stepIdx];
      setCurrentStepIndex(stepIdx);
      setPacketState(step.packetState);
      setPacketDirection(step.direction);
      setPacketStatus(step.status);
      setActiveNode(step.activeNode);

      // Play success/error chime when packet reaches its final destination
      if (step.packetState === 'finished') {
        if (step.status === 'success') {
          cyberAudio.playSuccess();
        } else {
          cyberAudio.playError();
        }
      }

      // Print step log
      const time = new Date().toLocaleTimeString();
      setSimulationLogs(prev => [...prev, {
        text: step.logText,
        type: step.logType,
        timestamp: time
      }]);

      const isNetworkHop = step.packetState !== 'finished' && step.packetState !== 'idle';
      const delay = isNetworkHop ? hopDuration : 600;

      timeoutRef.current = window.setTimeout(() => {
        runStep(stepIdx + 1);
      }, delay);
    };

    runStep(0);
  };

  const resetCanvas = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsSimulating(false);
    setCurrentStepIndex(-1);
    setPacketState('idle');
    setPacketDirection('forward');
    setPacketStatus('request');
    setActiveNode(null);
    setSimulationLogs([]);
  };

  const buildTimeline = (): SimStep[] => {
    const timeline: SimStep[] = [];
    const req = getRequestDetails();

    timeline.push({
      packetState: 'client-to-gateway',
      direction: 'forward',
      status: 'request',
      activeNode: 'client',
      logText: `[Client] Dispatching ${req.method} ${endpoint === 'users' ? '/users' : endpoint === 'order' ? '/order' : endpoint === 'analytics' ? '/analytics' : '/checkout'} request packet to API Gateway...`,
      logType: 'input'
    });

    // 1. CORS Preflight / Block check
    if (endpoint === 'analytics' && !corsEnabled) {
      timeline.push({
        packetState: 'gateway-to-client',
        direction: 'backward',
        status: 'error',
        activeNode: 'gateway',
        logText: `[API Gateway/Nginx] Preflight check blocked: Request origin 'http://localhost:5173' is not whitelisted. Access-Control-Allow-Origin header is missing.`,
        logType: 'error'
      });
      timeline.push({
        packetState: 'finished',
        direction: 'backward',
        status: 'error',
        activeNode: 'client',
        logText: `[Client Browser] CORS Lockdown: Connection refused. Origin blocked by Same-Origin security policy.`,
        logType: 'error'
      });
      return timeline;
    }

    // 2. Authorization Verification at API Gateway
    const needsAuth = (endpoint === 'order' || endpoint === 'checkout');
    if (needsAuth && !hasAuth) {
      timeline.push({
        packetState: 'gateway-to-client',
        direction: 'backward',
        status: 'error',
        activeNode: 'gateway',
        logText: `[API Gateway/Nginx] Blocked by proxy middleware: JWT Token is missing in Authorization headers.`,
        logType: 'error'
      });
      timeline.push({
        packetState: 'finished',
        direction: 'backward',
        status: 'error',
        activeNode: 'client',
        logText: `[Client] Received HTTP 401 Unauthorized from Nginx. Access token required.`,
        logType: 'error'
      });
      return timeline;
    }

    // Proxy to backend
    timeline.push({
      packetState: 'gateway-to-backend',
      direction: 'forward',
      status: 'request',
      activeNode: 'gateway',
      logText: `[API Gateway/Nginx] Gateway match! Forwarding proxy stream to backend microservice port 3000...`,
      logType: 'info'
    });

    timeline.push({
      packetState: 'backend-to-db',
      direction: 'forward',
      status: 'request',
      activeNode: 'backend',
      logText: `[Backend Express Server] Handler triggered. Executing authorization payload checks. Mapping query to db-postgre-vm...`,
      logType: 'info'
    });

    // 3. Database Offline check
    if (!dbOnline) {
      timeline.push({
        packetState: 'db-to-backend',
        direction: 'backward',
        status: 'error',
        activeNode: 'database',
        logText: `[Database PostgreSQL] TCP connection failed. PostgreSQL service at port 5432 is down/offline.`,
        logType: 'error'
      });
      timeline.push({
        packetState: 'backend-to-gateway',
        direction: 'backward',
        status: 'error',
        activeNode: 'backend',
        logText: `[Backend Express Server] Database unreachable. Catching client pool timeout exception. Retransmitting HTTP 503.`,
        logType: 'error'
      });
      timeline.push({
        packetState: 'gateway-to-client',
        direction: 'backward',
        status: 'error',
        activeNode: 'gateway',
        logText: `[API Gateway/Nginx] Catching backend crash response. Relaying HTTP 503 Service Unavailable downstream.`,
        logType: 'warn'
      });
      timeline.push({
        packetState: 'finished',
        direction: 'backward',
        status: 'error',
        activeNode: 'client',
        logText: `[Client] Fetch failed. Network returned status 503 Service Unavailable. DB container crashed.`,
        logType: 'error'
      });
      return timeline;
    }

    // Success flow - DB query succeeds
    let dbQueryStr = 'SELECT * FROM users;';
    if (endpoint === 'order') dbQueryStr = 'INSERT INTO orders (id, items) VALUES ...;';
    else if (endpoint === 'analytics') dbQueryStr = 'SELECT count(*) FROM analytics;';
    else if (endpoint === 'checkout') dbQueryStr = 'BEGIN; UPDATE users_balance; COMMIT;';

    timeline.push({
      packetState: 'db-to-backend',
      direction: 'backward',
      status: 'success',
      activeNode: 'database',
      logText: `[Database PostgreSQL] SQL query "${dbQueryStr}" processed. Rows returned. Writing WAL log...`,
      logType: 'success'
    });

    const isCreated = endpoint === 'order';
    timeline.push({
      packetState: 'backend-to-gateway',
      direction: 'backward',
      status: 'success',
      activeNode: 'backend',
      logText: `[Backend Express Server] Payload successfully loaded. Returning HTTP ${isCreated ? '201 Created' : '200 OK'}.`,
      logType: 'success'
    });

    timeline.push({
      packetState: 'backend-to-gateway', // gateway-to-client is next
      direction: 'backward',
      status: 'success',
      activeNode: 'gateway',
      logText: `[API Gateway/Nginx] Access validation complete. Appending headers (Server: Nginx, Origin: verified).`,
      logType: 'info'
    });

    timeline.push({
      packetState: 'gateway-to-client',
      direction: 'backward',
      status: 'success',
      activeNode: 'gateway', // transit to client
      logText: `[API Gateway] Transmitting response packet to Client Browser (http://localhost:5173).`,
      logType: 'info'
    });

    timeline.push({
      packetState: 'finished',
      direction: 'backward',
      status: 'success',
      activeNode: 'client',
      logText: `[Client] Request complete! Received HTTP ${isCreated ? '201 Created' : '200 OK'}. Rendered interface.`,
      logType: 'success'
    });

    return timeline;
  };

  const reqDetails = getRequestDetails();
  const resDetails = getResponseDetails();

  // Connector components render helpers
  const isConnectorActive = (path: string) => {
    if (!isSimulating) return false;
    return packetState === path;
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6 text-left cyber-grid relative min-h-screen pb-12">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-neon-blue/15 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
            <Network className="w-6 h-6 text-neon-blue animate-pulse" />
            API Flow Visualizer
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Simulate and visually inspect HTTP request packets traversing through API Gateway, Node.js Backend, and Database.
          </p>
        </div>
        
        {/* Connection status and badges info */}
        <div className="flex items-center gap-4">
          <div className="bg-cyber-card border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(76,201,240,0.8)]" />
            <span className="text-[10px] font-mono text-gray-300">FLOW STATUS: LISTENING</span>
          </div>
          {badges.includes('Flow Architect ⚡') && (
            <div className="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] font-mono text-neon-cyan font-bold tracking-wider">FLOW ARCHITECT</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Control Panel | Canvas Flow | Inspector + Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Settings Board (col-span-3) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div className="glass-panel p-5 rounded-xl border border-neon-blue/20 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Settings className="w-4 h-4 text-neon-blue" />
              <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wide">Control Board</span>
            </div>

            {/* Select Endpoint */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-mono font-bold text-gray-400">SELECT ENDPOINT</label>
              <div className="flex flex-col gap-1.5">
                {(['users', 'order', 'analytics', 'checkout'] as const).map((ep) => {
                  const labelMap = {
                    users: 'GET /users',
                    order: 'POST /order',
                    analytics: 'GET /analytics',
                    checkout: 'POST /checkout'
                  };
                  const active = endpoint === ep;
                  return (
                    <button
                      key={ep}
                      disabled={isSimulating}
                      onClick={() => {
                        cyberAudio.playSelect();
                        setEndpoint(ep);
                      }}
                      className={`text-left text-xs font-mono px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        active 
                          ? 'bg-neon-blue/10 border-neon-blue text-white shadow-[0_0_12px_rgba(0,242,254,0.15)] font-bold'
                          : 'bg-cyber-bg/30 border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{labelMap[ep]}</span>
                        {ep === 'analytics' && (
                          <span className="text-[8px] bg-neon-pink/20 border border-neon-pink/30 text-neon-pink px-1 rounded">CORS</span>
                        )}
                        {(ep === 'order' || ep === 'checkout') && (
                          <span className="text-[8px] bg-neon-purple/20 border border-neon-purple/30 text-neon-purple px-1 rounded">AUTH</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
              <span className="text-[11px] font-mono font-bold text-gray-400">NETWORK MATRIX</span>
              
              {/* Latency Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>LATENCY TIMER</span>
                  <span className="text-neon-cyan font-bold">{latency}ms</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={latency}
                  disabled={isSimulating}
                  onChange={(e) => setLatency(Number(e.target.value))}
                  className="w-full h-1 bg-cyber-bg rounded-lg appearance-none cursor-pointer accent-neon-blue disabled:opacity-50"
                />
              </div>

              {/* DB Status Switch */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-300">Database Server</span>
                  <span className="text-[9px] text-gray-500 font-mono">PostgreSQL node status</span>
                </div>
                <button
                  disabled={isSimulating}
                  onClick={() => {
                    cyberAudio.playSelect();
                    setDbOnline(!dbOnline);
                  }}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
                    dbOnline ? 'bg-neon-green/30 border border-neon-green/50' : 'bg-red-950/30 border border-red-500/50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                    dbOnline ? 'bg-neon-green translate-x-6' : 'bg-red-500 translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Authorization Switch */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-300">Auth Token Key</span>
                  <span className="text-[9px] text-gray-500 font-mono">Authorization Headers</span>
                </div>
                <button
                  disabled={isSimulating}
                  onClick={() => {
                    cyberAudio.playSelect();
                    setHasAuth(!hasAuth);
                  }}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
                    hasAuth ? 'bg-neon-blue/30 border border-neon-blue/50' : 'bg-red-950/30 border border-red-500/50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                    hasAuth ? 'bg-neon-blue translate-x-6' : 'bg-red-500 translate-x-0'
                  }`} />
                </button>
              </div>

              {/* CORS Switch */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-gray-300">CORS Policy</span>
                  <span className="text-[9px] text-gray-500 font-mono">Access middleware headers</span>
                </div>
                <button
                  disabled={isSimulating}
                  onClick={() => {
                    cyberAudio.playSelect();
                    setCorsEnabled(!corsEnabled);
                  }}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 disabled:opacity-50 ${
                    corsEnabled ? 'bg-neon-pink/30 border border-neon-pink/50' : 'bg-red-950/30 border border-red-500/50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full transition-transform duration-300 ${
                    corsEnabled ? 'bg-neon-pink translate-x-6' : 'bg-red-500 translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Launch Actions */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              <Button
                variant={isSimulating ? 'secondary' : 'primary'}
                disabled={isSimulating}
                onClick={triggerSimulation}
                className="w-full flex items-center justify-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-neon-blue" />
                    <span>Packet Flying...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current text-white" />
                    <span>Trigger Packet</span>
                  </>
                )}
              </Button>

              <button
                onClick={() => {
                  cyberAudio.playSelect();
                  resetCanvas();
                }}
                className="w-full py-2 bg-transparent text-gray-400 hover:text-white border border-white/5 hover:border-white/20 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>

          {/* Gamified Challenges */}
          <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <Network className="w-4 h-4 text-neon-purple" />
              <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wide">Mission Challenges</span>
            </div>
            
            <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
              Complete these diagnostic scenarios to unlock security badge.
            </p>

            <div className="flex flex-col gap-2.5 mt-2">
              <div className="flex items-start gap-2.5 text-xs">
                <div className={`mt-0.5 ${challenges.success ? 'text-neon-green' : 'text-gray-600'}`}>
                  {challenges.success ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono text-xs ${challenges.success ? 'text-white font-bold' : 'text-gray-500'}`}>Establish Connection</span>
                  <span className="text-[9px] text-gray-500">Trigger successful response payload.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className={`mt-0.5 ${challenges.dbOffline ? 'text-neon-green' : 'text-gray-600'}`}>
                  {challenges.dbOffline ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono text-xs ${challenges.dbOffline ? 'text-white font-bold' : 'text-gray-500'}`}>Simulate Outage</span>
                  <span className="text-[9px] text-gray-500">Trigger 503 response on database offline.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className={`mt-0.5 ${challenges.unauthorized ? 'text-neon-green' : 'text-gray-600'}`}>
                  {challenges.unauthorized ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono text-xs ${challenges.unauthorized ? 'text-white font-bold' : 'text-gray-500'}`}>Enforce Security</span>
                  <span className="text-[9px] text-gray-500">Trigger 401 blocker at Nginx Gateway.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <div className={`mt-0.5 ${challenges.corsBlocked ? 'text-neon-green' : 'text-gray-600'}`}>
                  {challenges.corsBlocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                </div>
                <div className="flex flex-col">
                  <span className={`font-mono text-xs ${challenges.corsBlocked ? 'text-white font-bold' : 'text-gray-500'}`}>Cross-Origin Lockdown</span>
                  <span className="text-[9px] text-gray-500">Block analytics route via CORS headers.</span>
                </div>
              </div>
            </div>

            {/* Payout tracker */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
              <span className="text-gray-500">XP PAYOUT:</span>
              <span className="text-neon-green font-bold">+25 XP</span>
            </div>
          </div>
        </div>

        {/* Center Column: Visualizer Canvas (col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel p-6 rounded-xl border border-neon-blue/15 flex flex-col items-center justify-between min-h-[480px] w-full">
            
            {/* Visualizer header */}
            <div className="w-full flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">Live Flow Mapping</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 font-mono">Packets:</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  isSimulating 
                    ? packetStatus === 'error' 
                      ? 'bg-neon-pink/20 text-neon-pink border border-neon-pink/30'
                      : 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
                    : 'bg-white/5 text-gray-500 border border-white/5'
                }`}>
                  {isSimulating ? `${packetStatus} - ${packetDirection}` : 'Standby'}
                </span>
              </div>
            </div>

            {/* Canvas Nodes Container */}
            <div className="flex-1 flex flex-col md:flex-row items-center justify-between w-full py-8 relative gap-4">
              
              {/* Node 1: Client Card */}
              <div className={`flex flex-col items-center z-10 w-28 md:w-24 transition-all duration-300 ${
                activeNode === 'client' 
                  ? 'scale-105 shadow-[0_0_20px_rgba(76,201,240,0.3)]'
                  : 'opacity-70'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  activeNode === 'client'
                    ? 'border-neon-cyan bg-neon-cyan/15 text-white glow-border-blue'
                    : 'border-white/10 bg-cyber-bg text-gray-400'
                }`}>
                  <Monitor className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2.5">React Client</span>
                <span className="text-[9px] font-mono text-neon-cyan">localhost:5173</span>
              </div>

              {/* Connector 1 (Client -> Gateway) */}
              <Connector 
                active={isConnectorActive('client-to-gateway') || isConnectorActive('gateway-to-client')} 
                direction={packetDirection}
                status={packetStatus}
                duration={Math.max(350, latency / 4)}
              />

              {/* Node 2: API Gateway Card */}
              <div className={`flex flex-col items-center z-10 w-28 md:w-24 transition-all duration-300 ${
                activeNode === 'gateway' 
                  ? 'scale-105 shadow-[0_0_20px_rgba(247,37,133,0.3)]'
                  : 'opacity-70'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  activeNode === 'gateway'
                    ? packetStatus === 'error' && currentStepIndex === 1
                      ? 'border-neon-pink bg-neon-pink/15 text-white animate-pulse'
                      : 'border-neon-pink bg-neon-pink/15 text-white glow-border-purple'
                    : 'border-white/10 bg-cyber-bg text-gray-400'
                }`}>
                  <Shield className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2.5">API Gateway</span>
                <span className="text-[9px] font-mono text-neon-pink">Nginx Proxy</span>
              </div>

              {/* Connector 2 (Gateway -> Backend) */}
              <Connector 
                active={isConnectorActive('gateway-to-backend') || isConnectorActive('backend-to-gateway')} 
                direction={packetDirection}
                status={packetStatus}
                duration={Math.max(350, latency / 4)}
              />

              {/* Node 3: Backend Server Card */}
              <div className={`flex flex-col items-center z-10 w-28 md:w-24 transition-all duration-300 ${
                activeNode === 'backend' 
                  ? 'scale-105 shadow-[0_0_20px_rgba(181,23,158,0.3)]'
                  : 'opacity-70'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  activeNode === 'backend'
                    ? 'border-neon-purple bg-neon-purple/15 text-white'
                    : 'border-white/10 bg-cyber-bg text-gray-400'
                }`}>
                  <Cpu className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2.5">Express Server</span>
                <span className="text-[9px] font-mono text-neon-purple">Port: 3000</span>
              </div>

              {/* Connector 3 (Backend -> Database) */}
              <Connector 
                active={isConnectorActive('backend-to-db') || isConnectorActive('db-to-backend')} 
                direction={packetDirection}
                status={packetStatus}
                duration={Math.max(350, latency / 4)}
              />

              {/* Node 4: Database Card */}
              <div className={`flex flex-col items-center z-10 w-28 md:w-24 transition-all duration-300 ${
                activeNode === 'database' 
                  ? 'scale-105 shadow-[0_0_20px_rgba(57,255,20,0.3)]'
                  : 'opacity-70'
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                  activeNode === 'database'
                    ? dbOnline 
                      ? 'border-neon-green bg-neon-green/15 text-white' 
                      : 'border-red-500 bg-red-950/20 text-red-500 animate-glitch'
                    : 'border-white/10 bg-cyber-bg text-gray-400'
                }`}>
                  <DbIcon className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono font-bold text-white mt-2.5">PostgreSQL</span>
                <span className="text-[9px] font-mono text-neon-green">DB Node: 5432</span>
              </div>

            </div>

            {/* Simulated latency meter logs */}
            <div className="w-full bg-cyber-bg/50 border border-white/5 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
              <div className="flex flex-col gap-1">
                <span className="text-gray-500 font-bold">SIMULATION SCHEMA</span>
                <span className="text-gray-300">
                  {reqDetails.method} {reqDetails.url}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-gray-500 font-bold">SERVER STATUS</span>
                <span className={dbOnline ? 'text-neon-green font-bold' : 'text-red-400 font-bold animate-pulse'}>
                  {dbOnline ? 'DB ONLINE' : 'DB OFFLINE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Packet Inspector & VM Logs (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Packet Inspector (Postman panel) */}
          <div className="glass-panel rounded-xl border border-neon-blue/15 overflow-hidden flex flex-col min-h-[250px]">
            
            {/* Headers, Payload, Response Tabs */}
            <div className="bg-cyber-bg/95 border-b border-white/5 flex text-xs">
              <button
                onClick={() => {
                  cyberAudio.playSelect();
                  setActiveInspectorTab('headers');
                }}
                className={`flex-1 py-2.5 border-r border-white/5 flex items-center justify-center gap-1.5 cursor-pointer font-semibold ${
                  activeInspectorTab === 'headers' 
                    ? 'bg-cyber-card text-neon-blue border-b-2 border-b-neon-blue font-bold' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Headers</span>
              </button>
              <button
                onClick={() => {
                  cyberAudio.playSelect();
                  setActiveInspectorTab('payload');
                }}
                className={`flex-1 py-2.5 border-r border-white/5 flex items-center justify-center gap-1.5 cursor-pointer font-semibold ${
                  activeInspectorTab === 'payload' 
                    ? 'bg-cyber-card text-neon-purple border-b-2 border-b-neon-purple font-bold' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Payload</span>
              </button>
              <button
                onClick={() => {
                  cyberAudio.playSelect();
                  setActiveInspectorTab('response');
                }}
                className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 cursor-pointer font-semibold ${
                  activeInspectorTab === 'response' 
                    ? 'bg-cyber-card text-neon-green border-b-2 border-b-neon-green font-bold' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Response</span>
              </button>
            </div>

            {/* Inspector Display Panel */}
            <div className="flex-1 p-4 bg-cyber-bg/80 text-xs font-mono text-left max-h-[200px] overflow-y-auto">
              {activeInspectorTab === 'headers' && (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500 font-bold">HTTP REQUEST HEADERS</span>
                  <pre className="text-neon-cyan whitespace-pre-wrap break-all p-2 rounded bg-black/40 border border-white/5 leading-relaxed">
                    {JSON.stringify(reqDetails.headers, null, 2)}
                  </pre>
                </div>
              )}

              {activeInspectorTab === 'payload' && (
                <div className="flex flex-col gap-2">
                  <span className="text-gray-500 font-bold">HTTP PAYLOAD BODY</span>
                  {reqDetails.body ? (
                    <pre className="text-neon-purple whitespace-pre-wrap break-all p-2 rounded bg-black/40 border border-white/5 leading-relaxed">
                      {JSON.stringify(reqDetails.body, null, 2)}
                    </pre>
                  ) : (
                    <div className="p-4 text-center text-gray-500 italic border border-dashed border-white/5 rounded">
                      Null Request Body (No payload for GET)
                    </div>
                  )}
                </div>
              )}

              {activeInspectorTab === 'response' && (
                <div className="flex flex-col gap-2">
                  {currentStepIndex >= 0 ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 font-bold">HTTP RESPONSE PAYLOAD</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          resDetails.status >= 200 && resDetails.status < 300
                            ? 'bg-neon-green/20 text-neon-green'
                            : 'bg-red-950/40 text-red-400'
                        }`}>
                          STATUS: {resDetails.status} {resDetails.statusText}
                        </span>
                      </div>
                      <pre className={`whitespace-pre-wrap break-all p-2 rounded bg-black/40 border border-white/5 leading-relaxed ${
                        resDetails.status >= 200 && resDetails.status < 300 ? 'text-neon-green' : 'text-red-400 font-bold'
                      }`}>
                        {JSON.stringify(resDetails.body, null, 2)}
                      </pre>
                      
                      <span className="text-[10px] text-gray-600 font-bold mt-1 uppercase">Response Headers</span>
                      <pre className="text-gray-400 whitespace-pre-wrap text-[10px] p-2 bg-black/20 rounded border border-white/5">
                        {JSON.stringify(resDetails.headers, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <div className="p-8 text-center text-gray-500 italic border border-dashed border-white/5 rounded">
                      Standby: Run simulation to inspect response
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bash Terminal Live logs */}
          <div className="w-full glass-panel rounded-xl border border-neon-blue/15 overflow-hidden font-mono flex flex-col">
            
            {/* Header window control bar */}
            <div className="bg-cyber-bg/95 border-b border-white/5 px-4 py-2.5 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block shadow-[0_0_8px_#ef4444]" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block shadow-[0_0_8px_#eab308]" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block shadow-[0_0_8px_#22c55e]" />
                <span className="text-[10px] text-gray-500 ml-3 flex items-center gap-1">
                  <TermIcon className="w-3.5 h-3.5 text-neon-blue" />
                  bash - api-packet-tracer
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                <span className="text-[9px] text-neon-cyan font-bold tracking-wider">VM MONITOR</span>
              </div>
            </div>

            {/* Output screen */}
            <div ref={terminalContainerRef} className="h-60 bg-cyber-bg/95 p-4 overflow-y-auto text-xs flex flex-col gap-2">
              <div className="flex-1 flex flex-col gap-1.5 text-left text-[11px] leading-relaxed">
                {simulationLogs.length === 0 ? (
                  <div className="text-gray-600 flex flex-col items-center justify-center h-full gap-2 p-6">
                    <TermIcon className="w-8 h-8 text-gray-700 animate-pulse" />
                    <span>Packet diagnostic tracer inactive.</span>
                    <span className="text-[9px] text-gray-700">Trigger request packet to stream VM network outputs...</span>
                  </div>
                ) : (
                  simulationLogs.map((log, index) => {
                    const colors = {
                      info: 'text-gray-400',
                      error: 'text-red-400 font-bold bg-red-950/20 px-1 border-l border-red-500/30',
                      success: 'text-neon-green font-semibold',
                      warn: 'text-yellow-400 font-medium',
                      input: 'text-neon-cyan font-bold'
                    };
                    return (
                      <div key={index} className={`flex items-start gap-2 ${colors[log.type]}`}>
                        <span className="text-[9px] text-gray-600 select-none">[{log.timestamp}]</span>
                        <span className="whitespace-pre-wrap break-all">{log.text}</span>
                      </div>
                    );
                  })
                )}
                <div ref={terminalBottomRef} />
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

// Connector Props and implementation
interface ConnectorProps {
  active: boolean;
  direction: 'forward' | 'backward';
  status: 'request' | 'success' | 'error';
  duration: number;
}

function Connector({ active, direction, status, duration }: ConnectorProps) {
  const isForward = direction === 'forward';
  const isError = status === 'error';
  
  const dotColorClass = isError 
    ? 'bg-neon-pink shadow-[0_0_12px_#f72585]' 
    : status === 'success' 
      ? 'bg-neon-green shadow-[0_0_12px_#39ff14]' 
      : 'bg-neon-blue shadow-[0_0_12px_#00f2fe]';

  return (
    <div className="flex-1 flex items-center justify-center relative w-full px-2">
      {/* Horizontal connector (Desktop) */}
      <div className="hidden md:block w-full h-[2px] bg-white/10 relative overflow-visible">
        {active && (
          <motion.div
            key={`h-${direction}-${status}`}
            initial={{ left: isForward ? '0%' : '100%' }}
            animate={{ left: isForward ? '100%' : '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-10 ${dotColorClass}`}
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-r ${active ? 'from-neon-blue/10 via-neon-purple/5 to-transparent' : 'from-transparent to-transparent'}`} />
      </div>

      {/* Vertical connector (Mobile) */}
      <div className="block md:hidden w-[2px] h-10 bg-white/10 relative overflow-visible my-2">
        {active && (
          <motion.div
            key={`v-${direction}-${status}`}
            initial={{ top: isForward ? '0%' : '100%' }}
            animate={{ top: isForward ? '100%' : '0%' }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full z-10 ${dotColorClass}`}
          />
        )}
      </div>
    </div>
  );
}
