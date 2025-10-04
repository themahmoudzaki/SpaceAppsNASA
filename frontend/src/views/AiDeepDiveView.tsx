import React from 'react';
import { motion } from 'framer-motion';
import type {Variants } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon } from '../components/IconComponents';
import LightCurveChart from '../components/LightCurveChart';
import type { LightCurveDataPoint } from '../types';

// Sample data for the mini charts
const planetData: LightCurveDataPoint[] = Array.from({ length: 100 }, (_, i) => {
    let flux = 1.0 + (Math.random() - 0.5) * 0.002;
    if ((i > 20 && i < 30) || (i > 70 && i < 80)) {
        flux -= 0.01;
    }
    return { time: i * 0.2, flux };
});

const BrainIcon = ({className}: {className?: string}) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 21C12 21 16 16.5 16 12C16 7.5 12 3 12 3C12 3 8 7.5 8 12C8 16.5 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M12 3V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M21 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 21V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.3639 5.63623L19.071 4.92912" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4.92896 19.0712L5.63607 18.3641" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.3639 18.3641L19.071 19.0712" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M4.92896 4.92912L5.63607 5.63623" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
)

const ArrowIcon = () => (
    <svg className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
)

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut'
        }
    }
};


const AiDeepDiveView: React.FC = () => {
    return (
        <section id="ai-deep-dive" className="py-20 sm:py-32">
            <motion.h2 
                className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-16 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                How the AI Thinks
            </motion.h2>

            <motion.div 
                className="flex flex-col lg:flex-row items-center justify-between gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {/* Step 1: Input */}
                <motion.div variants={itemVariants} className="flex-1 text-center">
                    <h3 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">1. Data Input</h3>
                    <div className="w-full h-48 rounded-lg border-2 border-dashed border-[var(--border-color)] flex items-center justify-center">
                        <div className="w-full max-w-xs h-3/4">
                            <LightCurveChart data={planetData} />
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-4">Raw light curve data from telescopes is fed into the model.</p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="hidden lg:block">
                    <ArrowIcon />
                </motion.div>
                
                {/* Step 2: Analysis */}
                <motion.div variants={itemVariants} className="flex-1 text-center">
                    <h3 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">2. AI Analysis</h3>
                    <div className="w-full h-48 rounded-lg bg-[var(--secondary-surface)] flex items-center justify-center border border-[var(--border-color)]">
                        <BrainIcon className="w-24 h-24 text-[var(--accent-yellow)] animate-pulse" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-4">The model searches for periodic, U-shaped dips and ignores random noise.</p>
                </motion.div>

                <motion.div variants={itemVariants} className="hidden lg:block">
                    <ArrowIcon />
                </motion.div>

                {/* Step 3: Classification */}
                <motion.div variants={itemVariants} className="flex-1 text-center">
                    <h3 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">3. Classification</h3>
                     <div className="w-full h-48 rounded-lg bg-[var(--secondary-surface)] flex items-center justify-around p-4 border border-[var(--border-color)]">
                        <div className="text-center">
                            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto" />
                            <p className="mt-2 font-semibold text-green-400">Planet Confirmed</p>
                        </div>
                         <div className="text-center">
                            <XCircleIcon className="w-16 h-16 text-red-400 mx-auto" />
                            <p className="mt-2 font-semibold text-red-400">False Positive</p>
                        </div>
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mt-4">A verdict is returned with a confidence score.</p>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default AiDeepDiveView;