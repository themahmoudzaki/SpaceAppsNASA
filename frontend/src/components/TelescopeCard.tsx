import React from 'react';
import type { Telescope } from '../types';

interface TelescopeCardProps {
  telescope: Telescope;
}

const TelescopeCard: React.FC<TelescopeCardProps> = ({ telescope }) => {
  return (
    <div className="card-flip-container h-[450px]">
      <div className="card-flipper relative">
        {/* Front of the card */}
        <div className="card-front bg-[var(--secondary-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden flex flex-col">
          <img src={telescope.image} alt={telescope.name} className="w-full h-48 object-cover" />
          <div className="p-6 flex-grow flex flex-col justify-center text-center">
            <h3 className="font-orbitron text-2xl font-bold text-white">{telescope.name}</h3>
            <p className="font-inter text-[var(--text-muted)] mt-2 text-sm">{telescope.description}</p>
          </div>
          <div className="p-4 text-center text-xs text-[var(--accent-purple)] font-semibold">Hover for Mission Details</div>
        </div>

        {/* Back of the card */}
        <div className="card-back bg-[var(--primary-surface)] rounded-2xl border border-[var(--border-color)] p-6 flex flex-col justify-between">
          <div>
            <h4 className="font-orbitron text-xl font-bold text-[var(--accent-lavender)]">Mission Briefing</h4>
            <p className="font-inter text-[var(--text-muted)] mt-3 text-sm">{telescope.mission}</p>
          </div>
          <div>
            <h5 className="font-orbitron font-bold text-white mt-4">Primary Method</h5>
            <p className="font-inter text-[var(--accent-purple)] text-sm">{telescope.discoveryMethod}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelescopeCard;