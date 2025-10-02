import React from 'react';
import type { Page, Exoplanet } from '../types';
import KidsZone from '../components/education/KidsZone';
import TeenZone from '../components/education/TeenZone';
import AdultZone from '../components/education/AdultZone';

interface EducationPageProps {
    navigate: (page: Page) => void;
    level: 'kids' | 'teens' | 'adults';
    onPlanetSelect: (planet: Exoplanet) => void;
    onArticleSelect: (articleId: string) => void;
}

const EducationPage: React.FC<EducationPageProps> = ({ navigate, level, onPlanetSelect, onArticleSelect }) => {
    
    const renderContent = () => {
        switch(level) {
            case 'kids':
                return <KidsZone />;
            case 'teens':
                return <TeenZone onPlanetSelect={onPlanetSelect} />;
            case 'adults':
                return <AdultZone onArticleSelect={onArticleSelect} />;
            default:
                return <KidsZone />;
        }
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => navigate('home')} className="mb-8 text-[var(--accent-purple)] hover:text-[var(--text-light)] transition-colors font-semibold">
                    &larr; Back to Main Page
                </button>

                {renderContent()}
            </div>
        </div>
    );
};

export default EducationPage;