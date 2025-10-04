import React, { useEffect, useState } from "react";

interface PlanetEntry {
    id: number;
    planet_name: string;
    confidence: number;
}

const PlanetArchive: React.FC = () => {
    const [planets, setPlanets] = useState<PlanetEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlanets = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/exo-planet/");
                if (!response.ok) {
                    throw new Error("Failed to fetch planets");
                }
                const data: PlanetEntry[] = await response.json();

                // 🔽 Sort descending by id
                const sorted = data.sort((a, b) => b.id - a.id);
                setPlanets(sorted);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPlanets();
    }, []);

    if (loading) {
        return <p className="text-[var(--text-muted)] text-center">Loading discoveries...</p>;
    }

    if (error) {
        return <p className="text-red-400 text-center">{error}</p>;
    }

    if (planets.length === 0) {
        return (
            <div className="bg-[var(--secondary-surface)] p-6 rounded-2xl border border-[var(--border-color)] text-center">
                <h2 className="font-orbitron text-2xl font-bold text-white mb-4">
                    Exoplanet Discoveries
                </h2>
                <p className="text-[var(--text-muted)]">No planets discovered yet 🚀</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--secondary-surface)] p-6 rounded-2xl border border-[var(--border-color)]">
            <h2 className="font-orbitron text-2xl font-bold text-white mb-4 text-center">
                Exoplanet Discoveries
            </h2>
            <div className="max-h-96 overflow-y-auto custom-scroll">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-black/40">
                        <tr>
                            <th className="p-3 text-[var(--text-muted)] font-medium">Name</th>
                            <th className="p-3 text-[var(--text-muted)] font-medium">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planets.map((planet) => (
                            <tr key={planet.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 text-white">{planet.planet_name}</td>
                                <td className="p-3 text-[var(--accent-yellow)] font-bold">
                                    {(Number(planet.confidence) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlanetArchive;
