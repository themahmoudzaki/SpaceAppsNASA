import type { Exoplanet, QuizQuestion, Article, Telescope, CommunityDiscovery } from '../types';

const initialPlanets: Exoplanet[] = [
  {
    id: "kepler-186f",
    name: "Kepler-186f",
    tag: "Confirmed",
    orbitalPeriod: 129.9,
    radius: 1.17,
    confidence: 0.98,
    description: "The first Earth-sized planet discovered in the habitable zone of another star. It orbits a red dwarf star about 500 light-years away.",
    image: "public/planets/kepler-186f.png",
    visualization: { gradient: 'radial-gradient(circle, #a86f32, #784f1a)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "trappist-1e",
    name: "TRAPPIST-1e",
    tag: "Confirmed",
    orbitalPeriod: 6.1,
    radius: 0.92,
    confidence: 0.99,
    description: "One of seven Earth-sized planets orbiting an ultra-cool dwarf star. It's considered one of the most promising exoplanets for life.",
    image: "public/planets/trappist.png",
    visualization: { gradient: 'radial-gradient(circle, #5b92e5, #3f68a5)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "proxima-b",
    name: "Proxima Centauri b",
    tag: "Confirmed",
    orbitalPeriod: 11.2,
    radius: 1.1,
    confidence: 0.95,
    description: "Our closest exoplanet neighbor, orbiting the star Proxima Centauri just 4.2 light-years away. Its habitability is a subject of intense study.",
    image: "public/planets/Proxima_Centauri_b.png",
    visualization: { gradient: 'radial-gradient(circle, #d9a05b, #a56f2f)' },
    discoveryMethod: 'Radial Velocity',
  },
  {
    id: "hd-189733b",
    name: "HD 189733b",
    tag: "Confirmed",
    orbitalPeriod: 2.2,
    radius: 13.4,
    confidence: 0.99,
    description: "A deep blue 'hot Jupiter' known for its extreme weather, including winds of 8,700 km/h and rain made of molten glass.",
    image: "public/planets/hd 189733 b.png",
    visualization: { gradient: 'radial-gradient(circle, #2a52be, #1a337e)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "kepler-16b",
    name: "Kepler-16b",
    tag: "Confirmed",
    orbitalPeriod: 228.8,
    radius: 8.5,
    confidence: 0.97,
    description: "A real-life 'Tatooine,' this planet orbits two stars. The view from its surface would include a double sunset.",
    image: "public/planets/kepler-16b.png",
    visualization: { gradient: 'radial-gradient(circle, #ffb347, #ffcc33)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "gj-9827-d",
    name: "GJ 9827 d",
    tag: "Confirmed",
    orbitalPeriod: 6.2,
    radius: 2.04,
    confidence: 0.98,
    description: "A Neptune-like, volatile-rich planet with water vapor detected in its atmosphere.",
    image: "public/planets/GJ 9827 d.png",
    visualization: { gradient: 'radial-gradient(circle, #89cff0, #4682b4)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "gj-9827-c",
    name: "GJ 9827 c",
    tag: "Confirmed",
    orbitalPeriod: 3.6,
    radius: 1.29,
    confidence: 0.98,
    description: "A rocky super-Earth with a low mass and a thin volatile envelope.",
    image: "public/planets/GJ 9827 c.png",
    visualization: { gradient: 'radial-gradient(circle, #c2b280, #8a795d)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "gj-9827-b",
    name: "GJ 9827 b",
    tag: "Confirmed",
    orbitalPeriod: 1.2,
    radius: 1.53,
    confidence: 0.98,
    description: "An iron-rich, dense super-Earth.",
    image: "public/planets/GJ 9827 b.png",
    visualization: { gradient: 'radial-gradient(circle, #a9a9a9, #696969)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "g-9-40-b",
    name: "G 9-40 b",
    tag: "Confirmed",
    orbitalPeriod: 6.4,
    radius: 1.57,
    confidence: 0.96,
    description: "A small exoplanet with limited available data.",
    image: "public/planets/G 9-40 b.png",
    visualization: { gradient: 'radial-gradient(circle, #f4a460, #d2691e)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-248847494-b",
    name: "EPIC 248847494 b",
    tag: "Candidate",
    orbitalPeriod: 35.6,
    radius: 9,
    confidence: 0.85,
    description: "Likely a giant planet in a long-period orbit.",
    image: "public/planets/EPIC 248847494 b.png",
    visualization: { gradient: 'radial-gradient(circle, #deb887, #b8860b)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-246851721-b",
    name: "EPIC 246851721 b",
    tag: "Confirmed",
    orbitalPeriod: 3.3,
    radius: 11.2,
    confidence: 0.97,
    description: "A hot-Jupiter-type exoplanet.",
    image: "public/planets/EPIC 246851721 b.png",
    visualization: { gradient: 'radial-gradient(circle, #ff6347, #b22222)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-220674823-c",
    name: "EPIC 220674823 c",
    tag: "Candidate",
    orbitalPeriod: 13.3,
    radius: 1.9,
    confidence: 0.80,
    description: "A possible super-Earth with an unclear validation status.",
    image: "public/planets/EPIC 220674823 c.png",
    visualization: { gradient: 'radial-gradient(circle, #add8e6, #4682b4)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-220674823-b",
    name: "EPIC 220674823 b",
    tag: "Candidate",
    orbitalPeriod: 8.9,
    radius: 1.4,
    confidence: 0.82,
    description: "A super-Earth candidate.",
    image: "public/planets/EPIC 220674823 b.png",
    visualization: { gradient: 'radial-gradient(circle, #90ee90, #2e8b57)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-212737443-c",
    name: "EPIC 212737443 c",
    tag: "Candidate",
    orbitalPeriod: 15,
    radius: 2,
    confidence: 0.75,
    description: "A candidate exoplanet with uncertain size and period.",
    image: "public/planets/EPIC 212737443 c.png",
    visualization: { gradient: 'radial-gradient(circle, #dda0dd, #8a2be2)' },
    discoveryMethod: 'Transit',
  },
  {
    id: "epic-212737443-b",
    name: "EPIC 212737443 b",
    tag: "Confirmed",
    orbitalPeriod: 7.6,
    radius: 1.3,
    confidence: 0.95,
    description: "A confirmed small exoplanet.",
    image: "public/planets/EPIC 212737443 b.png",
    visualization: { gradient: 'radial-gradient(circle, #b0c4de, #483d8b)' },
    discoveryMethod: 'Transit',
  },
];

const dashboardData = {
  exoplanetsDetected: 606,
  candidatesPending: 503,
  modelAccuracy: 70,
  performanceMetrics: {
    precision: 0.64,
    recall: 0.63,
    f1Score: 0.63,
  },
  confusionMatrix: {
    truePositive: 1369,
    falsePositive: 202,
    trueNegative: 1060,
    falseNegative: 174
  },
  lightCurvesProcessed: "2032",
};

const quizQuestions: QuizQuestion[] = [
    {
        question: "What is an exoplanet?",
        options: ["A planet in our Solar System", "A planet outside our Solar System", "A type of star", "A moon"],
        correctAnswer: "A planet outside our Solar System",
        explanation: "Exo' means 'outside,' so an exoplanet is a planet that orbits a star other than our Sun."
    },
    {
        question: "What is the 'Habitable Zone' around a star?",
        options: ["The hottest area", "The coldest area", "The area where water can be liquid", "The area closest to the star"],
        correctAnswer: "The area where water can be liquid",
        explanation: "It's the 'Goldilocks' zone—not too hot, not too cold, but just right for liquid water, which is essential for life as we know it."
    },
    {
        question: "How do scientists find most exoplanets?",
        options: ["By listening with radio telescopes", "By looking for dips in starlight", "By sending robots", "By seeing them with a normal telescope"],
        correctAnswer: "By looking for dips in starlight",
        explanation: "This is called the 'transit method.' When a planet passes in front of its star, it blocks a little bit of light, like a tiny eclipse!"
    }
];

const articles: Article[] = [
    {
        id: "jwst-water",
        title: "JWST Finds Water Vapor on 'Mini-Neptune'",
        summary: "Scientists using the James Webb Space Telescope have detected water vapor in the atmosphere of GJ 1214 b...",
        content: "In a groundbreaking discovery, the James Webb Space Telescope has identified definitive signs of water vapor in the atmosphere of GJ 1214 b, a 'mini-Neptune' exoplanet located 48 light-years away. While the planet is too hot to support life, this finding is a major step forward in our ability to analyze the atmospheres of distant worlds. The presence of water, even on inhospitable planets, helps scientists understand planetary formation and the distribution of key elements across the galaxy.",
        image: "public/jwst-water.png"
    },
    {
        id: "super-earth",
        title: "A New 'Super-Earth' Found in the Habitable Zone",
        summary: "TESS mission data reveals a rocky world, Wolf 1069 b, that could potentially harbor liquid water...",
        content: "Data from NASA's Transiting Exoplanet Survey Satellite (TESS) has led to the discovery of Wolf 1069 b, a rocky 'super-Earth' located just 31 light-years away. This planet orbits its red dwarf star within the habitable zone, making it a prime candidate in the search for life. With a mass about 1.26 times that of Earth, scientists are eager to conduct follow-up observations to determine if it has an atmosphere and what its composition might be.",
        image: "public/super-earth.jpg"
    },
    {
        id: "tatooine-planet",
        title: "The Reality of a 'Tatooine' Planet with Two Suns",
        summary: "Kepler-16b was the first circumbinary planet discovered, confirming that worlds can indeed orbit two stars.",
        content: "Reminiscent of the famous Star Wars planet, Kepler-16b provided the first conclusive evidence of a circumbinary planet—a world that orbits two stars. Discovered by the Kepler Space Telescope, this gas giant is roughly the size of Saturn. While its cold temperatures make it uninhabitable, its discovery proved that planetary systems can form and remain stable in the complex gravitational environment of a binary star system, opening up a new frontier for exoplanet hunters.",
        image: "public/tatooine-planet.webp"
    }
];

const telescopes: Telescope[] = [
    {
        id: "jwst",
        name: "James Webb (JWST)",
        image: "public/jamesWebb.jpg",
        description: "The most powerful space telescope ever built, observing the universe in infrared.",
        mission: "JWST's primary goals are to study the first galaxies, the formation of stars and planets, and to characterize the atmospheres of exoplanets to search for signs of life.",
        discoveryMethod: "Atmospheric Spectroscopy",
    },
    {
        id: "kepler",
        name: "Kepler Space Telescope",
        image: "public/keplerK2.jpg",
        description: "A retired observatory that discovered thousands of exoplanets, revolutionizing the field.",
        mission: "Kepler's mission was to continuously monitor a single patch of sky, observing the brightness of over 150,000 stars to find exoplanets using the transit method. Its data is still being analyzed today.",
        discoveryMethod: "Transit Method",
    },
    {
        id: "tess",
        name: "TESS",
        image: "public/TESS.webp",
        description: "An all-sky survey mission designed to find exoplanets around nearby bright stars.",
        mission: "TESS is scanning nearly the entire sky to find planets transiting the nearest and brightest stars. These promising candidates can then be studied in greater detail by telescopes like JWST.",
        discoveryMethod: "Transit Method",
    }
];

const communityDiscoveries: CommunityDiscovery[] = [
    { id: "cd-1", hunterName: "NovaHunter22", planetName: "Xylos-7b", timestamp: "3 hours ago", planetImage: "public/planets/Xylos-7b.png" },
    { id: "cd-2", hunterName: "CosmicExplorer", planetName: "Aethel-C4", timestamp: "8 hours ago", planetImage: "public/planets/coconuts.png" },
    { id: "cd-3", hunterName: "StarGazer_99", planetName: "GCR-Alpha", timestamp: "1 day ago", planetImage: "public/planets/cancri.png" },
    { id: "cd-4", hunterName: "DeepSkyDiver", planetName: "Kepler-2099d", timestamp: "2 days ago", planetImage: "public/planets/TRAPPIST-1e.png" },
    { id: "cd-5", hunterName: "AstroAlex", planetName: "Zirconia-Prime", timestamp: "2 days ago", planetImage: "public/planets/51-pegasi-b.png" }
];


export const useMockData = () => {
  return { initialPlanets, dashboardData, quizQuestions, articles ,telescopes, communityDiscoveries };
};