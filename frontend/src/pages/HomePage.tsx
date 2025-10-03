import React from 'react';
import type { Exoplanet, Page } from '../types';

import HeroView from '../views/HeroView';
import ChallengeView from '../views/ChallengeView';
import ProjectInfoView from '../views/ProjectInfoView';
import DashboardView from '../views/DashboardView';
import GalleryView from '../views/GalleryView';
import EducationView from '../views/EducationView';
import ObservatoryView from '../views/ObservatoryView';
import AiDeepDiveView from '../views/AiDeepDiveView';
import CommunityDiscoveriesView from '../views/CommunityDiscoveriesView';


interface HomePageProps {
    navigate: (page: Page, level?: 'kids' | 'teens' | 'adults') => void;
    onPlanetSelect: (planet: Exoplanet) => void;
    discoveredPlanets: Exoplanet[];
}

const HomePage: React.FC<HomePageProps> = ({ navigate, onPlanetSelect, discoveredPlanets }) => {
    return (
        <>
            {/* Section with the scrolling video background */}
            <div className="relative">
                <div className="absolute inset-0 z-[-1]">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/cover-background.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <HeroView />
                <ChallengeView />
                
                {/* This gradient creates the seamless transition. Increased height for a smoother fade. */}
                <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[var(--background-end)] to-transparent" />
            </div>
            
            {/* The rest of the page content */}
            <div className="relative bg-[var(--background-end)]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <ProjectInfoView />
                    <ObservatoryView />
                    <DashboardView navigate={navigate} />
                    <AiDeepDiveView />
                    <CommunityDiscoveriesView />
                    <GalleryView navigate={navigate} onPlanetSelect={onPlanetSelect} discoveredPlanetIds={discoveredPlanets.map(p => p.id)} />
                    <EducationView navigate={navigate} />
                </div>
            </div>
        </>
    );
};

export default HomePage;
