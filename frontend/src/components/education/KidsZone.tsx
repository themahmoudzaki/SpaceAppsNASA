import React from 'react';
import { motion } from 'framer-motion';
import QuizGame from './QuizGame';

const FunFactCard: React.FC<{ front: React.ReactNode, back: React.ReactNode }> = ({ front, back }) => (
    <div className="card-flip-container h-48 w-full">
        <div className="card-flipper">
            <div className="card-front rounded-2xl flex items-center justify-center p-4 text-center font-bold text-xl bg-gradient-to-br from-yellow-400 to-orange-400 text-black">
                {front}
            </div>
            <div className="card-back rounded-2xl flex items-center justify-center p-4 text-center text-white bg-gradient-to-br from-orange-500 to-red-500">
                {back}
            </div>
        </div>
    </div>
);

const KidsZone = () => {
    return (
        <div>
            <h1 className="font-orbitron text-4xl sm:text-6xl font-bold text-white mb-4">Kids Zone: A Trip to the Stars!</h1>
            <p className="text-lg text-[var(--text-muted)] mb-12 max-w-3xl">
                Welcome, Little Explorer! Get ready to learn about amazing planets that are very, very far away. Let's go on an adventure!
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 {/* Planet Fun Facts */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-yellow)] mb-6">Planet Fun Facts</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FunFactCard front="What is a 'Hot Jupiter'?" back="It's a giant gas planet that orbits super close to its star, making it incredibly hot! 🔥" />
                        <FunFactCard front="What is the 'Habitable Zone'?" back="It's the 'not too hot, not too cold' area around a star where liquid water could exist. 💧" />
                        <FunFactCard front="Can planets orbit two stars?" back="Yes! They're called circumbinary planets, just like Tatooine from Star Wars! ☀️☀️" />
                        <FunFactCard front="How many exoplanets have we found?" back="Over 5,000 and counting! We find more all the time. 🔭" />
                    </div>
                </motion.div>
                
                {/* Exoplanet Quiz */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-yellow)] mb-6">Test Your Knowledge!</h2>
                    <div className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]">
                       <QuizGame />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default KidsZone;