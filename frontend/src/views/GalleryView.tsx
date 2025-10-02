import React from 'react';
import type { Exoplanet, Page } from '../types';
import { useMockData } from '../hooks/useMockData';
import ExoplanetCard from '../components/ExoplanetCard';
import { PlusCircleIcon } from '../components/IconComponents';
import { motion, useAnimation} from 'framer-motion';
import type {  Variants } from 'framer-motion';

interface GalleryViewProps {
  navigate: (page: Page) => void;
  onPlanetSelect: (planet: Exoplanet) => void;
}

const pageVariants: Variants = {
  initial: (isRightPage: boolean) => ({
    rotateY: isRightPage ? -12 : 12,
    translateZ: 0,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)",
    transition: { type: "spring", stiffness: 200, damping: 30 }
  }),
  hover: (isRightPage: boolean) => ({
    rotateY: isRightPage ? -28 : 28,
    translateZ: 15,
    boxShadow: "5px 10px 40px rgba(0, 0, 0, 0.6)",
    transition: { type: "spring", stiffness: 200, damping: 30 }
  })
};

const GalleryView: React.FC<GalleryViewProps> = ({ navigate, onPlanetSelect }) => {
  const { initialPlanets } = useMockData();
  const leftPagePlanets = initialPlanets.slice(0, 3);
  const rightPagePlanets = initialPlanets.slice(3, 5);
  
  const leftPageControls = useAnimation();
  const rightPageControls = useAnimation();

  return (
    <section id="archive" className="py-20 sm:py-32">
      <motion.h2 
        className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-16 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Discovered Worlds Archive
      </motion.h2>
      
      <motion.div 
        className="max-w-7xl mx-auto"
        style={{ perspective: '2500px' }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="relative w-full aspect-[2/1.2] md:aspect-[2/0.8]">
          <motion.div 
            className="w-full h-full flex justify-center items-center"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Book Cover / Container */}
            <div className="absolute w-[101%] h-[103%] -top-[1.5%] -left-[0.5%] bg-gradient-to-br from-[#1e1a35] to-[#100e1f] rounded-2xl shadow-2xl lavender-shadow border-2 border-purple-900/50"
                 style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/leather.png')`, backgroundBlendMode: 'overlay', opacity: 0.2, transform: 'translateZ(-10px)' }}>
            </div>
            
            {/* Left Page */}
            <motion.div 
              className="absolute w-1/2 h-full p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#17132a] left-0 rounded-l-xl"
              style={{ transformOrigin: 'right center' }}
              variants={pageVariants}
              custom={false}
              initial="initial"
              animate={leftPageControls}
              onHoverStart={() => leftPageControls.start('hover')}
              onHoverEnd={() => leftPageControls.start('initial')}
            >
                {leftPagePlanets.map((planet) => (
                    <ExoplanetCard key={planet.id} planet={planet} onSelect={onPlanetSelect} />
                ))}
            </motion.div>

            {/* Book Spine */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-8 h-[102%] bg-gradient-to-r from-black/50 via-[#0a0814] to-black/50 border-y-2 border-purple-900/50"
              style={{ transform: 'translateZ(-5px)' }}
            ></div>

            {/* Right Page */}
            <motion.div 
              className="absolute w-1/2 h-full p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#17132a] right-0 rounded-r-xl"
              style={{ transformOrigin: 'left center' }}
              variants={pageVariants}
              custom={true}
              initial="initial"
              animate={rightPageControls}
              onHoverStart={() => rightPageControls.start('hover')}
              onHoverEnd={() => rightPageControls.start('initial')}
            >
                {rightPagePlanets.map((planet) => (
                    <ExoplanetCard key={planet.id} planet={planet} onSelect={onPlanetSelect} />
                ))}
                <motion.div
                    onClick={() => navigate('game-instructions')}
                    className="h-full bg-transparent border-2 border-dashed border-[var(--border-color)] rounded-xl flex flex-col items-center justify-center p-4 text-center transition-colors duration-300 cursor-pointer group"
                    whileHover={{
                        borderColor: "var(--accent-yellow)",
                        backgroundColor: "rgba(250, 204, 21, 0.05)"
                    }}
                >
                    <PlusCircleIcon className="w-16 h-16 text-[var(--accent-purple)] group-hover:text-[var(--accent-yellow)] transition-colors duration-300" />
                    <h4 className="font-orbitron text-lg font-bold mt-3 text-white">Start a New Hunt</h4>
                    <p className="text-[var(--text-muted)] mt-1 text-xs font-inter">Make the next great discovery.</p>
                </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default GalleryView;