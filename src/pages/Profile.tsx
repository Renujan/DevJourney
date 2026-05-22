import { useXPSystem } from '../features/xpSystem/xpSystem';
import { XPBar } from '../components/XPBar';
import { Button } from '../components/Button';
import { 
  User, 
  Award, 
  ShieldCheck, 
  Trash2,
  CheckCircle2
} from 'lucide-react';

export function Profile() {
  const { xp, level, badges, completedLessons, fixedErrors, resetProgress } = useXPSystem();

  const handleReset = () => {
    if (window.confirm("WARNING: Proceeding will wipe all secured XP, levels, and badges. This cannot be undone. Reset profile database?")) {
      resetProgress();
      window.location.reload();
    }
  };

  const badgeDescriptions: Record<string, string> = {
    'Bug Slayer 🐞': 'Resolved 2+ critical container errors in the HTTP Error Lab.',
    'API Master 🌐': 'Diagnosed and fixed 404 router spelling and CORS firewall policies.',
    'React Ninja ⚛️': 'Mastered useEffect rendering loops and state stale closure scopes.',
    'Interview King 👑': 'Secured 3+ points on technical interview arena panels.',
    'Flow Architect ⚡': 'Completed all API Flow Visualizer client-server microservice routing challenges.'
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <User className="w-6 h-6 text-neon-purple" />
          Developer Security Profile
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Inspect your active credentials, compliance certifications, and access badges.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core profile details (Col 1 & 2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats Bar */}
          <XPBar />

          {/* Simulated whoami terminal shell widget */}
          <div className="glass-panel rounded-xl border border-white/10 bg-black/45 p-4.5 flex flex-col font-mono text-xs shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]">
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest select-none">devcorp-core-vm shell</span>
              <div className="flex gap-1.5 select-none">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-left pl-1">
              <div className="flex items-center gap-1.5">
                <span className="text-neon-pink select-none">$</span>
                <span className="text-white font-bold">whoami</span>
              </div>
              <div className="text-gray-400 pl-4 py-1.5 flex flex-col gap-2 border-l border-white/10 mt-1">
                <div><span className="text-neon-cyan font-bold">ACCESS LEVEL:</span> {level}</div>
                <div><span className="text-neon-cyan font-bold">RANK IN DEVCORP:</span> {
                  level === 'Beginner 👶' ? 'Intern Developer' :
                  level === 'Junior Dev 💻' ? 'Junior Developer' :
                  level === 'Mid Dev ⚡' ? 'Mid-level Engineer' :
                  level === 'Senior Dev 🧠' ? 'Senior Developer' :
                  'Architect'
                }</div>
                <div><span className="text-neon-cyan font-bold">UNLOCKED CLEARANCES:</span> {badges.length > 0 ? badges.join(' | ') : 'None'}</div>
                <div><span className="text-neon-cyan font-bold">CORE SKILLS METRICS:</span> React State Closure, Safe SQL Sanitizing, DDoS Thread Security, CORS Proxy Config, API Request Tracing, Mock Technical Panels</div>
              </div>
            </div>
          </div>

          {/* Compliance Credentials Certificate */}
          <div className="glass-panel p-6 rounded-xl border border-neon-blue/20 bg-gradient-to-r from-neon-blue/5 via-transparent to-cyber-bg flex flex-col gap-4 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-[140px] h-[140px] bg-neon-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/5 pb-3 z-10">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-neon-blue animate-pulse" />
                <span className="text-xs font-mono font-bold text-gray-300">DEVCORP SECURITY CREDENTIALS</span>
              </div>
              <span className="text-[10px] font-mono text-neon-blue font-bold tracking-wider">SECURE TIER</span>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs z-10">
              <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                <span className="text-gray-500">DEVELOPER NAME:</span>
                <span className="text-white font-bold">JD #4092-ALPHA</span>
              </div>
              <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                <span className="text-gray-500">CLEARANCE ACCESS:</span>
                <span className="text-neon-cyan font-bold">{level}</span>
              </div>
              <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                <span className="text-gray-500">ACCUMULATED EXPERIENCE:</span>
                <span className="text-white font-bold">{xp} XP SECURED</span>
              </div>
              <div className="grid grid-cols-2 border-b border-white/5 pb-2">
                <span className="text-gray-500">CONTAINER VM ASSIGNED:</span>
                <span className="text-white font-bold">devcorp-core-vm-2932</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-gray-500">COMPLIANCE CODE:</span>
                <span className="text-neon-purple font-bold">ISO-27001-COMPLIANT</span>
              </div>
            </div>

            <div className="bg-black/35 p-4 rounded-lg border border-white/5 font-mono text-[10px] text-gray-400 mt-2 z-10">
              <span className="text-neon-green font-bold block mb-1">✓ COMPLIANCE STATEMENT:</span>
              The developer has successfully isolated state rendering errors, verified API path typographies, bypassed CORS routing limits, and demonstrated system design scaling credentials.
            </div>
          </div>

          {/* Progress Breakdown */}
          <div className="glass-panel p-5 rounded-xl border border-white/10 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white tracking-wide">
              Module Verification Audits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="border border-white/5 bg-white/5 p-3.5 rounded-lg flex flex-col gap-1.5">
                <span className="text-gray-500 uppercase text-[10px]">React Sandbox</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white font-bold">
                    {completedLessons.filter(id => id <= 2).length} / 2 VM
                  </span>
                  <span className="text-neon-blue font-bold">
                    {Math.round((completedLessons.filter(id => id <= 2).length / 2) * 100)}%
                  </span>
                </div>
              </div>

              <div className="border border-white/5 bg-white/5 p-3.5 rounded-lg flex flex-col gap-1.5">
                <span className="text-gray-500 uppercase text-[10px]">Server Sandbox</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white font-bold">
                    {completedLessons.filter(id => id > 2).length} / 2 VM
                  </span>
                  <span className="text-neon-purple font-bold">
                    {Math.round((completedLessons.filter(id => id > 2).length / 2) * 100)}%
                  </span>
                </div>
              </div>

              <div className="border border-white/5 bg-white/5 p-3.5 rounded-lg flex flex-col gap-1.5">
                <span className="text-gray-500 uppercase text-[10px]">HTTP Error Lab</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-white font-bold">{fixedErrors.length} / 26 Levels</span>
                  <span className="text-neon-pink font-bold">
                    {Math.round((fixedErrors.length / 26) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges and actions (Col 3) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-md font-bold text-white tracking-wide font-sans">
            Unlocked Clearances
          </h2>

          <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 bg-cyber-card flex-1 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Award className="w-5 h-5 text-neon-purple animate-pulse" />
                <span className="text-xs font-mono font-bold text-gray-300">Security Clearance Badges</span>
              </div>

              {badges.length === 0 ? (
                <div className="text-center p-6 text-xs text-gray-500 font-mono">
                  No clearance badges unlocked yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {badges.map((badge) => {
                    const desc = badgeDescriptions[badge] || 'Security credentials confirmed.';
                    
                    return (
                      <div 
                        key={badge} 
                        className="flex items-start gap-3 p-3 rounded-lg border border-neon-purple/20 bg-neon-purple/5 text-white"
                      >
                        <div className="p-1.5 rounded bg-cyber-bg border border-neon-purple/40 text-neon-purple mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-neon-green" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-white">{badge}</span>
                          <span className="text-[9px] text-gray-400 font-mono mt-0.5 leading-relaxed">
                            {desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-white/5 pt-4 mt-6">
              <Button
                variant="danger"
                size="md"
                className="w-full"
                onClick={handleReset}
              >
                <Trash2 className="w-4 h-4 text-white" />
                <span>Format Profile & Clear VM</span>
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
