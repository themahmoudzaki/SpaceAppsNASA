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
