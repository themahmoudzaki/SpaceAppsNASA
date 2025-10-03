import React from 'react';
import { motion } from 'framer-motion';
import type {Variants } from 'framer-motion';
import { useMockData } from '../hooks/useMockData';
import DiscoveryCard from '../components/DiscoveryCard';

const marqueeVariants: Variants = {
    animate: {
        x: [0, -1760], // Total width of 5 cards (320px width + 32px margin)
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40, 
                ease: "linear",
            },
        },
    },
};

const CommunityDiscoveriesView: React.FC = () => {
    const { communityDiscoveries } = useMockData();
    // Duplicate the array to create a seamless loop
    const discoveries = [...communityDiscoveries, ...communityDiscoveries];

    return (
        <section id="community-discoveries" className="py-20 sm:py-32 overflow-hidden">
            <motion.h2 
                className="font-orbitron text-3xl sm:text-5xl font-bold text-center mb-16 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                Community Discoveries
            </motion.h2>
            
            <div className="relative w-full">
                <motion.div
                    className="flex"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {discoveries.map((discovery, index) => (
                        <DiscoveryCard key={`${discovery.id}-${index}`} discovery={discovery} />
                    ))}
                </motion.div>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--background-end)] to-transparent"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background-end)] to-transparent"></div>
            </div>
        </section>
    );
};

export default CommunityDiscoveriesView;