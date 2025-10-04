import React from 'react';
import { motion } from 'framer-motion';
import { useMockData } from '../hooks/useMockData';
import TelescopeCard from '../components/TelescopeCard';

const ObservatoryView: React.FC = () => {
  const { telescopes } = useMockData();

  return (
    <section id="observatory" className="py-20 sm:py-32">
      <motion.h2 
        className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-16 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        The Observatory: Tools of the Hunt
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {telescopes.map((telescope, index) => (
          <motion.div
            key={telescope.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <TelescopeCard telescope={telescope} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ObservatoryView;