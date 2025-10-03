export type Page = 'home' | 'game-instructions' | 'game' | 'education' | 'test-ai';

export interface Exoplanet {
  id: string;
  name: string;
  tag: 'Confirmed' | 'Candidate' | 'False Positive';
  orbitalPeriod: number; // in days
  radius: number; // in Earth radii
  confidence: number; // 0 to 1
  description: string;
  image: string; // URL for the planet's visual representation
  visualization: {
    gradient: string;
  };
  discoveryMethod: 'Transit' | 'Radial Velocity' | 'Other';
}

export interface LightCurveDataPoint {
  time: number;
  flux: number;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface Article {
    id: string;
    title: string;
    summary: string;
    content: string;
    image: string;
}

export interface Telescope {
  id: string;
  name: string;
  image: string;
  description: string;
  mission: string;
  discoveryMethod: string;
}

export interface CommunityDiscovery {
  id: string;
  hunterName: string;
  planetName: string;
  timestamp: string;
  planetImage: string;
}

export interface GameLevel {
  features: {
    period: number;
    duration: number;
    depth: number;
    planet_radius: number;
    star_radius: number;
    teff: number;
    logg: number;
    semi_major_axis: number;
    source: string;
  };
  isPlanet: boolean;
  planetId?: string; // Link to the Exoplanet ID if it's a real one
}