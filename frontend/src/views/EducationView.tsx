import React from 'react';
import type { Page } from '../types';
import { motion } from 'framer-motion';

interface EducationViewProps {
  navigate: (page: Page, level: 'kids' | 'teens' | 'adults') => void;
}

const educationLevels = [
    {
        level: 'kids',
        title: "Kids Zone",
        description: "Jump into a cartoon adventure and discover the amazing secrets of the stars!",
        icon: '',
        imgUrl: "public/kids.jpg",
    },
    {
        level: 'teens',
        title: "Teen Zone",
        description: "Become a transit detective! Analyze real data and learn the science behind finding new worlds.",
        icon: '',
        imgUrl: "public/teen.jpg",
    },
    {
        level: 'adults',
        title: "Adult Zone",
        description: "Explore in-depth articles, data dashboards, and the latest in exoplanetary research.",
        icon: '',
        imgUrl: "public/adult.jpg",
    }
]

const EducationView: React.FC<EducationViewProps> = ({ navigate }) => {
  return (
    <section id="education" className="py-20 sm:py-32">
       <motion.h2 
        className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-12 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Exoplanet Discovery
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {educationLevels.map((item, index) => (
            <motion.div
                key={item.level}
                className="relative bg-[var(--primary)] rounded-2xl border border-white/10 overflow-hidden group h-96 flex flex-col justify-end p-6 text-white shadow-lg shadow-black/40 cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true, amount: 0.3 }}
                whileHover={{ y: -10, boxShadow: "0 20px 30px rgba(0,0,0,0.5), 0 0 20px var(--accent-purple)" }}
                onClick={() => navigate('education', item.level as 'kids'|'teens'|'adults')}
            >
                <img src={item.imgUrl} alt={`${item.title} background`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-40" />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent`}></div>

                <div className="relative z-10">
                    <h3 className="font-orbitron text-3xl font-bold"><span className="mr-2">{item.icon}</span>{item.title}</h3>
                    <p className="mt-2 text-[var(--text-muted)] font-inter">{item.description}</p>
                    <div 
                        className="mt-6 w-full bg-[var(--accent-purple)]/80 group-hover:bg-[var(--accent-yellow)] group-hover:text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 text-center"
                    >
                        Explore Zone
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
    </section>
  );
};

export default EducationView;