import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { Terminal, Shield, Sun, Moon } from 'lucide-react';

export function Navbar() {
  const { xp, level } = useXPSystem();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('devcorp-theme') || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    localStorage.setItem('devcorp-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-neon-blue/15 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative p-1.5 rounded-lg bg-neon-blue/10 border border-neon-blue/30 group-hover:border-neon-blue/70 transition-colors">
          <Terminal className="w-6 h-6 text-neon-blue" />
          <div className="absolute inset-0 bg-neon-blue/20 blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col">
          <span className="text-md font-bold tracking-wider font-mono text-text-main flex items-center gap-1">
            DEVJOURNEY<span className="text-neon-blue">AI</span>
          </span>
          <span className="text-[10px] text-neon-purple tracking-widest font-mono font-bold -mt-0.5">
            DEVCORP SIMULATOR
          </span>
        </div>
      </Link>

      {/* User Dashboard Summary */}
      <div className="flex items-center gap-4">
        {/* Level and XP Badge */}
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-neon-purple" />
            <span className="text-xs font-mono font-bold text-text-main">{level}</span>
          </div>
          <span className="text-[10px] text-text-muted font-mono">{xp} XP SECURED</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg border border-neon-blue/20 bg-cyber-bg/40 hover:bg-neon-blue/10 hover:border-neon-blue/60 transition-all text-neon-blue cursor-pointer"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Small avatar glow */}
        <Link to="/profile" className="relative flex items-center gap-2 border border-neon-purple/30 bg-cyber-bg/50 px-3 py-1.5 rounded-lg hover:border-neon-blue transition-colors">
          <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center font-bold text-xs text-white">
            JD
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-neon-green border-2 border-cyber-bg rounded-full" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-main">Junior Developer</span>
            <span className="text-[9px] text-neon-cyan font-mono">ID: #4092-ALPHA</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
