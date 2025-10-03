import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

const HeroView: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".title-char", 
        { y: 100, opacity: 0 }, 
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(".subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' },
        "-=0.5"
      )
      .fromTo(".scroll-indicator",
        { y: -20, opacity: 0},
        { y: 0, opacity: 1, duration: 1, ease: 'bounce.out'},
        "-=0.5"
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const title = "Hunt for New Worlds";

  return (
    <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center text-center relative z-10">
      <div className="p-4">
        <h1 className="font-orbitron text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase" style={{ textShadow: '0 0 20px rgba(147, 112, 219, 0.7)' }}>
          {title.split("").map((char, index) => (
            <span key={index} className={`title-char inline-block ${char === ' ' ? 'mx-1 sm:mx-2' : ''}`}>
              {char}
            </span>
          ))}
        </h1>
        <p className="subtitle mt-4 text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto">
          Use AI to analyze real NASA data and uncover the secrets of distant stars.
        </p>
      </div>

      <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
          <span className="text-sm text-[var(--text-muted)]">Scroll to Explore</span>
          <div className="w-0.5 h-12 bg-white/20 relative">
              <div className="w-full h-4 bg-white/80 absolute top-0 animate-[scroll-down_2s_ease-in-out_infinite]"></div>
          </div>
      </div>
      <style>{`
        @keyframes scroll-down {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(32px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default HeroView;