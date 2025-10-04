import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type {Variants } from 'framer-motion';
import type { Page, Exoplanet, Article } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GameInstructionsPage from './pages/GameInstructionsPage';
import GamePage from './pages/GamePage';
import EducationPage from './pages/EducationPage';
import TestAiPage from './pages/TestAiPage';
import PlanetDetailModal from './components/PlanetDetailModal';
import ArticleModal from './components/education/ArticleModal';
import { useMockData } from './hooks/useMockData';


const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: 'easeInOut' } },
};

const Footer = () => (
    <footer className="text-center py-6 text-sm text-[var(--text-muted)] relative z-10 border-t border-[var(--border-color)] mt-16">
      Exo X Hunter © 2025. A NASA Space Apps Challenge Project.
    </footer>
);


const App: React.FC = () => {
  const [page, setPage] = useState<Page>('home');
  const [educationLevel, setEducationLevel] = useState<'kids' | 'teens' | 'adults'>('kids');

  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const [discoveredPlanets, setDiscoveredPlanets] = useState<Exoplanet[]>([]);

  const { articles, initialPlanets } = useMockData();
  
  const handleGameComplete = (foundPlanetNames: string[]) => {
    const newlyDiscovered = initialPlanets.filter(p => foundPlanetNames.includes(p.name));
    setDiscoveredPlanets(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const uniqueNewDiscoveries = newlyDiscovered.filter(p => !existingIds.has(p.id));
        return [...prev, ...uniqueNewDiscoveries];
    });
  };

  const handleOpenPlanetDetails = (planet: Exoplanet) => {
    setSelectedPlanet(planet);
  };

  const handleClosePlanetDetails = () => {
    setSelectedPlanet(null);
  };
  
  const handleOpenArticle = (articleId: string) => {
    const article = articles.find(a => a.id === articleId);
    if (article) {
        setSelectedArticle(article);
    }
  };

  const handleCloseArticle = () => {
      setSelectedArticle(null);
  };


  const navigate = useCallback((targetPage: Page, level?: 'kids' | 'teens' | 'adults') => {
    window.scrollTo(0, 0); // Scroll to top on page change
    setPage(targetPage);
    if(level) {
      setEducationLevel(level);
    }
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage navigate={navigate} onPlanetSelect={handleOpenPlanetDetails} discoveredPlanets={discoveredPlanets} />;
      case 'game-instructions':
        return <GameInstructionsPage navigate={navigate} />;
      case 'game':
        return <GamePage navigate={navigate} onGameEnd={handleGameComplete} />;
      case 'education':
        return <EducationPage navigate={navigate} level={educationLevel} onPlanetSelect={handleOpenPlanetDetails} onArticleSelect={handleOpenArticle} />;
      case 'test-ai':
        return <TestAiPage navigate={navigate} />;
      default:
        return <HomePage navigate={navigate} onPlanetSelect={handleOpenPlanetDetails} discoveredPlanets={discoveredPlanets}/>;
    }
  };
  
  return (
    <div className="min-h-screen bg-transparent text-[var(--text-light)]">
      <Header onHomeClick={() => navigate('home')} currentPage={page} />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${page}-${educationLevel}`}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />

      <AnimatePresence>
        {selectedPlanet && (
          <PlanetDetailModal 
            planet={selectedPlanet}
            onClose={handleClosePlanetDetails} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedArticle && (
            <ArticleModal
                article={selectedArticle}
                onClose={handleCloseArticle}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
