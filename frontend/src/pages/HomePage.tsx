import React from 'react';
import type { Exoplanet, Page } from '../types';

import HeroView from '../views/HeroView';
import ChallengeView from '../views/ChallengeView';
import ProjectInfoView from '../views/ProjectInfoView';
import DashboardView from '../views/DashboardView';
import GalleryView from '../views/GalleryView';
import EducationView from '../views/EducationView';


interface HomePageProps {
    navigate: (page: Page, level?: 'kids' | 'teens' | 'adults') => void;
    onPlanetSelect: (planet: Exoplanet) => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigate, onPlanetSelect }) => {
    return (
        <>
            <div className="relative">
                <div className="h-[200vh]">
                    <div className="sticky top-0 h-screen w-full">
                        <video
                            aria-hidden="true"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover z-0"
                        >
                            <source src="/cover-background.webm" type="video/webm" />
                            <source src="/cover-background.mp4" type="video/mp4" />
                        </video>
                         <div className="absolute inset-0 bg-gradient-to-t from-[var(--background-end)] via-[var(--background-end)]/40 to-transparent z-10"></div>
                    </div>
                </div>

                <div className="absolute top-0 left-0 w-full">
                    <HeroView />
                    <ChallengeView />
                </div>
            </div>

            <div className="relative z-10 bg-[var(--background-end)]">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <ProjectInfoView />
                  <DashboardView navigate={navigate} />
                  <GalleryView navigate={navigate} onPlanetSelect={onPlanetSelect} />
                  <EducationView navigate={navigate} />
              </div>
            </div>
        </>
    );
};

export default HomePage;