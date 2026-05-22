import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cyberAudio } from '../utils/audio';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  glow = true,
  children,
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-lg font-sans tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cyber-bg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-neon-blue to-neon-purple text-white border border-transparent shadow-[0_0_15px_rgba(0,242,254,0.3)] hover:shadow-[0_0_25px_rgba(0,242,254,0.6)] focus:ring-neon-blue',
    secondary: 'bg-transparent text-white border border-neon-blue/40 hover:bg-neon-blue/10 hover:border-neon-blue focus:ring-neon-blue shadow-[inset_0_0_8px_rgba(0,242,254,0.1)]',
    danger: 'bg-red-950/80 text-red-200 border border-red-500/50 hover:bg-red-900/60 focus:ring-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    success: 'bg-green-950/80 text-green-200 border border-neon-green/50 hover:bg-green-900/60 focus:ring-neon-green hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]',
    cyber: 'bg-transparent text-neon-pink border border-neon-pink/40 hover:bg-neon-pink/10 hover:border-neon-pink focus:ring-neon-pink shadow-[inset_0_0_8px_rgba(247,37,133,0.1)] font-mono',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={(e) => {
        cyberAudio.playClick();
        if (onClick) onClick(e);
      }}
      {...props}
    >
      {/* Laser line sheen animation */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
      
      {/* Border glow decoration */}
      {glow && (
        <span className="absolute -inset-px rounded-lg bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 hover:opacity-20 transition-opacity duration-300 pointer-events-none blur-[2px]" />
      )}
      
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
