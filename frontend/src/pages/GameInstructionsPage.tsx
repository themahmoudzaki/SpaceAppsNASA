import React from 'react';
import type { Page } from '../types';

interface GameInstructionsPageProps {
    navigate: (page: Page) => void;
}

const GameInstructionsPage: React.FC<GameInstructionsPageProps> = ({ navigate }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('home')} className="mb-8 text-[var(--accent-purple)] hover:text-[var(--text-light)] transition-colors">
                    &larr; Back to Archive
                </button>

                <div className="bg-[var(--secondary-surface)] p-8 rounded-2xl border-2 border-[var(--border-color)] shadow-2xl lavender-shadow">
                    <div className="text-center mb-8 border-b-2 border-[var(--border-color)] pb-6">
                        <h1 className="font-orbitron text-3xl sm:text-4xl font-black text-[var(--accent-yellow)] tracking-widest uppercase">Exoplanet Hunter License</h1>
                        <p className="text-lg text-[var(--text-muted)] mt-2">Mission Briefing: Classified</p>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-3">Objective: Identify Transits</h2>
                            <p className="text-[var(--text-muted)] font-inter">
                                Your primary tool is the Light Curve: a graph of a star's brightness. A planet "transiting" its star causes a small, periodic, U-shaped dip. This is your target signal.
                            </p>
                        </div>
                        <div>
                            <h2 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-3">Threat: False Positives</h2>
                            <p className="text-[var(--text-muted)] font-inter">
                                The universe is noisy. Stellar flares, instrument errors, and other phenomena can mimic transits. A true signal is clean and repeats regularly. Random fluctuations are noise. Trust your training.
                            </p>
                        </div>
                    </div>

                    <div className="my-10">
                        <h2 className="font-orbitron text-xl font-bold text-center text-[var(--accent-lavender)] mb-4">Training Simulation</h2>
                        <div className="aspect-video bg-black/50 border border-[var(--border-color)] rounded-xl flex items-center justify-center">
                            <p className="text-[var(--text-muted)]">Demo video coming soon...</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <button 
                            onClick={() => navigate('game')}
                            className="bg-gradient-to-r from-[var(--accent-yellow)] to-orange-400 text-black font-bold font-orbitron tracking-wider py-4 px-12 rounded-full text-xl transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-400/50"
                        >
                            START THE HUNT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameInstructionsPage;