import type { LightCurveDataPoint, Exoplanet } from '../types';

// ===================================================================================
// NOTE FOR BACKEND DEVELOPER
// ===================================================================================
// This file contains mock functions that simulate calls to our custom AI/ML model.
// Your task is to replace the mock logic within each function with actual `fetch`
// calls to the backend API endpoints you will create.
//
// Each function is designed to match the expected request/response structure.
// The frontend expects the API to return JSON with the exact interfaces defined here
// (e.g., `ClassificationResponse`, `CandidateResponse`).
//
// API Endpoint Suggestions:
// - `classifyLightCurve` -> POST /api/classify-light-curve
// - `checkExoplanetCandidate` -> POST /api/check-candidate
// - `generateExoplanetDetails` -> POST /api/generate-details
// ===================================================================================


//const API_BASE_URL = '/api'; // Replace with your actual API base URL if different
const MOCK_API_DELAY = 1000; // Simulate network latency for mock calls

// --- Interface for Light Curve Classification ---
interface ClassificationResponse {
  isPlanet: boolean;
  confidence: number;
  reasoning: string;
  nameSuggestion?: string;
}

/**
 * Analyzes stellar light curve data to identify exoplanet transits.
 * @param data - An array of light curve data points.
 * @returns A promise that resolves to a classification object.
 */
export const classifyLightCurve = async (_data: LightCurveDataPoint[]): Promise<ClassificationResponse> => {
  // BACKEND TODO: Replace this mock implementation with a real API call.
  // Example:
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/classify-light-curve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lightCurve: data }),
    });
    if (!response.ok) {
      throw new Error('AI model failed to process the request.');
    }
    return await response.json() as ClassificationResponse;
  } catch (error) {
    console.error("Error classifying light curve with custom AI:", error);
    // Return a fallback response
    return {
      isPlanet: false,
      confidence: 0.5,
      reasoning: "AI analysis failed. Unable to classify signal.",
    };
  }
  */

  // --- MOCK IMPLEMENTATION ---
  console.log("MOCK: AI classification for light curve...");
  await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));

  const isPlanet = Math.random() > 0.4; // 60% chance of being a planet
  if (isPlanet) {
    return {
      isPlanet: true,
      confidence: Math.random() * 0.1 + 0.9, // 90-100% confidence
      reasoning: "A clear, periodic U-shaped dip was detected, consistent with a planetary transit.",
      nameSuggestion: `Xylos-${Math.floor(Math.random() * 1000)}b`
    };
  } else {
    return {
      isPlanet: false,
      confidence: Math.random() * 0.2 + 0.8, // 80-100% confidence
      reasoning: "The data shows random fluctuations and lacks a repeating pattern."
    };
  }
};

// --- Interfaces for Exoplanet Candidate Check ---
export interface CandidateData {
    period: number;
    duration: number;
    depth: number;
    planetRadius: number;
    semiMajorAxis: number;
    starRadius: number;
    teff: number;
    logg: number;
    source: 'Kepler' | 'TESS';
}

export interface CandidateResponse {
    disposition: 'CONFIRMED' | 'FALSE POSITIVE';
    confidence: number;
    reasoning: string;
}

/**
 * Classifies a celestial object based on observational data.
 * @param data - The candidate object's data.
 * @returns A promise that resolves to a disposition object.
 */
export const checkExoplanetCandidate = async (data: CandidateData): Promise<CandidateResponse> => {
    // BACKEND TODO: Replace this mock implementation with a real API call.
    // Example:
    /*
    const response = await fetch(`${API_BASE_URL}/check-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("AI model failed to process the request.");
    }
    return await response.json() as CandidateResponse;
    */

    // --- MOCK IMPLEMENTATION ---
    console.log("MOCK: AI classification for candidate data...");
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    // Simple mock logic: higher planet radius and depth -> more likely to be confirmed
    const score = (data.planetRadius / 25) + (data.depth / 50000);
    const isConfirmed = score > 0.3 && data.duration < 20;

    if (isConfirmed) {
        return {
            disposition: 'CONFIRMED',
            confidence: Math.random() * 0.1 + 0.88, // 88-98%
            reasoning: "The transit depth and duration are consistent with a planetary body orbiting a star of this type."
        };
    } else {
        return {
            disposition: 'FALSE POSITIVE',
            confidence: Math.random() * 0.15 + 0.85, // 85-100%
            reasoning: "The observed parameters suggest an eclipsing binary or stellar activity rather than a planetary transit."
        };
    }
}


// --- Utility and Interface for Generating Planet Details ---
const generateRandomGradient = () => {
    const randomHue = () => Math.floor(Math.random() * 360);
    const h1 = randomHue();
    const h2 = (h1 + Math.floor(Math.random() * 120) + 30) % 360;
    const color1 = `hsl(${h1}, 70%, 50%)`;
    const color2 = `hsl(${h2}, 60%, 30%)`;
    return `radial-gradient(circle, ${color1}, ${color2})`;
};

/**
 * Generates plausible and creative details for a newly discovered exoplanet.
 * @param name - The name of the new exoplanet.
 * @returns A promise that resolves to an object with planet details.
 */
export const generateExoplanetDetails = async (name: string): Promise<Omit<Exoplanet, 'id' | 'confidence' | 'tag'>> => {
    // BACKEND TODO: Replace this mock implementation. This could be another model call
    // or a procedural generation algorithm on your backend.
    // Example:
    /*
    const response = await fetch(`${API_BASE_URL}/generate-details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        // Handle error, maybe return a fallback object
        throw new Error('Could not generate planet details.');
    }
    const details = await response.json();
    return {
        ...details,
        name,
        image: `https://picsum.photos/seed/${name}/512`, // Or get image from backend
        visualization: { gradient: generateRandomGradient() }
    };
    */
    
    // --- MOCK IMPLEMENTATION ---
    console.log(`MOCK: Generating details for ${name}...`);
    await new Promise(resolve => setTimeout(resolve, MOCK_API_DELAY));
    
    // Fallback in case of an error
    const fallback = {
        name,
        description: "Data transmission from deep space was corrupted. Further analysis is required to learn more about this mysterious world.",
        orbitalPeriod: parseFloat((Math.random() * 490 + 10).toFixed(1)),
        radius: parseFloat((Math.random() * 14.2 + 0.8).toFixed(2)),
        image: `https://picsum.photos/seed/${name}/512`,
        visualization: { gradient: generateRandomGradient() },
        discoveryMethod: 'Transit' as const,
    };

    try {
        const details = {
            description: `A newly discovered world, ${name} shows promise with its unique orbital characteristics. Initial scans suggest it could be a gas giant orbiting a G-type star.`,
            orbitalPeriod: parseFloat((Math.random() * 490 + 10).toFixed(1)),
            radius: parseFloat((Math.random() * 14.2 + 0.8).toFixed(2)),
            discoveryMethod: 'Transit' as const
        };
        
        return {
            name,
            ...details,
            image: `https://picsum.photos/seed/${name}/512`,
            visualization: { gradient: generateRandomGradient() }
        };

    } catch (error) {
        console.error("Error generating planet details (mock):", error);
        return fallback;
    }
};
