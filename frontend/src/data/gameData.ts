import type { GameLevel } from '../types';

// Data transcribed from user's Excel screenshot and generated for the game
export const gameLevels: GameLevel[] = [
  // 11 Confirmed Planets
  {
    features: { period: 13.60, duration: 2.98, depth: 1100, planet_radius: 2.59, star_radius: 0.67, teff: 4684, logg: 4.62, semi_major_axis: 0.098, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-212737443-b'
  },
  {
    features: { period: 65.55, duration: 4.61, depth: 1100, planet_radius: 2.69, star_radius: 0.67, teff: 4684, logg: 4.62, semi_major_axis: 0.28, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-212737443-c'
  },
  {
    features: { period: 0.57, duration: 1.54, depth: 241, planet_radius: 1.68, star_radius: 0.99, teff: 5578, logg: 4.41, semi_major_axis: 0.013, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-220674823-b'
  },
  {
    features: { period: 13.34, duration: 3.66, depth: 693, planet_radius: 2.84, star_radius: 0.99, teff: 5578, logg: 4.41, semi_major_axis: 0.107, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-220674823-c'
  },
  {
    features: { period: 6.18, duration: 4.11, depth: 4640, planet_radius: 11.78, star_radius: 1.59, teff: 6202, logg: 4.16, semi_major_axis: 0.072, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-246851721-b'
  },
  {
    features: { period: 3650, duration: 53.6, depth: 1800, planet_radius: 12.44, star_radius: 2.7, teff: 4898, logg: 3.52, semi_major_axis: 4.5, source: 'K2' },
    isPlanet: true,
    planetId: 'epic-248847494-b'
  },
  {
    features: { period: 5.75, duration: 1.34, depth: 3650, planet_radius: 2.03, star_radius: 0.31, teff: 3348, logg: 4.93, semi_major_axis: 0.0385, source: 'K2' },
    isPlanet: true,
    planetId: 'g-9-40-b'
  },
  {
    features: { period: 1.21, duration: 1.26, depth: 586, planet_radius: 1.62, star_radius: 0.61, teff: 4269, logg: 4.65, semi_major_axis: 0.0189, source: 'K2' },
    isPlanet: true,
    planetId: 'gj-9827-b'
  },
  {
    features: { period: 3.65, duration: 1.83, depth: 361, planet_radius: 1.27, star_radius: 0.61, teff: 4269, logg: 4.65, semi_major_axis: 0.0394, source: 'K2' },
    isPlanet: true,
    planetId: 'gj-9827-c'
  },
  {
    features: { period: 6.20, duration: 1.23, depth: 957, planet_radius: 2.07, star_radius: 0.61, teff: 4269, logg: 4.65, semi_major_axis: 0.0562, source: 'K2' },
    isPlanet: true,
    planetId: 'gj-9827-d'
  },
  { // Kepler-186f from existing mock data
    features: { period: 129.9, duration: 6.0, depth: 150, planet_radius: 1.17, star_radius: 0.52, teff: 3755, logg: 4.7, semi_major_axis: 0.4, source: 'Kepler' },
    isPlanet: true,
    planetId: 'kepler-186f'
  },

  // 9 False Positives
  {
    features: { period: 0.3, duration: 5.0, depth: 25000, planet_radius: 15.0, star_radius: 1.2, teff: 6000, logg: 4.3, semi_major_axis: 0.01, source: 'K2' },
    isPlanet: false, // Very short period, long duration, huge depth -> likely an eclipsing binary star
  },
  {
    features: { period: 25.0, duration: 0.5, depth: 20, planet_radius: 0.5, star_radius: 0.8, teff: 5200, logg: 4.5, semi_major_axis: 0.15, source: 'TESS' },
    isPlanet: false, // Depth is too shallow, duration too short -> likely stellar noise
  },
  {
    features: { period: 150.0, duration: 2.0, depth: 8000, planet_radius: 1.2, star_radius: 0.3, teff: 3400, logg: 4.9, semi_major_axis: 0.4, source: 'Kepler' },
    isPlanet: false, // Planet radius is too small for such a large depth on a small star -> inconsistent
  },
  {
    features: { period: 7.8, duration: 8.0, depth: 900, planet_radius: 3.5, star_radius: 1.0, teff: 5800, logg: 4.4, semi_major_axis: 0.08, source: 'K2' },
    isPlanet: false, // Duration is longer than typical for this period -> likely a starspot
  },
  {
    features: { period: 90.0, duration: 12.0, depth: 100, planet_radius: 22.0, star_radius: 1.5, teff: 6500, logg: 4.0, semi_major_axis: 0.4, source: 'TESS' },
    isPlanet: false, // Planet is impossibly large for such a small depth
  },
  {
    features: { period: 3.2, duration: 1.0, depth: 15000, planet_radius: 1.9, star_radius: 0.9, teff: 5300, logg: 4.6, semi_major_axis: 0.04, source: 'K2' },
    isPlanet: false, // Depth implies a huge object, but radius is small -> contradiction
  },
  {
    features: { period: 45.0, duration: 0.8, depth: 300, planet_radius: 1.8, star_radius: 1.1, teff: 5900, logg: 4.2, semi_major_axis: 0.25, source: 'Kepler' },
    isPlanet: false, // Very short duration for a long period
  },
  {
    features: { period: 1.1, duration: 3.0, depth: 50, planet_radius: 0.8, star_radius: 0.7, teff: 4800, logg: 4.7, semi_major_axis: 0.02, source: 'TESS' },
    isPlanet: false, // Extremely shallow depth, likely instrument noise
  },
  {
    features: { period: 220.0, duration: 20.0, depth: 40000, planet_radius: 18.0, star_radius: 2.5, teff: 4500, logg: 3.8, semi_major_axis: 0.7, source: 'K2' },
    isPlanet: false, // Parameters consistent with a background eclipsing binary
  }
];