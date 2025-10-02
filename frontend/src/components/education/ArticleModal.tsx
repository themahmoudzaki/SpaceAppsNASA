import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { Article } from '../../types';
import { XMarkIcon } from '../IconComponents';

interface ArticleModalProps {
  article: Article;
  onClose: () => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.2 } },
};

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
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
        className="bg-[var(--primary-surface)] w-full max-w-2xl max-h-[90vh] rounded-2xl border border-[var(--border-color)] shadow-2xl lavender-shadow flex flex-col overflow-hidden"
        variants={modalVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
            <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/50 rounded-full p-2">
                <XMarkIcon className="w-6 h-6"/>
            </button>
        </div>
        
        <div className="p-8 overflow-y-auto">
            <h2 className="font-orbitron text-3xl font-bold text-white">{article.title}</h2>
            <p className="font-inter text-[var(--text-muted)] mt-6 whitespace-pre-line leading-relaxed">
                {article.content}
            </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleModal;