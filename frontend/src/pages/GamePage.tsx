import React from 'react';
import type { Page } from '../types';

interface GamePageProps {
    navigate: (page: Page) => void;
}

const GamePage: React.FC<GamePageProps> = ({ navigate }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center container mx-auto px-4 overflow-hidden">
            <h1 className="font-orbitron text-4xl sm:text-6xl font-bold text-white mb-4 z-10">Searching for Signal...</h1>
            <p className="text-lg text-[var(--text-muted)] mb-8 max-w-2xl z-10">
                Our deep space sensors are scanning the cosmos for light curve data. Your first case file will be ready momentarily.
            </p>
            
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
                {/* Scanning Grid and Pulse Animation */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                <div className="scanner-line"></div>
                <div className="pulse-ring"></div>
                <div className="pulse-ring" style={{ animationDelay: '1s' }}></div>
                <div className="target-reticle"></div>
            </div>
            
            <button onClick={() => navigate('home')} className="mt-12 text-lg bg-[var(--primary-surface)] hover:bg-[var(--secondary-surface)] text-white font-semibold py-3 px-6 rounded-lg transition-colors border border-[var(--border-color)] z-10">
                Abort Mission & Return
            </button>

            <style>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, var(--accent-purple) 1px, transparent 1px),
                        linear-gradient(to bottom, var(--accent-purple) 1px, transparent 1px);
                    background-size: 2rem 2rem;
                }
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .scanner-line {
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, var(--accent-yellow), transparent);
                    animation: scan 3s linear infinite;
                    box-shadow: 0 0 10px var(--accent-yellow);
                }
                @keyframes pulse {
                    0% { transform: scale(0.5); opacity: 0.7; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid var(--accent-lavender);
                    border-radius: 50%;
                    animation: pulse 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
                }
                .target-reticle {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--accent-yellow);
                    border-radius: 50%;
                }
                .target-reticle::before, .target-reticle::after {
                    content: '';
                    position: absolute;
                    background: var(--accent-yellow);
                }
                .target-reticle::before {
                    left: 50%;
                    top: -10px;
                    width: 2px;
                    height: calc(100% + 20px);
                    transform: translateX(-50%);
                }
                .target-reticle::after {
                    top: 50%;
                    left: -10px;
                    height: 2px;
                    width: calc(100% + 20px);
                    transform: translateY(-50%);
                }
            `}</style>
        </div>
    );
};

export default GamePage;