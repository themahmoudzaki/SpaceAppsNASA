import React, { useState, useEffect, useMemo } from 'react';
import type { Exoplanet, Page } from '../types';
import { useMockData } from '../hooks/useMockData';
import ExoplanetCard from '../components/ExoplanetCard';
import { PlusCircleIcon } from '../components/IconComponents';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryViewProps {
  navigate: (page: Page) => void;
  onPlanetSelect: (planet: Exoplanet) => void;
  discoveredPlanetIds: string[];
}

// Helper to chunk array
const chunk = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        }
    }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const pageFlipVariants = {
  enter: (direction: number) => ({
    zIndex: 1,
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
  }),
  center: {
    zIndex: 2,
    rotateY: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 1,
    rotateY: direction < 0 ? 90 : -90,
    opacity: 0,
  }),
};

const GalleryView: React.FC<GalleryViewProps> = ({ navigate, onPlanetSelect, discoveredPlanetIds }) => {
  const { initialPlanets } = useMockData();

  const allPlanetsAndButton = useMemo(() => {
    const discovered = initialPlanets.filter(p => discoveredPlanetIds.includes(p.id));
    const notDiscovered = initialPlanets.filter(p => !discoveredPlanetIds.includes(p.id));
    const allKnownPlanets = [...notDiscovered, ...discovered];
    const startHuntButton = { isButton: true };
    return [...allKnownPlanets, startHuntButton];
  }, [initialPlanets, discoveredPlanetIds]);

  const pages = useMemo(() => chunk(allPlanetsAndButton, 6), [allPlanetsAndButton]);

  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    if (discoveredPlanetIds.length > 0) {
      const lastPageIndex = pages.length - 1;
      if (page !== lastPageIndex) {
        setPage([lastPageIndex, 1]); // Animate forward to last page
      }
    } else {
      if (page !== 0) {
        setPage([0, -1]);
      }
    }
  }, [discoveredPlanetIds, pages.length]);

  const paginate = (newDirection: number) => {
    const nextPage = page + newDirection;
    if (nextPage >= 0 && nextPage < pages.length) {
        setPage([nextPage, newDirection]);
    }
  };

  const currentPageIndex = ((page % pages.length) + pages.length) % pages.length;

  return (
    <section id="archive" className="py-20 sm:py-32">
        <motion.h2 
            className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-16 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            Discovered Worlds Archive
        </motion.h2>
      
        <div className="max-w-7xl mx-auto" style={{ perspective: '3000px' }}>
            <div className="relative w-full aspect-[2/1.2] md:aspect-[2/0.8]">
                 <div className="absolute w-full h-full flex justify-center items-center">
                    <div className="w-[101%] h-[103%] -top-[1.5%] -left-[0.5%] bg-gradient-to-br from-[#1e1a35] to-[#100e1f] rounded-2xl shadow-2xl lavender-shadow border-2 border-purple-900/50" />
                    <div className="absolute left-1/2 -translate-x-1/2 w-8 h-[102%] bg-gradient-to-r from-black/50 via-[#0a0814] to-black/50 border-y-2 border-purple-900/50" />
                </div>
                
                <AnimatePresence initial={false} custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={pageFlipVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            rotateY: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        className="absolute inset-0 flex"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <motion.div 
                            className="w-full h-full grid grid-cols-2"
                            variants={cardContainerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                          {/* Page content */}
                          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#17132a] rounded-l-xl">
                             {pages[currentPageIndex]?.slice(0, 3).map(item => (
                                item && ('isButton' in item) ? (
                                    <motion.div key="button-left" variants={cardVariants}>
                                      <StartHuntCard navigate={navigate} />
                                    </motion.div>
                                ) : (
                                    item && <motion.div key={(item as Exoplanet).id} variants={cardVariants}>
                                      <ExoplanetCard planet={item as Exoplanet} onSelect={onPlanetSelect} />
                                    </motion.div>
                                )
                             ))}
                          </div>
                          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#17132a] rounded-r-xl">
                             {pages[currentPageIndex]?.slice(3, 6).map(item => (
                                item && ('isButton' in item) ? (
                                    <motion.div key="button-right" variants={cardVariants}>
                                      <StartHuntCard navigate={navigate} />
                                    </motion.div>
                                ) : (
                                    item && <motion.div key={(item as Exoplanet).id} variants={cardVariants}>
                                      <ExoplanetCard planet={item as Exoplanet} onSelect={onPlanetSelect} />
                                    </motion.div>
                                )
                             ))}
                          </div>

                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Hover controls */}
                <div className="absolute left-0 top-0 w-1/4 h-full cursor-pointer z-30" onMouseEnter={() => paginate(-1)}></div>
                <div className="absolute right-0 top-0 w-1/4 h-full cursor-pointer z-30" onMouseEnter={() => paginate(1)}></div>
            </div>
        </div>
    </section>
  );
};

const StartHuntCard: React.FC<{navigate: (page: Page) => void;}> = ({ navigate }) => (
    <motion.div
        onClick={() => navigate('game-instructions')}
        className="h-full bg-transparent border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center p-4 text-center transition-colors duration-300 cursor-pointer group"
        whileHover={{ borderColor: "var(--accent-yellow)", backgroundColor: "rgba(250, 204, 21, 0.05)" }}
    >
        <PlusCircleIcon className="w-16 h-16 text-[var(--accent-purple)] group-hover:text-[var(--accent-yellow)] transition-colors duration-300" />
        <h4 className="font-orbitron text-lg font-bold mt-3 text-white">Start a New Hunt</h4>
        <p className="text-xs text-[var(--text-muted)] mt-1 font-inter">Make the next great discovery.</p>
    </motion.div>
);

export default GalleryView;
