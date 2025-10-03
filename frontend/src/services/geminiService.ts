import type { LightCurveDataPoint } from '../types';

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
  transitSignalStrength: number; // <-- Add this line!
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
export const checkExoplanetCandidate = async (data: CandidateData, setConfidence: React.Dispatch<React.SetStateAction<string | null>>
): Promise<CandidateResponse> => {
  try {
    // Map camelCase (frontend) to snake_case (backend)
    const payload = {
      period: data.period,
      duration: data.duration,
      depth: data.depth,
      planet_radius: data.planetRadius,
      semi_major_axis: data.semiMajorAxis,
      star_radius: data.starRadius,
      teff: data.teff,
      transit_signal_strength: data.transitSignalStrength
    };

    const response = await fetch('http://127.0.0.1:8000/predict/public/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), // Send as a single object!
    });

    if (!response.ok) {
      throw new Error("AI model failed to process the request.");
    }
    const result = await response.json();
    setConfidence(`${result.confidence}`);
    return {
      disposition: result.predictions?.[0] === "CONFIRMED" ? "CONFIRMED" : "FALSE POSITIVE",
      confidence: result.confidence?.[0] ?? 0,
      reasoning: "AI backend result"
    };
  } catch (error) {
    console.error("Error classifying candidate:", error);
    return {
      disposition: 'FALSE POSITIVE',
      confidence: 0,
      reasoning: "AI analysis failed. Unable to classify signal.",
    };
  }
};