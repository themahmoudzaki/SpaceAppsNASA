import React, { useState, useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Exoplanet } from '../../types';

interface InteractiveScatterPlotProps {
    planets: Exoplanet[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--primary-surface)]/80 backdrop-blur-sm p-3 border border-[var(--border-color)] rounded-md text-sm">
          <p className="font-bold text-[var(--text-light)]">{data.name}</p>
          <p className="text-[var(--accent-lavender)]">{`Period: ${data.orbitalPeriod} days`}</p>
          <p className="text-[var(--accent-lavender)]">{`Radius: ${data.radius}x Earth`}</p>
          <p className="text-[var(--text-muted)]">{`Method: ${data.discoveryMethod}`}</p>
        </div>
      );
    }
    return null;
};

const InteractiveScatterPlot: React.FC<InteractiveScatterPlotProps> = ({ planets }) => {
    const [methodFilter, setMethodFilter] = useState<'all' | 'Transit' | 'Radial Velocity'>('all');
    const [sizeFilter, setSizeFilter] = useState<[number, number]>([0, 20]);

    const filteredPlanets = useMemo(() => {
        return planets.filter(p => 
            (methodFilter === 'all' || p.discoveryMethod === methodFilter) &&
            (p.radius >= sizeFilter[0] && p.radius <= sizeFilter[1])
        );
    }, [planets, methodFilter, sizeFilter]);

    const dataByMethod = {
        'Transit': filteredPlanets.filter(p => p.discoveryMethod === 'Transit'),
        'Radial Velocity': filteredPlanets.filter(p => p.discoveryMethod === 'Radial Velocity'),
        'Other': filteredPlanets.filter(p => p.discoveryMethod === 'Other'),
    };
    
    return (
        <div>
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <div>
                    <label className="text-sm text-[var(--text-muted)] block mb-1">Discovery Method</label>
                    <select 
                        value={methodFilter}
                        onChange={e => setMethodFilter(e.target.value as any)}
                        className="w-full bg-black/30 border border-[var(--border-color)] rounded-md p-2"
                    >
                        <option value="all">All</option>
                        <option value="Transit">Transit</option>
                        <option value="Radial Velocity">Radial Velocity</option>
                    </select>
                </div>
                <div className="flex-grow">
                    <label className="text-sm text-[var(--text-muted)] block mb-1">Planet Size (Earth Radii): {sizeFilter[1] === 20 ? '0 - 20+' : `${sizeFilter[0]} - ${sizeFilter[1]}`}</label>
                    <input 
                        type="range" 
                        min="0" max="20" step="1"
                        value={sizeFilter[1]}
                        onChange={e => setSizeFilter([0, Number(e.target.value)])}
                        className="w-full" 
                    />
                </div>
            </div>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid stroke="var(--border-color)" />
                        <XAxis 
                            type="number" dataKey="orbitalPeriod" name="Orbital Period" unit=" days" 
                            stroke="var(--text-muted)" tick={{ fontSize: 12 }} scale="log" domain={['dataMin', 'dataMax']}
                            label={{ value: 'Orbital Period (days, log scale)', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)', fontSize: 12 }}
                        />
                        <YAxis 
                            type="number" dataKey="radius" name="Radius" unit="x Earth" 
                            stroke="var(--text-muted)" tick={{ fontSize: 12 }}
                            label={{ value: 'Radius (xEarth)', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)', fontSize: 12, dx: 10 }}
                        />
                        <ZAxis type="number" dataKey="radius" range={[20, 200]} name="size" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Scatter name="Transit" data={dataByMethod['Transit']} fill="#8884d8" shape="circle" />
                        <Scatter name="Radial Velocity" data={dataByMethod['Radial Velocity']} fill="#82ca9d" shape="triangle" />
                        <Scatter name="Other" data={dataByMethod['Other']} fill="#ffc658" shape="star" />
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default InteractiveScatterPlot;