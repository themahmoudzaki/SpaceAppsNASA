import React from 'react';
import { motion} from 'framer-motion';
import type{ Variants } from 'framer-motion';

const infoItems = [
    {
        title: "Our Mission",
        description: "Our mission is to bridge the gap between cutting-edge space science and the public. By combining NASA datasets with powerful AI models, we aim to inspire curiosity, empower learning, and make the discovery of exoplanets accessible to kids, teens, and adults alike."
    },
    {
        title: "Our Solution",
        description: "We developed an end-to-end platform where AI and exploration meet:\n\nAI Model → Trained on multiple NASA datasets to identify exoplanets. Users can input real observational data and see whether the model detects an exoplanet.\n\nInteractive Game → A detective-style adventure where players hunt for new worlds, guided by the same principles used in real science.\n\nEducational Website → Age-tailored content (Kids, Teens, Adults) that explains the science of exoplanets and the role of AI in discovery."
    },
    {
        title: "Our Impact",
        description: "Exo X Hunter transforms exoplanet discovery into a global, hands-on experience.\n\nStudents learn by doing — testing data with AI and exploring space through play.\n\nSpace enthusiasts engage with real scientific tools, not just theory.\n\nThe public gains a deeper understanding of how AI accelerates astronomy and expands humanity’s search for life beyond Earth."
    }
];

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { duration: 0.6, ease: 'easeOut' }
    }
}

const ProjectInfoView: React.FC = () => {
    return (
        <section className="py-20 sm:py-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {infoItems.map((item, index) => (
                    <motion.div 
                        key={index}
                        className="bg-[var(--secondary-surface)] backdrop-blur-sm p-8 rounded-2xl border border-[var(--border-color)] h-full"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        whileHover={{ y: -8, boxShadow: "0 15px 25px -5px var(--shadow-color)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <h3 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)]">{item.title}</h3>
                        <p className="mt-4 text-[var(--text-muted)] font-inter whitespace-pre-line">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ProjectInfoView;