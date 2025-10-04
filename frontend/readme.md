
# Exo X Hunter - Frontend

![Exo X Hunter](./public/game-assets/lets%20hunt.png)

**Exo X Hunter** is the frontend for a comprehensive, AI-powered web application designed for public engagement in exoplanet discovery. This platform blends a real-time AI analysis lab, an interactive discovery game, and a multi-tiered educational hub into a single, immersive experience.

This project was developed for the NASA Space Apps Challenge, addressing the "A World Away" challenge by using AI to make the complex science of exoplanet hunting accessible, transparent, and engaging for everyone.

---

## ✨ Key Features

- **🚀 AI Analysis Lab:** A sandbox environment where users can input custom parameters for a potential exoplanet and receive a real-time classification from the **Google Gemini API**.
- **🎮 Interactive Discovery Game:** A 20-level, detective-themed game where players analyze authentic astronomical data points to classify signals as either a real "exoplanet" or "noise."
- **📚 Dynamic Worlds Archive:** An explorable gallery of known exoplanets, presented as a virtual book. This archive is dynamically updated with the player's successful discoveries from the game.
- **🎓 Multi-Tiered Educational Hub:** Three distinct learning zones with age-appropriate content for Kids (quizzes and fun facts), Teens (interactive data visualizations), and Adults (in-depth articles).
- **📊 AI Mission Control Dashboard:** A data-rich dashboard that transparently displays the performance metrics of the underlying AI model, including accuracy, a confusion matrix, and the total volume of data processed.
- **🔭 The Observatory:** An interactive showcase of the real-life telescopes (JWST, Kepler, TESS) that gather the data used in the app.
- **🌍 Community Discoveries:** A dynamic, auto-scrolling feed that simulates live "discoveries" from other users around the globe to foster a sense of community.

---

## 🛠️ Technology Stack

- **Core Framework:** [React](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration:** 
- **Animation:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Data Visualization:** [Recharts](https://recharts.org/)

---

## 📂 Project Structure

The codebase is organized to be modular and scalable. Key directories inside `src/` include:

```
/src
├── components/   # Reusable components (e.g., Cards, Modals, Charts)
├── data/         # Static data for the game and mock hooks.
├── hooks/        # Custom React hooks (e.g., useMockData).
├── pages/        # Top-level page components for each view of the app.
├── services/     # Modules for external API calls (e.g., geminiService).
├── types.ts      # Global TypeScript type definitions.
└── views/        # Major sections of the HomePage (e.g., Hero, Dashboard, Gallery).
```

---

## 🚀 Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/exo-x-hunter.git
    cd exo-x-hunter
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    -   Create a new file named `.env` in the root of the project.
    -   Add your Google Gemini API key to this file. **The variable must be prefixed with `VITE_`** for it to be exposed to the application.

    ```.env
    VITE_API_KEY=YOUR_API_KEY_HERE
    ```
    
4.  **Run the development server:**
    ```sh
    npm run dev
    # or
    yarn dev
    ```

The application should now be running on `http://localhost:5173`.

---
## License

This project is licensed under the MIT License - see the `LICENSE` file for details.