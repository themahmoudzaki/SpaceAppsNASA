import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LightCurveChart from '../LightCurveChart';
import type { LightCurveDataPoint } from '../../types';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '../IconComponents';

const generateTransitData = (): LightCurveDataPoint[] => {
    const data: LightCurveDataPoint[] = [];
    const period = 5 + Math.random() * 5;
    const transitDepth = 0.01 + Math.random() * 0.02;
    const transitDuration = 0.2 + Math.random() * 0.2;

    for (let i = 0; i < 20; i += 0.05) {
        let flux = 1.0 + (Math.random() - 0.5) * 0.002;
        const timeInPeriod = i % period;
        if (timeInPeriod > period / 2 - transitDuration / 2 && timeInPeriod < period / 2 + transitDuration / 2) {
            flux -= transitDepth;
        }
        data.push({ time: i, flux });
    }
    return data;
};

const generateNoiseData = (): LightCurveDataPoint[] => {
    const data: LightCurveDataPoint[] = [];
    for (let i = 0; i < 20; i += 0.05) {
        data.push({ time: i, flux: 1.0 + (Math.random() - 0.5) * 0.015 });
    }
    return data;
};

const TransitDetectiveGame = () => {
    const [data, setData] = useState<LightCurveDataPoint[]>([]);
    const [isPlanet, setIsPlanet] = useState(false);
    const [choice, setChoice] = useState<'planet' | 'noise' | null>(null);

    const generateNewCase = () => {
        setChoice(null);
        const isPlanetSignal = Math.random() > 0.5;
        setIsPlanet(isPlanetSignal);
        setData(isPlanetSignal ? generateTransitData() : generateNoiseData());
    };

    useEffect(() => {
        generateNewCase();
    }, []);

    const result = choice ? (choice === 'planet' && isPlanet) || (choice === 'noise' && !isPlanet) : null;

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex-grow">
                <LightCurveChart data={data} />
            </div>
            <div className="mt-4">
                {choice === null ? (
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setChoice('planet')} className="w-full bg-green-600/50 hover:bg-green-600 font-bold py-3 rounded-lg transition-colors">Planet</button>
                        <button onClick={() => setChoice('noise')} className="w-full bg-red-600/50 hover:bg-red-600 font-bold py-3 rounded-lg transition-colors">Noise</button>
                    </div>
                ) : (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center p-2 rounded-lg"
                        >
                            {result ? (
                                <div className="flex items-center justify-center text-green-400">
                                    <CheckCircleIcon className="w-6 h-6 mr-2" />
                                    <p className="font-bold">Correct! {isPlanet ? "This was a clear transit signal." : "This was just random noise."}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center text-red-400">
                                    <XCircleIcon className="w-6 h-6 mr-2" />
                                    <p className="font-bold">Incorrect. {isPlanet ? "This was a real transit!" : "This was only noise."}</p>
                                </div>
                            )}
                            <button onClick={generateNewCase} className="w-full bg-[var(--accent-purple)] hover:bg-[var(--accent-lavender)] hover:text-black font-bold py-2 rounded-lg transition-colors mt-3 flex items-center justify-center gap-2">
                                <ArrowPathIcon className="w-5 h-5" /> New Case File
                            </button>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default TransitDetectiveGame;