import React from 'react';
import { motion } from 'framer-motion';
import { useMockData } from '../../hooks/useMockData';
import type { Exoplanet } from '../../types';
import ExoplanetCard from '../ExoplanetCard';
import InteractiveScatterPlot from './InteractiveScatterPlot';
import TransitDetectiveGame from './TransitDetectiveGame';

interface TeenZoneProps {
    onPlanetSelect: (planet: Exoplanet) => void;
}

const TeenZone: React.FC<TeenZoneProps> = ({ onPlanetSelect }) => {
    const { initialPlanets } = useMockData();
    const caseStudyPlanets = initialPlanets.slice(0, 3);
    
    return (
        <div>
            <h1 className="font-orbitron text-4xl sm:text-6xl font-bold text-white mb-4">Teen Zone: Become a Detective</h1>
            <p className="text-lg text-[var(--text-muted)] mb-12 max-w-3xl">
                Go beyond the headlines. Analyze real data, test your detection skills, and explore detailed case studies of some of the most fascinating exoplanets ever discovered.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Data Explorer & Chart */}
                <motion.div 
                    className="lg:col-span-2 bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-4">Data Explorer</h2>
                    <InteractiveScatterPlot planets={initialPlanets} />
                </motion.div>

                {/* Transit Detective Game */}
                <motion.div 
                    className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-4">Transit Detective Game</h2>
                    <p className="text-sm text-[var(--text-muted)] mb-4">Test your skills. Is this a real planet transit or just cosmic noise?</p>
                    <TransitDetectiveGame />
                </motion.div>
            </div>

            {/* Mini Case Studies */}
            <motion.div 
                className="mt-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-6">Mini Case Studies</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {caseStudyPlanets.map(planet => (
                        <ExoplanetCard key={planet.id} planet={planet} onSelect={onPlanetSelect} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default TeenZone;