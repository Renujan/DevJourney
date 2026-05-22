import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Button } from '../components/Button';
import { Terminal, Rocket, BookOpen, Mic } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP typing animation for Title
    if (titleRef.current) {
      const text = "You are a Junior Developer at DevCorp 🏢";
      titleRef.current.innerHTML = '';
      
      const chars = text.split('');
      chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        if (char === ' ') span.innerHTML = '&nbsp;';
        titleRef.current?.appendChild(span);
        
        gsap.to(span, {
          opacity: 1,
          delay: i * 0.04,
          duration: 0.05,
          ease: 'power2.out'
        });
      });
    }

    // GSAP fade-in delay for Subtitle
    if (subtitleRef.current) {
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, delay: 1.8, duration: 0.8, ease: 'back.out(1.7)' }
      );
    }

    // Floating animation for decorative code boxes
    gsap.to('.floating-code-box', {
      y: 'random(-20, 20)',
      x: 'random(-15, 15)',
      rotation: 'random(-8, 8)',
      duration: 'random(4, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.2
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 overflow-hidden"
    >
      {/* Animated Moving Background Grid */}
      <div className="absolute inset-0 cyber-grid animate-grid-move -z-10 opacity-30" />
      
      {/* Radial ambient glow in center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-neon-blue/5 rounded-full blur-[80px] -z-10 pointer-events-none" />

      {/* Floating Code Snippets */}
      <div className="absolute top-16 left-[8%] floating-code-box glass-panel p-2.5 rounded border-neon-blue/20 font-mono text-[10px] text-neon-blue/60 select-none hidden md:block">
        {"useEffect(() => {\n  loadVM();\n}, []);"}
      </div>
      <div className="absolute bottom-24 right-[10%] floating-code-box glass-panel p-2.5 rounded border-neon-purple/20 font-mono text-[10px] text-neon-purple/60 select-none hidden md:block">
        {"const [xp, setXp] = useState(0);"}
      </div>
      <div className="absolute top-1/3 right-[5%] floating-code-box glass-panel p-2.5 rounded border-neon-pink/20 font-mono text-[10px] text-neon-pink/60 select-none hidden lg:block">
        {"jwt.verify(token, secret);"}
      </div>
      <div className="absolute bottom-1/3 left-[4%] floating-code-box glass-panel p-2.5 rounded border-neon-green/20 font-mono text-[10px] text-neon-green/60 select-none hidden lg:block">
        {"db.query('SELECT * FROM users');"}
      </div>

      {/* Hero Content Panel */}
      <div className="max-w-3xl text-center z-10 flex flex-col items-center gap-6">
        {/* Tech Badge */}
        <div className="inline-flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/30 px-3 py-1 rounded-full text-xs font-mono text-neon-blue tracking-wider shadow-[0_0_10px_rgba(0,242,254,0.1)]">
          <Terminal className="w-3.5 h-3.5" />
          <span>ESTABLISHED AT DEVCORP VM-SERVER</span>
        </div>

        {/* Typing Headings */}
        <h1 
          ref={titleRef} 
          className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans min-h-[80px]"
        >
          You are a Junior Developer at DevCorp 🏢
        </h1>

        <p 
          ref={subtitleRef} 
          className="text-base md:text-lg text-gray-400 font-medium tracking-wide max-w-xl opacity-0"
        >
          Your journey starts now… Fix bugs, bypass firewalls, configure JWT authentication, and survive the senior design interview.
        </p>

        {/* Big Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center px-6">
          <Button 
            variant="primary" 
            size="lg" 
            glow 
            onClick={() => navigate('/dashboard')}
          >
            <Rocket className="w-5 h-5 text-white" />
            <span>Start Journey 🚀</span>
          </Button>

          <Button 
            variant="secondary" 
            size="lg" 
            onClick={() => navigate('/roadmap')}
          >
            <BookOpen className="w-5 h-5" />
            <span>Choose Module 📚</span>
          </Button>

          <Button 
            variant="cyber" 
            size="lg" 
            onClick={() => navigate('/interview')}
          >
            <Mic className="w-5 h-5" />
            <span>Take Interview 🎤</span>
          </Button>
        </div>
      </div>
      
      {/* Scanline visual overlay effect */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-white/5 opacity-10 animate-scanline pointer-events-none" />
    </div>
  );
}
