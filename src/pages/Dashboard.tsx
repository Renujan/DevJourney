import { useNavigate } from 'react-router-dom';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { XPBar } from '../components/XPBar';
import { motion } from 'framer-motion';
import { 
  Atom, 
  Server, 
  AlertTriangle, 
  Mic, 
  Map, 
  Lock, 
  Unlock, 
  Award,
  Terminal as TermIcon,
  Network
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const { xp, badges, completedLessons, fixedErrors, completedRoadmap, interviewScores } = useXPSystem();

  // Define modules lists
  const modules = [
    {
      title: "React Module (Story Mode)",
      desc: "Simulate real workplace bugs. Resolve useEffect state loops and closures under Senior Alex's guidance.",
      icon: Atom,
      path: "/react",
      stats: `${completedLessons.filter(id => id <= 2).length} / 2 Lessons Complete`,
      color: "from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400",
      glowColor: "rgba(0, 242, 254, 0.2)",
      reqXp: 0
    },
    {
      title: "Backend & Server Module",
      desc: "Prevent critical vulnerabilities: block SQL injection attacks and construct robust API rate-limiters.",
      icon: Server,
      path: "/backend",
      stats: `${completedLessons.filter(id => id > 2).length} / 2 Lessons Complete`,
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
      glowColor: "rgba(181, 23, 158, 0.2)",
      reqXp: 15 // Unlock at 15 XP
    },
    {
      title: "HTTP Error Lab",
      desc: "Debug core internet routing protocols. Diagnose 25+ standard status codes and browser CORS issues.",
      icon: AlertTriangle,
      path: "/errors",
      stats: `${fixedErrors.length} / 26 Sandbox Levels Fixed`,
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400",
      glowColor: "rgba(247, 37, 133, 0.2)",
      reqXp: 30 // Unlock at 30 XP
    },
    {
      title: "API Flow Visualizer",
      desc: "Track client-server requests in real-time. Watch packets hop across Frontend, Nginx Gateway, Express Backend, and Database.",
      icon: Network,
      path: "/api-visualizer",
      stats: "Interactive Diagnostic Tool",
      color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-neon-blue",
      glowColor: "rgba(0, 242, 254, 0.2)",
      reqXp: 20 // Unlock at 20 XP
    },
    {
      title: "Interview Arena",
      desc: "Survive timed technical quizzes. Contrast Beginner, Developer, and Senior levels. Record your best scores.",
      icon: Mic,
      path: "/interview",
      stats: `Best developer score: ${interviewScores.developer || 0} / 3`,
      color: "from-green-500/20 to-emerald-500/10 border-green-500/30 text-neon-green",
      glowColor: "rgba(57, 255, 20, 0.2)",
      reqXp: 40 // Unlock at 40 XP
    },
    {
      title: "Roadmap Progression Path",
      desc: "Lock-in frontend concepts: HTML, CSS, JavaScript, React basics, APIs, and mini-projects.",
      icon: Map,
      path: "/roadmap",
      stats: `${completedRoadmap.length} / 8 Milestones Passed`,
      color: "from-teal-500/20 to-cyan-500/10 border-teal-500/30 text-neon-cyan",
      glowColor: "rgba(76, 201, 240, 0.2)",
      reqXp: 0
    }
  ];

  const badgeInfo = [
    { id: 'Bug Slayer 🐞', desc: 'Resolved 2+ network errors in Error Lab', iconColor: 'text-red-400' },
    { id: 'API Master 🌐', desc: 'Solved 404 + CORS errors', iconColor: 'text-blue-400' },
    { id: 'React Ninja ⚛️', desc: 'Finished React lessons or Developer quiz', iconColor: 'text-cyan-400' },
    { id: 'Interview King 👑', desc: 'Scored 3+ points on interview panels', iconColor: 'text-yellow-400' },
    { id: 'Flow Architect ⚡', desc: 'Completed all API Flow Visualizer challenges', iconColor: 'text-neon-cyan' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-6xl mx-auto flex flex-col gap-6 text-left relative overflow-hidden"
    >
      {/* Background grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-[0.03] pointer-events-none -z-10" />
      
      {/* Scanline overlay */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-white/5 opacity-5 animate-scanline pointer-events-none" />

      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <TermIcon className="w-6 h-6 text-neon-blue" />
            Developer Control Center
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Access secure DevCorp VMs, track XP levels, and complete required compliance modules.
          </p>
        </div>
        
        {/* Profile indicator */}
        <div className="bg-cyber-card border border-white/5 px-4 py-2 rounded-lg flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse" />
          <span className="text-xs font-mono text-gray-300">CONTAINER IP: 10.0.4.92</span>
        </div>
      </div>

      {/* Stats bar */}
      <XPBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 z-10">
        {/* Main training modules column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white font-sans tracking-wide">
            Available Compliance Modules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m, idx) => {
              const isLocked = xp < m.reqXp;
              const Icon = m.icon;

              return (
                <motion.div 
                  key={m.path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  whileHover={!isLocked ? { scale: 1.03, y: -2 } : {}}
                  style={{ boxShadow: !isLocked ? `0 4px 20px -2px ${m.glowColor}` : 'none' }}
                  className={`glass-panel p-5 rounded-xl border flex flex-col justify-between gap-4 transition-all duration-300 ${
                    isLocked 
                      ? 'opacity-40 border-white/5 bg-white/5 pointer-events-none' 
                      : `bg-gradient-to-br ${m.color} border-white/10 cursor-pointer`
                  }`}
                  onClick={() => !isLocked && navigate(m.path)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-cyber-bg/60 border border-white/5">
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      {isLocked ? (
                        <span className="flex items-center gap-1 text-[10px] text-red-400 font-mono font-bold uppercase">
                          <Lock className="w-3 h-3" />
                          Locked: Requires {m.reqXp} XP
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-neon-green font-mono font-bold uppercase">
                          <Unlock className="w-3 h-3" />
                          Ready
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white tracking-wide mt-2">{m.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{m.desc}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1 text-[11px] font-mono text-gray-400">
                    <span>{m.stats}</span>
                    {!isLocked && (
                      <span className="text-neon-blue group-hover:underline">Access Terminal &rarr;</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Badge inventory column */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white font-sans tracking-wide">
            Secured Badge Keys
          </h2>

          <div className="glass-panel p-5 rounded-xl border border-neon-purple/20 flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="w-5 h-5 text-neon-pink" />
              <span className="text-xs font-mono font-bold text-gray-300">Security Badges Inventory</span>
            </div>

            {badges.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 gap-2">
                <Lock className="w-10 h-10 text-gray-600 animate-pulse" />
                <span className="text-xs text-gray-500 font-semibold font-mono">No Credentials Found</span>
                <p className="text-[10px] text-gray-600">
                  Complete lessons and debug server containers to unlock security clearance badges.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {badgeInfo.map((b, idx) => {
                  const unlocked = badges.includes(b.id);
                  
                  return (
                    <motion.div 
                      key={b.id} 
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={unlocked ? { scale: 1.02, x: 2 } : {}}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                        unlocked 
                          ? 'bg-neon-purple/5 border-neon-purple/30 text-white' 
                          : 'bg-white/5 border-white/5 text-gray-600'
                      }`}
                    >
                      <div className={`p-2 rounded bg-cyber-bg border ${unlocked ? 'border-neon-purple/40' : 'border-white/5'}`}>
                        <Award className={`w-4 h-4 ${unlocked ? b.iconColor : 'text-gray-600'}`} />
                      </div>
                      
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {b.id}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono mt-0.5">{b.desc}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
            
            <div className="bg-cyber-bg/50 border border-white/5 p-3 rounded-lg text-[10px] text-gray-500 font-mono leading-relaxed mt-auto">
              🔑 <span className="text-neon-cyan">Security Tip</span>: Each compliance badge increases your authority and unlocks developer pathways in the simulator.
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
