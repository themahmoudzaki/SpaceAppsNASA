import React from 'react';
import type { CommunityDiscovery } from '../types';

interface DiscoveryCardProps {
  discovery: CommunityDiscovery;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ discovery }) => {
  return (
    <div className="flex-shrink-0 w-80 bg-[var(--secondary-surface)] rounded-2xl border border-[var(--border-color)] p-4 flex items-center gap-4 mx-4">
        <img src={discovery.planetImage} alt={discovery.planetName} className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent-purple)]" />
        <div className="flex-grow">
            <h4 className="font-orbitron font-bold text-lg text-white truncate">{discovery.planetName}</h4>
            <p className="text-sm text-[var(--text-muted)]">Discovered by: <span className="text-[var(--accent-lavender)] font-semibold">{discovery.hunterName}</span></p>
            <p className="text-xs text-gray-500 mt-1">{discovery.timestamp}</p>
        </div>
    </div>
  );
};

export default DiscoveryCard;