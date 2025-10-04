import React, { useState, useEffect } from 'react';
import type { Page, GameLevel } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { gameLevels } from '../data/gameData';

interface GamePageProps {
    navigate: (page: Page) => void;
    onGameEnd: (discoveredIds: string[]) => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

// Simple CSS Fireworks
const Fireworks = () => (
    <>
        <div className="fireworks-container">
            <div className="firework"></div>
            <div className="firework"></div>
            <div className="firework"></div>
        </div>
        <style>{`
            .fireworks-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; z-index: 100; pointer-events: none; }
            .firework { position: absolute; border-radius: 50%; animation: firework-anim 1.2s both infinite; }
            .firework::before, .firework::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; }
            .firework:nth-child(1) { left: 20%; top: 30%; width: 5px; height: 5px; animation-delay: 0s; background-color: var(--accent-yellow); }
            .firework:nth-child(2) { left: 80%; top: 50%; width: 7px; height: 7px; animation-delay: 0.4s; background-color: var(--accent-lavender); }
            .firework:nth-child(3) { left: 50%; top: 70%; width: 6px; height: 6px; animation-delay: 0.8s; background-color: #fff; }
            @keyframes firework-anim {
                0% { transform: scale(1); opacity: 1; box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px currentColor, 0 0 25px currentColor, 0 0 30px currentColor, 0 0 35px currentColor; }
                100% { transform: scale(30); opacity: 0; box-shadow: none; }
            }
        `}</style>
    </>
);

const GamePage: React.FC<GamePageProps> = ({ navigate, onGameEnd }) => {
    const [levels, setLevels] = useState<GameLevel[]>([]);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<(boolean | null)[]>(Array(20).fill(null));
    const [discoveredPlanetIds, setDiscoveredPlanetIds] = useState<string[]>([]);
    const [streak, setStreak] = useState(0);
    const [gameState, setGameState] = useState<'playing' | 'answered' | 'finished'>('playing');

    useEffect(() => {
        setLevels(shuffleArray(gameLevels));
    }, []);
    
    const currentLevel = levels[currentLevelIndex];

    const handleAnswer = (userChoice: 'yes' | 'no') => {
        if (gameState !== 'playing' || !currentLevel) return;

        const isCorrect = (userChoice === 'yes' && currentLevel.isPlanet) || (userChoice === 'no' && !currentLevel.isPlanet);
        
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentLevelIndex] = isCorrect;
            return newAnswers;
        });

        if (isCorrect) {
            setScore(prev => prev + 20);
            setStreak(prev => prev + 1);
            if (currentLevel.isPlanet && currentLevel.planetId && !discoveredPlanetIds.includes(currentLevel.planetId)) {
                setDiscoveredPlanetIds(prev => [...prev, currentLevel.planetId!]);
            }
        } else {
            setStreak(0);
        }
        
        setGameState('answered');

        setTimeout(() => {
            if (currentLevelIndex < levels.length - 1) {
                setCurrentLevelIndex(prev => prev + 1);
                setGameState('playing');
            } else {
                setGameState('finished');
                onGameEnd(discoveredPlanetIds);
            }
        }, 2000);
    };

    const getLanshonImage = () => {
        if (streak >= 3) return "/game-assets/happy copy.png";
        if (gameState === 'answered' && answers[currentLevelIndex] === false) return "/game-assets/sad lanshon.png";
        return "/game-assets/normal lanshon.png";
    };

    if (levels.length === 0) {
        return <div className="min-h-screen flex items-center justify-center bg-[var(--background-end)]">Loading Game...</div>;
    }
    
    const renderDataFeature = (label: string, value: string | number) => (
         <motion.div 
            key={`${currentLevelIndex}-${label}`}
            className="bg-black/30 p-2 rounded-lg text-center border border-white/10 flex flex-col justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{label.replace(/_/g, ' ')}</p>
            <p className="font-orbitron font-bold text-lg text-white">{value}</p>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[var(--background-end)] flex items-center justify-center p-4">
            <div 
                className="w-full max-w-7xl aspect-video bg-cover bg-center rounded-2xl shadow-2xl shadow-black/50 relative"
                style={{ backgroundImage: "url('/game-assets/bg.jpg')" }}
            >
                <AnimatePresence>
                {gameState === 'finished' && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-center p-4"
                     >
                        <Fireworks />
                        <h1 className="font-orbitron text-5xl font-bold text-[var(--accent-yellow)]">MISSION COMPLETE!</h1>
                        <p className="text-2xl mt-4">Final Score: {score}</p>
                        <div className="mt-6 max-w-lg">
                            <h3 className="text-xl font-bold text-[var(--accent-lavender)]">New Exoplanets Confirmed:</h3>
                            <p className="text-lg text-white">{discoveredPlanetIds.length > 0 ? discoveredPlanetIds.map(id => id.replace(/-/g, ' ').replace(/epic /g, 'EPIC ')).join(', ') : "None this time, try again!"}</p>
                        </div>
                        <button onClick={() => navigate('home')} className="mt-8 bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-lavender)] text-black font-bold py-3 px-8 rounded-full text-lg">
                            Return to Archive
                        </button>
                     </motion.div>
                )}
                </AnimatePresence>
                
                {/* Main Game Layout Grid */}
                <div 
                    className="w-full h-full p-[5%] grid grid-cols-3 grid-rows-3 gap-x-8 gap-y-4 font-inter text-white"
                >
                    {/* TOP ROW: Score, Title, Levels */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <p className="font-orbitron text-xl uppercase">Score</p>
                        <p className="font-orbitron text-6xl font-bold">{score}</p>
                    </div>
                    <div className="flex items-start justify-center pt-4">
                         <img src="/game-assets/lets hunt.png" alt="Let's Hunt" className="w-full max-w-md"/>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p className="font-orbitron text-lg uppercase mb-2">Levels</p>
                        <div className="grid grid-cols-10 gap-2 w-full max-w-sm">
                            {answers.map((answer, index) => (
                                <div key={index} className={`w-full aspect-square rounded-md ${index === currentLevelIndex ? 'ring-2 ring-yellow-400' : ''}`}>
                                    <img src={answer === null ? '/game-assets/gray box.png' : answer ? '/game-assets/green box.png' : '/game-assets/gray box.png'} alt="level" className="w-full h-full" />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* MIDDLE ROW: Data Grid, Character */}
                    <div className="col-span-2 flex flex-col items-center justify-center p-4">
                        <div className="bg-black/20 border border-white/10 rounded-xl p-4 w-full">
                            <div className="grid grid-cols-3 gap-4">
                                <AnimatePresence mode="wait">
                                    {currentLevel && Object.entries(currentLevel.features).map(([key, value]) => renderDataFeature(key, value as string | number))}
                                </AnimatePresence>
                            </div>
                        </div>
                        <h3 className="font-orbitron text-4xl mt-4 text-white">
                            Is This an Exoplanet?
                        </h3>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4">
                         <p className="font-orbitron text-lg uppercase">Discovered</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[...Array(11)].map((_, index) => (
                                <img
                                    key={index}
                                    src={index < discoveredPlanetIds.length ? '/game-assets/purple box.png' : '/game-assets/gray box.png'}
                                    alt="discovered placeholder"
                                    className="w-8 h-8 rounded-md"
                                />
                            ))}
                        </div>
                        <img src={getLanshonImage()} alt="Lanshon the monkey" className="w-28"/>
                         <div className="flex justify-center gap-2 w-28">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`flex-1 h-4 rounded-sm border-2 border-black/20 ${i < streak ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                            ))}
                         </div>
                    </div>

                    {/* BOTTOM ROW: Empty, Action Buttons */}
                    <div className="col-span-2" />
                    <div className="flex items-center justify-center gap-4">
                        <button onClick={() => handleAnswer('yes')} disabled={gameState !== 'playing'} className="disabled:opacity-50 transition-transform hover:scale-110">
                            <img src="/game-assets/yes.png" alt="Yes" className="h-16"/>
                        </button>
                        <button onClick={() => handleAnswer('no')} disabled={gameState !== 'playing'} className="disabled:opacity-50 transition-transform hover:scale-110">
                                <img src="/game-assets/no.png" alt="No" className="h-16"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;