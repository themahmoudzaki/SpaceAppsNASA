import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Page } from '../types';
import { checkExoplanetCandidate } from '../services/geminiService';
import type { CandidateData, CandidateResponse } from '../services/geminiService';
import { SparklesIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '../components/IconComponents';

interface TestAiPageProps {
    navigate: (page: Page) => void;
}

const initialFormData: CandidateData = {
  period: 9.2,
  duration: 2.7,
  depth: 350.5,
  planetRadius: 1.5,
  semiMajorAxis: 0.08,
  starRadius: 0.9,
  teff: 5500,
  logg: 4.5,
  source: 'Kepler',
};

const inputConfig = {
    period: { label: 'Orbital Period (days)', min: 1, max: 500, step: 0.1 },
    duration: { label: 'Transit Duration (hours)', min: 0.5, max: 24, step: 0.1 },
    depth: { label: 'Transit Depth (ppm)', min: 50, max: 50000, step: 10 },
    planetRadius: { label: 'Planet Radius (xEarth)', min: 0.5, max: 25, step: 0.1 },
    semiMajorAxis: { label: 'Semi-Major Axis (AU)', min: 0.01, max: 2, step: 0.01 },
    starRadius: { label: 'Star Radius (xSun)', min: 0.1, max: 10, step: 0.1 },
    teff: { label: 'Star Temperature (K)', min: 2000, max: 10000, step: 100 },
    logg: { label: 'Star Surface Gravity (log g)', min: 1, max: 5, step: 0.1 },
};

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center text-center">
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-t-[var(--accent-yellow)] border-transparent rounded-full"
        />
        <p className="mt-4 font-orbitron tracking-wider">ANALYZING SIGNAL...</p>
    </div>
);


const TestAiPage: React.FC<TestAiPageProps> = ({ navigate }) => {
    const [formData, setFormData] = useState<CandidateData>(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CandidateResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CandidateData) => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData((prev: CandidateData) => ({ ...prev, source: e.target.value as 'Kepler' | 'TESS' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);
        setError(null);
        try {
            const response = await checkExoplanetCandidate(formData);
            setResult(response);
        } catch (err) {
            setError('Failed to communicate with the AI model. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetForm = () => {
        setFormData(initialFormData);
        setResult(null);
        setError(null);
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => navigate('home')} className="mb-8 text-[var(--accent-purple)] hover:text-[var(--text-light)] transition-colors">
                    &larr; Back to Mission Control
                </button>

                <div className="text-center">
                    <h1 className="font-orbitron text-3xl sm:text-5xl font-black text-white tracking-wide">AI ANALYSIS LAB</h1>
                    <p className="text-lg text-[var(--text-muted)] mt-2">Input candidate data to get a real-time classification from our custom AI model.</p>
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Form Section */}
                    <motion.form 
                        onSubmit={handleSubmit}
                        className="bg-[var(--secondary-surface)] p-6 rounded-2xl border border-[var(--border-color)] space-y-4"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(inputConfig).map(([key, config]) => (
                                <div key={key}>
                                    <label htmlFor={key} className="block text-sm font-medium text-[var(--text-muted)]">{config.label}</label>
                                    <div className="flex items-center gap-2 mt-1">
                                    <input
                                        type="range"
                                        id={key}
                                        name={key}
                                        min={config.min}
                                        max={config.max}
                                        step={config.step}
                                        value={formData[key as keyof Omit<CandidateData, 'source'>]}
                                        onChange={handleInputChange}
                                        className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer"
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="number"
                                        value={formData[key as keyof Omit<CandidateData, 'source'>]}
                                        onChange={handleInputChange}
                                        name={key}
                                        className="w-20 bg-black/30 border border-[var(--border-color)] rounded-md p-1 text-center"
                                        disabled={isLoading}
                                    />
                                    </div>
                                </div>
                            ))}
                             <div>
                                <label htmlFor="source" className="block text-sm font-medium text-[var(--text-muted)]">Data Source</label>
                                <select 
                                    id="source" name="source" value={formData.source} onChange={handleSourceChange}
                                    className="w-full mt-1 bg-black/30 border border-[var(--border-color)] rounded-md p-2"
                                    disabled={isLoading}
                                >
                                    <option>Kepler</option>
                                    <option>TESS</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                             <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--accent-yellow)] to-orange-400 text-black font-bold font-orbitron tracking-wider py-3 px-6 rounded-full text-lg transform hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                <SparklesIcon className="w-6 h-6" />
                                ANALYZE
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isLoading}
                                title="Reset Form"
                                className="p-3 bg-[var(--primary-surface)] hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                            >
                                <ArrowPathIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.form>
                    
                    {/* Result Section */}
                    <motion.div 
                        className="bg-[var(--secondary-surface)] p-8 rounded-2xl border border-[var(--border-color)] min-h-[300px] flex items-center justify-center"
                         initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                       <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div key="loader" exit={{ opacity: 0, scale: 0.8 }}>
                                    <LoadingSpinner />
                                </motion.div>
                            ) : result ? (
                                <motion.div 
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    {result.disposition === 'CONFIRMED' ? (
                                        <>
                                            <CheckCircleIcon className="w-20 h-20 text-green-400 mx-auto" />
                                            <h3 className="font-orbitron text-3xl font-bold text-green-400 mt-4">PLANET CONFIRMED</h3>
                                        </>
                                    ) : (
                                        <>
                                            <XCircleIcon className="w-20 h-20 text-red-400 mx-auto" />
                                            <h3 className="font-orbitron text-3xl font-bold text-red-400 mt-4">FALSE POSITIVE</h3>
                                        </>
                                    )}
                                    <p className="text-lg font-bold text-white mt-4">Confidence: { (result.confidence * 100).toFixed(1) }%</p>
                                    <p className="text-[var(--text-muted)] mt-2 italic">AI Analysis: "{result.reasoning}"</p>
                                </motion.div>
                            ) : error ? (
                                <motion.div key="error" className="text-center text-red-400">
                                    <p>{error}</p>
                                </motion.div>
                            ) : (
                                <motion.div key="placeholder" className="text-center text-[var(--text-muted)]">
                                    <p>Awaiting Signal Data...</p>
                                </motion.div>
                            )}
                       </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TestAiPage;
