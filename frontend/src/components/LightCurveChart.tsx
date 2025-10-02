
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { LightCurveDataPoint } from '../types';

interface LightCurveChartProps {
  data: LightCurveDataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800/80 backdrop-blur-sm p-2 border border-slate-600 rounded-md text-sm">
          <p className="text-gray-300">{`Time: ${payload[0].payload.time}`}</p>
          <p className="text-[#00F5D4]">{`Flux: ${payload[0].value.toFixed(5)}`}</p>
        </div>
      );
    }
  
    return null;
  };

const LightCurveChart: React.FC<LightCurveChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64 md:h-80 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            label={{ value: 'Time (Observation Day)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }} 
          />
          <YAxis 
            stroke="#94a3b8" 
            domain={['dataMin - 0.005', 'dataMax + 0.005']} 
            allowDataOverflow 
            tick={{ fontSize: 12 }} 
            label={{ value: 'Relative Flux', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12, dx: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="flux" stroke="#00F5D4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LightCurveChart;
