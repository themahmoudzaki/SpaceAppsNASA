import React from 'react';
import { motion} from 'framer-motion';
import type {Variants } from 'framer-motion';
import type { Exoplanet } from '../types';
import { XMarkIcon, CheckCircleIcon, QuestionMarkCircleIcon, XCircleIcon } from './IconComponents';

interface PlanetDetailModalProps {
  planet: Exoplanet;
  onClose: () => void;
}

const getTagStyles = (tag: Exoplanet['tag']) => {
  switch (tag) {
    case 'Confirmed':
      return { textColor: 'text-green-400', icon: <CheckCircleIcon className="w-5 h-5" /> };
    case 'Candidate':
      return { textColor: 'text-yellow-400', icon: <QuestionMarkCircleIcon className="w-5 h-5" /> };
    case 'False Positive':
      return { textColor: 'text-red-400', icon: <XCircleIcon className="w-5 h-5" /> };
  }
};

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } },
};

const StatItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-black/20 p-3 rounded-lg text-center border border-white/10">
    <p className="text-sm text-[var(--text-muted)]">{label}</p>
    <p className="font-orbitron font-bold text-xl text-[var(--text-light)] mt-1">{value}</p>
  </div>
);

const PlanetDetailModal: React.FC<PlanetDetailModalProps> = ({ planet, onClose }) => {
  const tagStyles = getTagStyles(planet.tag);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        className="bg-gradient-to-br from-[var(--primary-surface)] to-[#0f172a] w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col md:flex-row overflow-hidden"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="md:w-1/2 p-8 flex flex-col items-center justify-center bg-black/20 relative">
            <img 
                src={planet.image} 
                alt={planet.name} 
                className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_0_25px_rgba(230,230,250,0.6)]" 
            />
            <div 
                className="absolute inset-0"
                style={{ background: `radial-gradient(circle, ${planet.visualization.gradient.split(',')[0].replace('radial-gradient(circle, ', '')}30, transparent 70%)` }}
            ></div>
        </div>

        <div className="md:w-1/2 p-8 overflow-y-auto">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-orbitron text-4xl font-bold text-white">{planet.name}</h2>
                    <div className={`mt-2 inline-flex items-center space-x-2 px-3 py-1 text-sm font-semibold rounded-full ${tagStyles.textColor} bg-black/20`}>
                        {tagStyles.icon}
                        <span>{planet.tag}</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                    <XMarkIcon className="w-8 h-8"/>
                </button>
            </div>
            
            <p className="font-inter text-[var(--text-muted)] my-6">{planet.description}</p>

            <div className="grid grid-cols-2 gap-4">
                <StatItem label="Orbital Period" value={`${planet.orbitalPeriod} days`} />
                <StatItem label="Radius (xEarth)" value={planet.radius} />
            </div>

            <div className="mt-4">
                <p className="text-sm text-[var(--text-muted)] mb-2">AI Confidence</p>
                <div className="w-full bg-black/20 rounded-full h-4 border border-white/10">
                    <motion.div 
                        className="bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-lavender)] h-full rounded-full" 
                        style={{ width: `${planet.confidence * 100}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${planet.confidence * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />
                </div>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PlanetDetailModal;