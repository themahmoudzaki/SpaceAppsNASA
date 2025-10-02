import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SparklesIcon } from '../components/IconComponents';

const ChallengeView: React.FC = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ['start end', 'end start'],
    });

    const textOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.8, 1], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0.1, 0.4], ['30px', '0px']);

    return (
        <section id="challenge" ref={targetRef} className="h-screen relative grid place-items-center overflow-hidden">
            <motion.div
                className="relative z-20 text-center p-8 max-w-4xl mx-auto"
                style={{ opacity: textOpacity, y: textY }}
            >
                <motion.div 
                    className="inline-flex items-center bg-purple-500/10 text-purple-300 rounded-full px-4 py-1 mb-6 border border-purple-500/30"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    <span>NASA Space Apps Challenge 2025</span>
                </motion.div>
                <h2 className="font-orbitron text-4xl sm:text-6xl font-black text-white leading-tight uppercase" style={{ textShadow: '0 0 15px var(--shadow-color)' }}>
                    A World Away
                </h2>
                <h3 className="font-orbitron text-2xl sm:text-3xl font-bold text-[var(--accent-lavender)] mt-2">
                    Hunting for Exoplanets with AI
                </h3>
                <p className="font-inter text-base sm:text-lg text-[var(--text-muted)] mt-6 max-w-3xl mx-auto">
                    Humanity’s greatest mysteries lie beyond our solar system. NASA challenged us to use Artificial Intelligence and Machine Learning to accelerate the discovery of exoplanets. Exo X Hunter is our response: a platform where cutting-edge AI meets interactive learning, transforming exoplanet hunting into an adventure for everyone.
                </p>
            </motion.div>
        </section>
    );
};

export default ChallengeView;