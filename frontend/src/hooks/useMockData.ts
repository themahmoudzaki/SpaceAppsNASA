import type { Exoplanet, QuizQuestion, Article } from '../types';

const initialPlanets: Exoplanet[] = [
  {
    id: "kepler-186f",
    name: "Kepler-186f",
    tag: "Confirmed",
    orbitalPeriod: 129.9,
    radius: 1.17,
    confidence: 0.98,
    description: "The first Earth-sized planet discovered in the habitable zone of another star. It orbits a red dwarf star about 500 light-years away.",
    image: "public/planets/kepler186f.png",
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
    image: "public/planets/trappist1e.png",
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
    image: "public/planets/proxima_cen_b.jpg",
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
    image: "public/planets/HD_189733b.jpg",
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
    image: "public/planets/Kepler-16b_thumbnail.jpg",
    visualization: { gradient: 'radial-gradient(circle, #ffb347, #ffcc33)' },
    discoveryMethod: 'Transit',
  },
];

const dashboardData = {
  exoplanetsDetected: 5189,
  candidatesPending: 4713,
  modelAccuracy: 98.7,
  performanceMetrics: {
    precision: 0.99,
    recall: 0.98,
    f1Score: 0.985,
  },
  confusionMatrix: {
    truePositive: 2150,
    falsePositive: 22,
    trueNegative: 15890,
    falseNegative: 45,
  },
  lightCurvesProcessed: "1.2M+",
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
        image: "https://i.ibb.co/sKk77w2/planet-4.png"
    },
    {
        id: "super-earth",
        title: "A New 'Super-Earth' Found in the Habitable Zone",
        summary: "TESS mission data reveals a rocky world, Wolf 1069 b, that could potentially harbor liquid water...",
        content: "Data from NASA's Transiting Exoplanet Survey Satellite (TESS) has led to the discovery of Wolf 1069 b, a rocky 'super-Earth' located just 31 light-years away. This planet orbits its red dwarf star within the habitable zone, making it a prime candidate in the search for life. With a mass about 1.26 times that of Earth, scientists are eager to conduct follow-up observations to determine if it has an atmosphere and what its composition might be.",
        image: "https://i.ibb.co/Y0Yd3f1/planet-3.png"
    },
    {
        id: "tatooine-planet",
        title: "The Reality of a 'Tatooine' Planet with Two Suns",
        summary: "Kepler-16b was the first circumbinary planet discovered, confirming that worlds can indeed orbit two stars.",
        content: "Reminiscent of the famous Star Wars planet, Kepler-16b provided the first conclusive evidence of a circumbinary planet—a world that orbits two stars. Discovered by the Kepler Space Telescope, this gas giant is roughly the size of Saturn. While its cold temperatures make it uninhabitable, its discovery proved that planetary systems can form and remain stable in the complex gravitational environment of a binary star system, opening up a new frontier for exoplanet hunters.",
        image: "https://i.ibb.co/nLg992S/planet-5.png"
    }
];


export const useMockData = () => {
  return { initialPlanets, dashboardData, quizQuestions, articles };
};
