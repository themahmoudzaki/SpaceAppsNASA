import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockData } from '../../hooks/useMockData';
import type { Exoplanet, LightCurveDataPoint } from '../../types';
import ExoplanetCard from '../ExoplanetCard';
import InteractiveScatterPlot from './InteractiveScatterPlot';
import LightCurveChart from '../LightCurveChart';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '../IconComponents';

// Data generation logic, simplified and moved from the old TransitDetectiveGame
const generateLightCurve = (): { data: LightCurveDataPoint[], isPlanet: boolean } => {
    const isPlanetSignal = Math.random() > 0.5; // 50% chance
    let data: LightCurveDataPoint[] = [];
    const noiseLevel = 0.008;
    const transitDepth = 0.015;
    const transitDuration = 0.25;
    const period = 5 + Math.random() * 5;

    for (let i = 0; i < 20; i += 0.05) {
        let flux = 1.0 + (Math.random() - 0.5) * noiseLevel;
        if (isPlanetSignal) {
            const timeInPeriod = i % period;
            if (timeInPeriod > period / 2 - transitDuration / 2 && timeInPeriod < period / 2 + transitDuration / 2) {
                flux -= transitDepth;
            }
        }
        data.push({ time: i, flux });
    }
    return { data, isPlanet: isPlanetSignal };
};


interface TeenZoneProps {
    onPlanetSelect: (planet: Exoplanet) => void;
}

const TeenZone: React.FC<TeenZoneProps> = ({ onPlanetSelect }) => {
    const { initialPlanets } = useMockData();
    const caseStudyPlanets = initialPlanets.slice(0, 3);

    // State for the interactive light curve
    const [lightCurve, setLightCurve] = useState<{ data: LightCurveDataPoint[], isPlanet: boolean }>({ data: [], isPlanet: false });
    const [choice, setChoice] = useState<'planet' | 'noise' | null>(null);

    const generateNewCase = useCallback(() => {
        setChoice(null);
        setLightCurve(generateLightCurve());
    }, []);

    useEffect(() => {
        generateNewCase();
    }, [generateNewCase]);
    
    const { data, isPlanet } = lightCurve;
    const result = choice ? (choice === 'planet' && isPlanet) || (choice === 'noise' && !isPlanet) : null;
    
    return (
        <div>
            <h1 className="font-orbitron text-4xl sm:text-6xl font-bold text-white mb-4">Teen Zone: Become a Detective</h1>
            <p className="text-lg text-[var(--text-muted)] mb-12 max-w-3xl">
                Go beyond the headlines. Analyze real data, test your detection skills, and explore detailed case studies of some of the most fascinating exoplanets ever discovered.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                <motion.div 
                    className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">Exoplanet Population</h2>
                    <InteractiveScatterPlot planets={initialPlanets} />
                </motion.div>

                <motion.div 
                    className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)] flex flex-col"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">Sample Light Curve</h2>
                    <div className="flex-grow">
                        <LightCurveChart data={data} />
                    </div>
                     <div className="mt-4">
                        {choice === null ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setChoice('planet')} className="w-full bg-green-600/80 hover:bg-green-600 font-bold py-3 rounded-lg transition-colors">Planet</button>
                                <button onClick={() => setChoice('noise')} className="w-full bg-red-600/80 hover:bg-red-600 font-bold py-3 rounded-lg transition-colors">Noise</button>
                            </div>
                        ) : (
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center p-2 rounded-lg"
                                >
                                    {result ? (
                                        <div className="flex items-center justify-center text-green-400">
                                            <CheckCircleIcon className="w-6 h-6 mr-2" />
                                            <p className="font-bold">Correct! {isPlanet ? "This was a transit signal." : "This was just noise."}</p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center text-red-400">
                                            <XCircleIcon className="w-6 h-6 mr-2" />
                                            <p className="font-bold">Incorrect. {isPlanet ? "This was a real transit!" : "This was only noise."}</p>
                                        </div>
                                    )}
                                    <button onClick={generateNewCase} className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-lavender)] hover:text-black font-bold py-2 rounded-lg transition-colors mt-3 flex items-center justify-center gap-2">
                                        <ArrowPathIcon className="w-5 h-5" /> New Case File
                                    </button>
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Mini Case Studies */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="font-orbitron text-3xl font-bold text-center text-[var(--accent-lavender)] mb-8">Mini Case Studies</h2>
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