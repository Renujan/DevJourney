import { motion } from 'framer-motion';
import { useXPSystem } from '../features/xpSystem/xpSystem';
import { Award, Zap } from 'lucide-react';

export function XPBar() {
  const { xp, level, badges } = useXPSystem();

  // Define thresholds
  const thresholds = [
    { name: 'Beginner 👶', min: 0, max: 50 },
    { name: 'Junior Dev 💻', min: 50, max: 150 },
    { name: 'Mid Dev ⚡', min: 150, max: 300 },
    { name: 'Senior Dev 🧠', min: 300, max: 500 },
    { name: 'Architect 🏗️', min: 500, max: 1000 } // Soft limit
  ];

  const currentTier = thresholds.find(t => xp >= t.min && xp < t.max) || thresholds[thresholds.length - 1];
  const range = currentTier.max - currentTier.min;
  const progressInTier = xp - currentTier.min;
  const percentage = Math.min(100, Math.max(0, (progressInTier / range) * 100));

  return (
    <div className="w-full glass-panel p-4 rounded-xl border border-neon-blue/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
        {/* Level indicator */}
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-neon-blue animate-pulse" />
          <span className="text-sm font-mono text-gray-400">Security Access Level:</span>
          <span className="text-sm font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent glow-text-blue">
            {level}
          </span>
        </div>

        {/* Badge count */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-neon-pink">
            <Award className="w-4 h-4" />
            <span>Badges: {badges.length}</span>
          </div>
          
          {/* XP progress text */}
          <div className="text-xs font-mono text-gray-400">
            <span className="text-neon-blue font-bold">{xp}</span>
            <span className="text-gray-600"> / </span>
            <span>{currentTier.max === 1000 ? 'MAX' : `${currentTier.max} XP`}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="h-3 w-full bg-cyber-bg/80 border border-neon-purple/20 rounded-full overflow-hidden p-[2px]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-indigo to-neon-purple shadow-[0_0_10px_rgba(0,242,254,0.7)]"
        />
      </div>
      
      {/* Current tier detail message */}
      <div className="flex justify-between items-center text-[10px] text-gray-500 mt-1 font-mono">
        <span>{currentTier.min} XP</span>
        {currentTier.max !== 1000 && (
          <span>{currentTier.max - xp} XP to next level</span>
        )}
        <span>{currentTier.max} XP</span>
      </div>
    </div>
  );
}
