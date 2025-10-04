import React, { useState, useEffect, useMemo } from 'react';
import type { Exoplanet, Page } from '../types';
import { useMockData } from '../hooks/useMockData';
import ExoplanetCard from '../components/ExoplanetCard';
import { motion } from 'framer-motion';

interface GalleryViewProps {
  navigate: (page: Page) => void;
  onPlanetSelect: (planet: Exoplanet) => void;
  discoveredPlanetIds: string[];
}

const GalleryView: React.FC<GalleryViewProps> = ({ navigate, onPlanetSelect }) => {
  const { initialPlanets } = useMockData();

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
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Grid of all planets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialPlanets.map((planet) => (
            <div key={planet.id} className="h-full">
              <ExoplanetCard planet={planet} onSelect={onPlanetSelect} />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default GalleryView;
