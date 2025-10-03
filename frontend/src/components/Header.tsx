import React from 'react';
import type { Page } from '../types';

interface HeaderProps {
  onHomeClick: () => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, currentPage }) => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if(currentPage !== 'home') {
        onHomeClick();
        setTimeout(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-black/20 backdrop-blur-md sticky top-0 z-50 border-b border-[var(--border-color)]">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button onClick={onHomeClick} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-yellow)] rounded-md transition-transform duration-200 hover:scale-105">
              <img src="/logo.png" alt="Exo X Hunter Logo" className="h-12" />
            </button>
          </div>
          {currentPage === 'home' && (
            <div className="hidden md:flex items-center space-x-6 text-xs font-semibold">
              <a href="#challenge" onClick={(e) => scrollToSection(e, 'challenge')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Challenge</a>
              <a href="#observatory" onClick={(e) => scrollToSection(e, 'observatory')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Observatory</a>
              <a href="#mission-control" onClick={(e) => scrollToSection(e, 'mission-control')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Dashboard</a>
              <a href="#ai-deep-dive" onClick={(e) => scrollToSection(e, 'ai-deep-dive')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">AI Deep Dive</a>
              <a href="#community-discoveries" onClick={(e) => scrollToSection(e, 'community-discoveries')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Discoveries</a>
              <a href="#archive" onClick={(e) => scrollToSection(e, 'archive')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Archive</a>
              <a href="#education" onClick={(e) => scrollToSection(e, 'education')} className="text-[var(--text-muted)] hover:text-[var(--text-light)] transition-colors">Learn</a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;