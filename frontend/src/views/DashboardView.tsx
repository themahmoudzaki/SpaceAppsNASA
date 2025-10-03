import React from 'react';
import { useMockData } from '../hooks/useMockData';
import StatCard from '../components/StatCard';
import { motion } from 'framer-motion';
import type { Page } from '../types';
import PlanetArchive from "../components/dashboard.tsx"

interface DashboardViewProps {
  navigate: (page: Page) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DashboardView: React.FC<DashboardViewProps> = ({ navigate }) => {
  const { dashboardData } = useMockData();
  const { performanceMetrics } = dashboardData;

  const stats = [
    { title: "Exoplanets Detected", value: dashboardData.exoplanetsDetected, className: "lg:col-span-2" },
    { title: "Candidates Pending", value: dashboardData.candidatesPending },
    { title: "Light Curves Processed", value: dashboardData.lightCurvesProcessed },
    { title: "Model Accuracy", value: `${dashboardData.modelAccuracy}%` },
    { title: "Precision", value: performanceMetrics.precision.toFixed(2) },
    { title: "Recall", value: performanceMetrics.recall.toFixed(2) },
    { title: "F1-Score", value: performanceMetrics.f1Score.toFixed(2) },
  ];

  return (
    <section id="mission-control" className="py-20 sm:py-32">
      <motion.h2
        className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        AI Mission Control
      </motion.h2>

      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <button
          onClick={() => navigate('test-ai')}
          className="bg-gradient-to-r from-[var(--accent-yellow)] to-orange-400 text-black font-bold font-orbitron tracking-wider py-5 px-16 rounded-full text-2xl transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-yellow-500/30 hover:shadow-yellow-400/50"
        >
          Test the AI Model
        </button>
      </motion.div>

      {/* Planet Archive replaces confusion matrix */}
      <motion.div
        className="mt-8 bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h3 className="font-orbitron text-xl font-bold text-white mb-4 text-center">Planet Archive</h3>
        <PlanetArchive />
      </motion.div>
    </section>
  );
};

export default DashboardView;
