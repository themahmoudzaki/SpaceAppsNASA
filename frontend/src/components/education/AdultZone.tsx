import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMockData } from '../../hooks/useMockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const discoveryData = [
    { year: 2014, count: 879 }, { year: 2015, count: 219 }, { year: 2016, count: 1538 },
    { year: 2017, count: 154 }, { year: 2018, count: 351 }, { year: 2019, count: 181 },
    { year: 2020, count: 260 }, { year: 2021, count: 332 }, { year: 2022, count: 301 },
    { year: 2023, count: 247 }, { year: 2024, count: 150 },
];

interface AdultZoneProps {
    onArticleSelect: (articleId: string) => void;
}

const ChevronDownIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const AccordionItem: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[var(--border-color)] last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-lg text-[var(--text-light)] hover:bg-white/5 transition-colors"
                aria-expanded={isOpen}
            >
                <span className="flex-1 pr-4">{title}</span>
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDownIcon className="w-6 h-6 text-[var(--text-muted)]" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto' },
                            collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <p className="p-5 pt-0 text-[var(--text-muted)] leading-relaxed">{content}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const advancedTopics = [
    {
        title: "Stellar Characterization: Know the Star, Know the Planet",
        content: "An exoplanet's properties are all relative to its host star. A planet's size is determined by how much light it blocks during a transit, which is a ratio of its size to the star's. Its mass is found by the 'wobble' it induces in the star. Therefore, accurately measuring the star's mass, radius, and temperature is the critical first step in understanding any world orbiting it."
    },
    {
        title: "Detection Biases: What We Can and Can't See",
        content: "Our methods have inherent biases. The Transit Method is more likely to find large planets orbiting close to small stars. The Radial Velocity method is more sensitive to massive planets orbiting close to their stars. This means the thousands of planets we've found might not represent the true diversity of the galaxy, but rather the 'low-hanging fruit' that our current technology can easily detect."
    },
    {
        title: "Atmospheric Spectroscopy: Reading Alien Atmospheres",
        content: "Using powerful telescopes like the James Webb Space Telescope (JWST), scientists can analyze the starlight that passes through an exoplanet's atmosphere during a transit. Different molecules (like water, methane, or CO2) absorb specific wavelengths of light, leaving a unique chemical 'fingerprint'. This technique, called transmission spectroscopy, is our best tool for searching for biosignatures—signs of life—on other worlds."
    }
];


const AdultZone: React.FC<AdultZoneProps> = ({ onArticleSelect }) => {
    const { dashboardData, initialPlanets, articles } = useMockData();
    const spotlightPlanet = initialPlanets[1]; // TRAPPIST-1e

    return (
        <div>
            <h1 className="font-orbitron text-4xl sm:text-6xl font-bold text-white mb-4">Adult Zone: The Frontier of Astronomy</h1>
            <p className="text-lg text-[var(--text-muted)] mb-12 max-w-3xl">
                Explore in-depth articles on the latest discoveries, analyze historical data trends, and get a closer look at some of the most significant exoplanets found to date.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Articles & Dashboard */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Articles Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-4">Recent Discoveries</h2>
                        <div className="space-y-4">
                            {articles.map(article => (
                                <motion.div 
                                    key={article.id}
                                    className="bg-[var(--secondary-surface)] p-4 rounded-lg border border-[var(--border-color)] flex items-center gap-4 cursor-pointer"
                                    whileHover={{ scale: 1.02, boxShadow: "0 5px 15px var(--shadow-color)"}}
                                    onClick={() => onArticleSelect(article.id)}
                                >
                                    <img src={article.image} className="w-16 h-16 rounded-md object-cover" alt={article.title}/>
                                    <div>
                                        <h3 className="font-bold text-lg text-[var(--text-light)]">{article.title}</h3>
                                        <p className="text-sm text-[var(--text-muted)]">{article.summary}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                    
                    {/* Data Dashboard */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                         viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-4">Discoveries By Year</h2>
                        <div className="bg-[var(--primary-surface)] p-4 rounded-lg border border-[var(--border-color)] h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={discoveryData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                    <XAxis dataKey="year" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                                    <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--primary-surface)', border: `1px solid var(--border-color)`}} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                    <Line type="monotone" dataKey="count" name="Exoplanets Found" stroke="var(--accent-purple)" strokeWidth={2} dot={{ r: 4, fill: 'var(--accent-purple)' }} activeDot={{ r: 6 }}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
                
                {/* Sidebar: Counter & Spotlight */}
                <div className="space-y-8">
                    <motion.div 
                        className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)] text-center"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                         viewport={{ once: true, amount: 0.2 }}
                    >
                        <h3 className="text-lg text-[var(--text-muted)]">Currently Known Exoplanets</h3>
                        <p className="font-orbitron text-5xl font-bold text-white my-2">{dashboardData.exoplanetsDetected.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">(Source: NASA Exoplanet Archive)</p>
                    </motion.div>
                    
                    <motion.div 
                        className="bg-[var(--primary-surface)] p-6 rounded-2xl border border-[var(--border-color)]"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                         viewport={{ once: true, amount: 0.2 }}
                    >
                        <h2 className="font-orbitron text-2xl font-bold text-[var(--accent-lavender)] mb-4">Exoplanet of the Month</h2>
                        <img src={spotlightPlanet.image} className="w-full rounded-lg" alt="Spotlight planet"/>
                        <h3 className="font-bold text-xl mt-4">{spotlightPlanet.name}</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-2">{spotlightPlanet.description}</p>
                    </motion.div>
                </div>
            </div>

            <motion.div
                className="mt-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true, amount: 0.2 }}
            >
                <h2 className="font-orbitron text-3xl font-bold text-[var(--accent-lavender)] mb-6 text-center">Advanced Topics</h2>
                <div className="max-w-4xl mx-auto bg-[var(--primary-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    {advancedTopics.map((topic, index) => (
                        <AccordionItem key={index} title={topic.title} content={topic.content} />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}

export default AdultZone;