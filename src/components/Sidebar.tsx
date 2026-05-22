import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Map, 
  Atom, 
  Server, 
  AlertOctagon, 
  Mic, 
  User, 
  LogOut,
  ChevronRight,
  Network
} from 'lucide-react';
import { useXPSystem } from '../features/xpSystem/xpSystem';

export function Sidebar() {
  const location = useLocation();
  const { resetProgress } = useXPSystem();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid, color: 'text-neon-cyan hover:shadow-[0_0_10px_rgba(76,201,240,0.4)]' },
    { name: 'Roadmap Path', path: '/roadmap', icon: Map, color: 'text-neon-indigo hover:shadow-[0_0_10px_rgba(72,149,239,0.4)]' },
    { name: 'React Module', path: '/react', icon: Atom, color: 'text-neon-blue hover:shadow-[0_0_10px_rgba(0,242,254,0.4)]' },
    { name: 'Backend Module', path: '/backend', icon: Server, color: 'text-neon-purple hover:shadow-[0_0_10px_rgba(181,23,158,0.4)]' },
    { name: 'Error Lab', path: '/errors', icon: AlertOctagon, color: 'text-neon-pink hover:shadow-[0_0_10px_rgba(247,37,133,0.4)]' },
    { name: 'API Visualizer', path: '/api-visualizer', icon: Network, color: 'text-neon-cyan hover:shadow-[0_0_10px_rgba(76,201,240,0.4)]' },
    { name: 'Interview Arena', path: '/interview', icon: Mic, color: 'text-neon-green hover:shadow-[0_0_10px_rgba(57,255,20,0.4)]' },
    { name: 'Developer Profile', path: '/profile', icon: User, color: 'text-gray-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.4)]' }
  ];

  return (
    <aside className="w-full lg:w-64 glass-panel border-r border-neon-blue/15 flex flex-col justify-between py-6">
      {/* Menu links */}
      <div className="flex flex-col px-3 gap-1">
        <span className="text-[10px] font-mono tracking-widest text-gray-500 font-bold px-3 mb-2">
          SYSTEM MATRIX
        </span>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center justify-between px-3 py-3 rounded-lg font-sans text-sm font-semibold transition-all duration-300 group cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-r from-neon-blue/15 to-neon-purple/5 border border-neon-blue/40 text-white shadow-[0_0_15px_rgba(0,242,254,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-neon-blue' : 'text-gray-500 group-hover:text-neon-blue'}`} />
                <span>{item.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-neon-blue translate-x-0' : 'text-gray-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1'}`} />

              {/* Active Neon side marker */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[3px] rounded-r-md bg-gradient-to-b from-neon-blue to-neon-purple shadow-[0_0_8px_#00f2fe]" />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer operations (Reset progress) */}
      <div className="px-6 mt-6">
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to reset your DevCorp profile and clear all XP/badges?")) {
              resetProgress();
              window.location.reload();
            }
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-gray-500 hover:text-red-400 border border-transparent hover:border-red-500/20 hover:bg-red-500/5 rounded-md transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Reset Database</span>
        </button>
      </div>
    </aside>
  );
}
