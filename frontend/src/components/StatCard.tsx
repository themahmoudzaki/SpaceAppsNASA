import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, className }) => {
  return (
    <motion.div 
        className={`bg-slate-900/50 p-6 rounded-2xl border border-slate-700 text-center ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.5 }}
    >
      <p className="text-sm text-gray-400 font-medium">{title}</p>
      <p className="font-orbitron text-4xl lg:text-5xl font-bold text-white mt-2">
        {value}
      </p>
      {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
    </motion.div>
  );
};

export default StatCard;
