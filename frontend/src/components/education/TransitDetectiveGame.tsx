// FIX: Added component implementation to resolve module import error.
import  { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightCurveChart from '../LightCurveChart';
import type { LightCurveDataPoint } from '../../types';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '../IconComponents';

type Difficulty = 'easy' | 'medium' | 'hard';

const generateData = (difficulty: Difficulty): { data: LightCurveDataPoint[], isPlanet: boolean } => {
    const isPlanetSignal = Math.random() > 0.4; // 60% chance of planet
    let data: LightCurveDataPoint[] = [];
    let noiseLevel = 0.002;
    let transitDepth = 0.02;
    let transitDuration = 0.3;

    switch(difficulty) {
        case 'medium':
            noiseLevel = 0.008;
            transitDepth = 0.01;
            transitDuration = 0.2;
            break;
        case 'hard':
            noiseLevel = 0.015;
            transitDepth = 0.005;
            transitDuration = 0.15;
            break;
    }

    const period = 5 + Math.random() * 5;

    for (let i = 0; i < 20; i += 0.05) {
        let flux = 1.0 + (Math.random() - 0.5) * noiseLevel;
        if (isPlanetSignal) {
            const timeInPeriod = i % period;
            if (timeInPeriod > period / 2 - transitDuration / 2 && timeInPeriod < period / 2 + transitDuration / 2) {
                flux -= transitDepth;
            }
        }
        // Hard mode: add a random stellar flare (spike)
        if (difficulty === 'hard' && Math.random() < 0.01) {
            flux += 0.02;
        }
        data.push({ time: i, flux });
    }

    return { data, isPlanet: isPlanetSignal };
};


const TransitDetectiveGame = () => {
    const [data, setData] = useState<LightCurveDataPoint[]>([]);
    const [isPlanet, setIsPlanet] = useState(false);
    const [choice, setChoice] = useState<'planet' | 'noise' | null>(null);
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');

    const generateNewCase = useCallback(() => {
        setChoice(null);
        const { data: newData, isPlanet: newIsPlanet } = generateData(difficulty);
        setData(newData);
        setIsPlanet(newIsPlanet);
    }, [difficulty]);

    useEffect(() => {
        generateNewCase();
    }, [generateNewCase]);
    
    const handleDifficultyChange = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
    }

    const result = choice ? (choice === 'planet' && isPlanet) || (choice === 'noise' && !isPlanet) : null;

    return (
        <div className="h-full flex flex-col justify-between">
             <div className="flex justify-center gap-2 mb-4">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                    <button 
                        key={level}
                        onClick={() => handleDifficultyChange(level)}
                        className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors border-2 ${difficulty === level ? 'bg-[var(--accent-purple)] border-[var(--accent-purple)] text-white' : 'bg-transparent border-[var(--border-color)] text-[var(--text-muted)] hover:bg-white/10 hover:border-white/30'}`}
                    >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                ))}
            </div>
            <div className="flex-grow">
                <LightCurveChart data={data} />
            </div>
            <div className="mt-4">
                {choice === null ? (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setChoice('planet')} className="w-full bg-green-600/50 hover:bg-green-600 font-bold py-3 rounded-lg transition-colors">Planet</button>
                        <button onClick={() => setChoice('noise')} className="w-full bg-red-600/50 hover:bg-red-600 font-bold py-3 rounded-lg transition-colors">Noise</button>
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
                                    <p className="font-bold">Correct! {isPlanet ? "This was a clear transit signal." : "This was just random noise."}</p>

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
        </div>
    );
};

export default TransitDetectiveGame;
