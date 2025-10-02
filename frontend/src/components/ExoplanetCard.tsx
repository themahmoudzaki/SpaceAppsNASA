import React from 'react';
import { motion } from 'framer-motion';
import type { Exoplanet } from '../types';

interface ExoplanetCardProps {
  planet: Exoplanet;
  onSelect: (planet: Exoplanet) => void;
}

const ExoplanetCard: React.FC<ExoplanetCardProps> = ({ planet, onSelect }) => {
  return (
    <motion.div 
      className="bg-[var(--secondary-surface)] backdrop-blur-sm rounded-xl p-4 border border-[var(--border-color)] h-full flex flex-col group cursor-pointer"
      whileHover={{ 
        y: -12,
        rotate: 2,
        boxShadow: "0 20px 30px -10px var(--shadow-color)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={() => onSelect(planet)}
    >
      <div className="flex-grow">
        <div className="relative h-32 w-32 mx-auto mb-3">
          <motion.img 
            src={planet.image} 
            alt={`Visualization of ${planet.name}`} 
            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(230,230,250,0.4)]"
            whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
          />
        </div>
        
        <div className="text-center">
            <h4 className="font-orbitron text-xl font-bold text-[var(--text-light)]">{planet.name}</h4>
        </div>

        <p className="font-inter text-[var(--text-muted)] mt-3 text-xs text-center h-16 overflow-hidden">
            {planet.description}
        </p>
      </div>

      <div className="mt-4 text-center">
        <button 
          className="w-full bg-[var(--accent-purple)]/50 hover:bg-[var(--accent-purple)] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 border border-white/20 text-sm"
        >
          View Case File
        </button>
      </div>
    </motion.div>
  );
};

export default ExoplanetCard;